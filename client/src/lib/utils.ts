import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getDaysBetweenDates(start: Date, end: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((start.getTime() - end.getTime()) / oneDay));
  return diffDays + 1; // Include both start and end days
}

export function calculateTotalPrice(pricePerDay: number, startDate: Date, endDate: Date): number {
  const days = getDaysBetweenDates(startDate, endDate);
  return pricePerDay * days;
}
