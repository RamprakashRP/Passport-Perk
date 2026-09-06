import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDaysRemaining(arrivalDateStr: string): { days: number; text: string; isPast: boolean } {
  if (!arrivalDateStr) {
    return { days: 45, text: "T-45 Days to Arrival", isPast: false };
  }

  const arrival = new Date(arrivalDateStr);
  const now = new Date();
  const diffTime = arrival.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays)) {
    return { days: 45, text: "T-45 Days to Arrival", isPast: false };
  }

  if (diffDays < 0) {
    return { days: Math.abs(diffDays), text: `Day +${Math.abs(diffDays)} Post-Arrival`, isPast: true };
  } else if (diffDays === 0) {
    return { days: 0, text: "Arrival Day (T-0)", isPast: false };
  } else {
    return { days: diffDays, text: `T-${diffDays} Days to Waterloo Arrival`, isPast: false };
  }
}
