import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test-utils/mockMatchMedia";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the initial match state", () => {
    const query = "(pointer: fine)";
    mockMatchMedia({ [query]: true });

    const { result } = renderHook(() => useMediaQuery(query));

    expect(result.current).toBe(true);
  });

  it("returns false when the query does not match", () => {
    const query = "(pointer: fine)";
    mockMatchMedia({ [query]: false });

    const { result } = renderHook(() => useMediaQuery(query));

    expect(result.current).toBe(false);
  });

  it("updates when the media query changes", () => {
    const query = "(prefers-reduced-motion: reduce)";
    const { getList } = mockMatchMedia({ [query]: false });

    const { result } = renderHook(() => useMediaQuery(query));
    expect(result.current).toBe(false);

    act(() => {
      getList(query).emitChange(true);
    });

    expect(result.current).toBe(true);
  });
});
