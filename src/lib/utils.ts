import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Settings } from '@/app/lib/data';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CONVERSION_RATES: Record<Settings['currency'], number> = {
    '€': 0.90, // 1 USD = 0.90 EUR
    '$': 1,
    '£': 0.80, // 1 USD = 0.80 GBP
    '¥': 157,  // 1 USD = 157 JPY
};
  

export function convertAndRound(amountInUsd: number, currency: Settings['currency']): number {
    if (currency === '$') {
        return Math.round(amountInUsd / 10) * 10;
    }
    const rate = CONVERSION_RATES[currency];
    const convertedAmount = amountInUsd * rate;
    // Round to the nearest 10
    return Math.round(convertedAmount / 10) * 10;
}
