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

/**
 * Stats row holding the submitted / not submitted counts of the user's own unit for a month.
 * Non-HPN responses are already scoped to the unit (total row); HPN responses list every
 * unit, so the unit's own row is used instead of the all-units total.
 */
export const getUnitSubmissionRow = (rows, month, unitId) => {
  const monthRows = (rows || []).filter(r => r.report_month == month)
  const total = monthRows.find(r => r.is_total)
  if (total && total.unit_id == unitId) return total
  return monthRows.find(r => !r.is_total && r.unit_id == unitId) || {}
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
