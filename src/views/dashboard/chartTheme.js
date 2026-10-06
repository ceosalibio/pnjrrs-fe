// Shared colors and helpers for the dashboard charts (display only)

export const CHART_PRIMARY = '#1f73b7'
export const CHART_PRIMARY_FILL = 'rgba(31, 115, 183, 0.12)'
export const CHART_GRID = 'rgba(0, 0, 0, 0.06)'
export const CHART_TEXT = '#555'

export const REDCON_COLORS = {
  R1: '#2ca02c', // Green
  R2: '#1f77b4', // Blue
  R3: '#ff7f0e', // Orange
  R4: '#d62728'  // Red
}

/**
 * Percent of submitted reports (0-100) from a stats row, or null if unknown
 */
export const getSubmittedPercent = (stats) => {
  const submitted = Number(stats?.submitted)
  const notSubmitted = Number(stats?.not_submitted)
  const total = submitted + notSubmitted
  if (!Number.isFinite(total) || total <= 0) return null
  return Math.round((submitted / total) * 100)
}

const MONTHS =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * "06/2026" -> "Jun 2026". Anything else is returned unchanged.
 */
export const formatMonthLabel = (label) => {
  const match = /^(\d{1,2})\/(\d{4})$/.exec(String(label ?? ''))
  if (!match) return label
  const month = MONTHS[Number(match[1]) - 1]
  return month ? `${month} ${match[2]}` : label
}
