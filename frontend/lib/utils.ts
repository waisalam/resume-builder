import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx and then tailwind-merge to resolve conflicts.
 * Handles undefined, null, and falsy inputs gracefully.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}