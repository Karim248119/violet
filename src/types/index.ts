import * as LucideIcons from "lucide-react";

export type MenuType = {
  id: number;
  name: string;
  icon: keyof typeof LucideIcons;
  items: MenuItemType[];
  createdAt: Date;
};

export type MenuItemType = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  menuId: number;
  menu: MenuType;
  orderItems: OrderItem[];
  createdAt: Date;
};

export type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff" | "customer";
  orders: OrderType[];
  createdAt: Date;
};

export type OrderType = {
  id: number;
  userId: number;
  user: UserType;
  items: OrderItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
};

export type OrderItem = {
  id: number;
  orderId: number;
  order: OrderType;
  menuItemId: number;
  menuItem: MenuItemType;
  quantity: number;
  createdAt: Date;
};
