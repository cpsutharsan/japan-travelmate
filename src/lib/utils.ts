import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {})
  }
}

export function formatJPY(n: number) {
  return `¥${n.toLocaleString('en-JP')}`
}
export function formatAED(n: number) {
  return `AED ${n.toLocaleString('en-AE', { maximumFractionDigits: 2 })}`
}

export const JPY_TO_AED_DEFAULT = 0.025
