import type { Order } from "@coffee-daily/types";

export const orders: Order[] = [
  {
    id: "order_cd-10482",
    receiptNumber: "CD-10482",
    locationId: "loc_fulton-market",
    status: "preparing",
    items: [
      {
        id: "item_1",
        productName: "Iced Cold Brew",
        vessel: "Glass",
        size: "M",
        quantity: 1,
        unitPriceMinor: 450,
      },
      {
        id: "item_2",
        productName: "Oat Milk Latte",
        vessel: "Ceramic mug",
        size: "L",
        quantity: 2,
        unitPriceMinor: 525,
      },
    ],
    subtotalMinor: 1500,
    totalMinor: 1500,
    phone: "+13125550142",
    createdAt: "2026-08-11T15:00:00.000Z",
  },
];
