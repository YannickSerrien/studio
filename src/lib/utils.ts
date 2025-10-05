
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Settings } from '@/app/lib/data';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CONVERSION_RATES: Record<string, number> = {
    '€': 0.93, // 1 USD = 0.93 EUR
    '$': 1,
    '£': 0.79, // 1 USD = 0.79 GBP
    '¥': 157,  // 1 USD = 157 JPY
};
  

export function convertAndRound(amountInUsd: number, currency: Settings['currency']): number {
    const rate = CONVERSION_RATES[currency];
    const convertedAmount = amountInUsd * rate;
    
    if (currency === '$') {
        // Don't round USD, just return the value, maybe rounded to nearest int
        return Math.round(convertedAmount);
    }
    
    // For other currencies, round to the nearest 10
    return Math.round(convertedAmount / 10) * 10;
}
