import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function converAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function converAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
