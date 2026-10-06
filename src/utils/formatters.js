/**
 * Shared Formatting Utilities for Bank Indonesia Zonasi Command Center
 */

/**
 * Format number into Indonesian Rupiah currency string (e.g. "Rp 1.500.000" or "Rp 2,4 M")
 * @param {number|string} amount
 * @param {boolean} [compact=false]
 * @returns {string}
 */
export function formatRupiah(amount, compact = false) {
  const num = Number(amount) || 0
  if (compact) {
    if (Math.abs(num) >= 1_000_000_000_000) {
      return `Rp ${(num / 1_000_000_000_000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} T`
    }
    if (Math.abs(num) >= 1_000_000_000) {
      return `Rp ${(num / 1_000_000_000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} M`
    }
    if (Math.abs(num) >= 1_000_000) {
      return `Rp ${(num / 1_000_000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Jt`
    }
  }
  return `Rp ${Math.round(num).toLocaleString('id-ID')}`
}

/**
 * Format number with Indonesian thousand separators (e.g. 1.250.000)
 * @param {number|string} value
 * @param {number} [decimals=0]
 * @returns {string}
 */
export function formatNumber(value, decimals = 0) {
  const num = Number(value) || 0
  return num.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * Format percentage string (e.g. "12,5%")
 * @param {number|string} value
 * @param {number} [decimals=1]
 * @returns {string}
 */
export function formatPercent(value, decimals = 1) {
  const num = Number(value) || 0
  return `${num.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}%`
}

/**
 * Format compact volume (e.g. "1,2 Rb", "4,5 Jt")
 * @param {number|string} count
 * @returns {string}
 */
export function formatCompactCount(count) {
  const num = Number(count) || 0
  if (Math.abs(num) >= 1_000_000) {
    return `${(num / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`
  }
  if (Math.abs(num) >= 1_000) {
    return `${(num / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Rb`
  }
  return num.toLocaleString('id-ID')
}
