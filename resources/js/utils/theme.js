export const THEME_MODE_KEY = 'themeMode'

const normalizeMode = (mode) => {
  if (mode === 'dark' || mode === 'light' || mode === 'auto') {
    return mode
  }

  return 'auto'
}

export const getStoredThemeMode = () => {
  try {
    const storedMode = localStorage.getItem(THEME_MODE_KEY)
    return normalizeMode(storedMode)
  } catch (error) {
    return 'auto'
  }
}

export const getAutoThemeByTime = (date = new Date()) => {
  const hour = date.getHours()
  return hour >= 18 || hour < 6 ? 'dark' : 'light'
}

export const getActiveTheme = (mode) => {
  const normalizedMode = normalizeMode(mode)
  if (normalizedMode === 'auto') {
    return getAutoThemeByTime()
  }

  return normalizedMode
}

const applyThemeClasses = (mode) => {
  const activeTheme = getActiveTheme(mode)

  if (typeof document === 'undefined') {
    return activeTheme
  }

  const root = document.documentElement
  const body = document.body

  root.classList.toggle('dark-layout', activeTheme === 'dark')
  if (body) {
    body.classList.toggle('dark-layout', activeTheme === 'dark')
    body.setAttribute('data-theme-mode', normalizeMode(mode))
    body.setAttribute('data-theme-active', activeTheme)
  }

  return activeTheme
}

export const applyThemeMode = (mode) => {
  const normalizedMode = normalizeMode(mode)
  return applyThemeClasses(normalizedMode)
}

export const setThemeMode = (mode) => {
  const normalizedMode = normalizeMode(mode)

  try {
    localStorage.setItem(THEME_MODE_KEY, normalizedMode)
  } catch (error) {
  }

  return applyThemeClasses(normalizedMode)
}
