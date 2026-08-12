import { test } from "@playwright/test";

async function layerState(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const el = document.querySelector<HTMLElement>(
      'body > div[aria-hidden="true"]',
    )!;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      w: Math.round(r.width),
      blend: s.mixBlendMode,
      backdrop: s.backdropFilter,
      bg: s.backgroundColor,
      text: (el.textContent ?? "").trim(),
    };
  });
}

test("verify: blur applies to the circle only", async ({ page }) => {
  await page.goto("/menu");
  await page.waitForTimeout(900);
  await page.mouse.move(640, 200);
  await page.mouse.move(650, 210);
  await page.waitForTimeout(500);
  console.log("IDLE:", JSON.stringify(await layerState(page)));

  await page.getByRole("link", { name: /Iced Cold Brew/ }).hover();
  await page.waitForTimeout(600);
  console.log("OVER PRODUCT:", JSON.stringify(await layerState(page)));

  await page.goto("/");
  await page.waitForTimeout(900);
  await page.mouse.move(400, 400);
  await page.getByRole("link", { name: "Menu", exact: true }).first().hover();
  await page.waitForTimeout(600);
  console.log("OVER NAV LINK:", JSON.stringify(await layerState(page)));
});

test("verify: frame cost of backdrop blur while hovering a grid", async ({
  page,
}) => {
  await page.goto("/menu");
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    (window as unknown as { __f: number[] }).__f = [];
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      (window as unknown as { __f: number[] }).__f.push(now - last);
      last = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  for (let i = 0; i < 40; i++) {
    await page.mouse.move(300 + ((i * 53) % 700), 300 + ((i * 37) % 300));
    await page.waitForTimeout(45);
  }
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 150);
    await page.mouse.move(400 + ((i * 31) % 500), 350);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(1200);

  const stats = await page.evaluate(() => {
    const f = (window as unknown as { __f: number[] }).__f.slice(5);
    const s = [...f].sort((a, b) => a - b);
    return {
      count: f.length,
      median: +(s[Math.floor(s.length / 2)] ?? 0).toFixed(2),
      p95: +(s[Math.floor(s.length * 0.95)] ?? 0).toFixed(2),
      max: +Math.max(...f).toFixed(2),
      over32ms: f.filter((x) => x > 32).length,
    };
  });
  console.log("FRAMES:", JSON.stringify(stats));
});
