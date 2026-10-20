/**
 * Global error message extractor
 *
 * Accepts an axios error, an API response body, an Error, or a string and
 * returns the most specific human-readable message available.
 *
 * Priority:
 * 1. First field error from `errors` (e.g. Laravel validation errors)
 * 2. `message` / `error` from the API response body
 * 3. The Error's own message
 * 4. The provided fallback
 *
 * @example
 * // { status: 'error', message: 'Validation failed', errors: { username: ['The provided credentials are incorrect.'] } }
 * getErrorMessage(error, 'Login failed') // => 'The provided credentials are incorrect.'
 */

const firstFieldError = (errors) => {
  if (!errors) return null
  if (typeof errors === 'string') return errors

  const values = Array.isArray(errors) ? errors : Object.values(errors)
  for (const value of values) {
    if (typeof value === 'string' && value) return value
    if (Array.isArray(value) && value.length) {
      const msg = value.find((v) => typeof v === 'string' && v)
      if (msg) return msg
    }
    if (value && typeof value === 'object') {
      const nested = firstFieldError(value)
      if (nested) return nested
    }
  }
  return null
}

const fromBody = (data) => {
  if (!data) return null
  if (typeof data === 'string') return data
  return (
    firstFieldError(data.errors) ||
    (typeof data.message === 'string' && data.message) ||
    (typeof data.error === 'string' && data.error) ||
    null
  )
}

export const getErrorMessage = (source, fallback = 'Something went wrong') => {
  if (!source) return fallback
  if (typeof source === 'string') return source

  // Axios error with a server response
  if (source.response) {
    const msg = fromBody(source.response.data)
    if (msg) return msg
  }

  // Raw API response body ({ status, message, errors })
  if (source.errors || source.status === 'error') {
    const msg = fromBody(source)
    if (msg) return msg
  }

  if (typeof source.message === 'string' && source.message) return source.message
  if (typeof source.error === 'string' && source.error) return source.error

  return fallback
}

export default getErrorMessage
