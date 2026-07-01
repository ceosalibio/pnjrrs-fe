/**
 * Personnel Calculations Utility
 * Handles all grade point, rating, and readiness calculations
 */

/**
 * Grade mapping for all personnel types
 */
const GRADE_MAP = {
  // Officer grades
  'O10': 10, 'O9': 9, 'O8': 8, 'O7': 7, 'O6': 6,
  'O5': 5, 'O4': 4, 'O3': 3, 'O2': 2, 'O1': 1,
  // Enlisted grades
  'E10': 10, 'E9': 9, 'E8': 8, 'E7': 7, 'E6': 6,
  'E5': 5, 'E4': 4, 'E3': 3, 'E2': 2, 'E1': 1,
  // Civilian grades
  'SG24': 24, 'SG23': 23, 'SG22': 22, 'SG21': 21, 'SG20': 20,
  'SG19': 19, 'SG18': 18, 'SG17': 17, 'SG16': 16, 'SG15': 15,
  'SG14': 14, 'SG13': 13, 'SG12': 12, 'SG11': 11, 'SG10': 10,
  'SG9': 9, 'SG8': 8, 'SG7': 7, 'SG6': 6, 'SG5': 5,
  'SG4': 4, 'SG3': 3, 'SG2': 2, 'SG1': 1
}

/**
 * Calculate grade points based on required vs actual grade
 * Only same grade system can earn points (O to O, E to E, SG to SG)
 * @param {string} requiredGrade - The required grade (e.g., "O6", "E3")
 * @param {string} actualGrade - The actual grade assigned
 * @returns {number} Grade points (1, 0.5, or 0)
 */
export const calculateGradePoints = (requiredGrade, actualGrade) => {
  if (!requiredGrade || !actualGrade) return 0

  const requiredValue = GRADE_MAP[requiredGrade]
  const actualValue = GRADE_MAP[actualGrade]

  if (requiredValue === undefined || actualValue === undefined) return 0

  // Extract grade system prefix (O, E, SG)
  const requiredSystem = requiredGrade.match(/^[A-Z]+/)[0]
  const actualSystem = actualGrade.match(/^[A-Z]+/)[0]

  // Grades must be from same system to earn points
  if (requiredSystem !== actualSystem) {
    return 0
  }

  const difference = requiredValue - actualValue

  // If actual grade equals required grade, or actual is only 1 level lower
  if (difference === 0 || difference === 1) {
    return 1
  }
  // If actual grade is exactly 2 levels lower (minor shortage)
  else if (difference === 2) {
    return 0.5
  }
  // If actual grade is 3+ levels lower, or higher than required (not meeting requirement)
  else {
    return 0
  }
}

/**
 * Format personnel name based on division
 * @param {string} name - The name to format
 * @param {number} division - Division ID (1=Officer, 2=Enlisted, 3=Civilian)
 * @returns {string} Formatted name
 */
export const formatPersonnelName = (name, division) => {
  if (!name) return ''
  if (division === 1) {
    // Officer: force uppercase
    return name.toUpperCase()
  }
  // Enlisted and Civilian: capitalize first letter of each word
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Calculate payload summary from personnel items
 * @param {Array} items - Personnel items array
 * @returns {Object} Summary with gradePoints, afposPoints, actualCount
 */
export const calculatePayloadSummary = (items) => {
  return {
    gradePoints: items.reduce((sum, item) => sum + (item.grade_points || 0), 0),
    afposPoints: items.reduce((sum, item) => sum + (item.afpos_points || 0), 0),
    actualCount: items.filter(item => item.grade_actual).length
  }
}


/**
 * Round number to 2 decimal places
 * @param {number} num - Number to round
 * @returns {number} Rounded number
 */
// const round = (num) => Math.round(num * 100) / 100
