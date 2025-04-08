import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Rupiah currency
 * @param amount - The amount to format (can be string or number)
 * @param options - Formatting options
 * @returns Formatted Rupiah string
 */
export function formatRupiah(
  amount: string | number,
  options: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    compact?: boolean
  } = {}
) {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    compact = false,
  } = options

  // Handle empty or invalid values
  if (amount === null || amount === undefined || amount === '') {
    return 'Rp0'
  }

  // Format the amount

  // Convert to number, handling potential parsing errors
  let numericAmount = 0
  try {
    numericAmount = typeof amount === "string" ? Number(amount) : amount
    // Check if the result is a valid number
    if (isNaN(numericAmount)) {
      numericAmount = 0
    }
  } catch (error) {
    numericAmount = 0
  }

  // Use Intl.NumberFormat for proper localization
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? "compact" : "standard",
    compactDisplay: "short",
  })

  // Format the amount and remove any spaces between currency symbol and amount
  // Also ensure the Rp symbol is properly displayed
  return formatter.format(numericAmount)
    .replace(/\s+/g, "") // Remove spaces
    .replace(/\u00A0/g, "") // Remove non-breaking spaces
}
