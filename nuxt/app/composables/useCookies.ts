export function useCookies() {
  const cookiePreferences = useCookie('cookie-preferences', { maxAge: 60 * 60 * 24 * 365, path: '/', sameSite: 'lax' })
  const is = (identifier: string): boolean => {
    const preferences = cookiePreferences.value
    if (!preferences) return false
    try {
      const cookieData = typeof preferences === 'string' ? JSON.parse(preferences) : preferences
      if (!cookieData || !Array.isArray(cookieData)) return false
      const category = cookieData.find((cat: any) => cat.name === identifier)
      if (category) return category.value === true
      for (const cat of cookieData) {
        const option = cat.options?.find((opt: any) => opt.name === identifier)
        if (option) return option.value === true
      }
      return false
    } catch (error) {
      console.error('Failed to parse cookie preferences:', error)
      return false
    }
  }
  return { is }
}
