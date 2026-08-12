export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled"
  | "refunded";

export type OrderItem = {
  id: string;
  productName: string;
  vessel: string;
  size: string;
  quantity: number;
  unitPriceMinor: number;
};

export type Order = {
  id: string;
  receiptNumber: string;
  locationId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotalMinor: number;
  totalMinor: number;
  phone: string;
  createdAt: string;
};
