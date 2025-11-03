interface CookieCategory {
  id: number
  protected: boolean
  name: string
  value: boolean
  description: string
  options?: CookieOption[]
}

interface CookieOption {
  id: number
  protected: boolean
  name: string
  value: boolean
  is: string
}

const DEFAULT_COOKIES: CookieCategory[] = [
  { 
    id: 1, 
    protected: false, 
    name: 'Marketing', 
    value: false, 
    description: 'Marketing kolačići pomažu u praćenju ponašanja na vebsajtu i poboljšanju korisničkog iskustva.', 
    options: [
      { id: 1, protected: true, name: 'Google Analytics', is:'analytics', value: true }, 
      { id: 2, protected: false, name: 'Location services', is:'location', value: false }, 
      { id: 3, protected: false, name: 'Ai employee', is:'ai', value: false }
    ] 
  },
  { 
    id: 2, 
    protected: false, 
    name: 'Performance', 
    value: false, 
    description: 'Performance kolačići pomažu u poboljšanju korisničkog iskustva. (Ukoliko imate lošiju konekciju ili sporiji uređaj preporučujemo da isključite sve opcije)', 
    options: [
      { id: 1, protected: false, name: 'Themes', is:'themes', value: false }, 
      { id: 2, protected: false, name: 'Device prefered theme', is:'prefers', value: false }, 
      { id: 3, protected: false, name: 'Languages', is:'locales', value: false }, 
      { id: 4, protected: false, name: 'Auto save', is:'localstorage', value: false }, 
      { id: 5, protected: false, name: 'Scroll listeners', is:'scroll', value: false }, 
      { id: 6, protected: false, name: 'Section pagination', is:'pagination', value: false }, 
      { id: 7, protected: false, name: 'Slider', is:'slider', value: false }, 
      { id: 8, protected: false, name: 'Modals', is:'modals', value: false }, 
      { id: 9, protected: false, name: 'Menus', is:'menus', value: false }, 
      { id: 10, protected: false, name: 'Animations', is:'animations', value: false }, 
      { id: 11, protected: false, name: 'Transitions', is:'transitions', value: false }, 
      { id: 12, protected: false, name: 'Blur', is:'blur', value: false }
    ] 
  }
]

export function useCookies() {
  const cookiePreferences = useCookie('cookie-preferences', { maxAge: 60 * 60 * 24 * 365, path: '/', sameSite: 'lax' })
  const cookieStatus = useCookie<'waiting' | 'accepted' | 'rejected'>('cookie-accepted', { maxAge: 60 * 60 * 24 * 365, path: '/', sameSite: 'lax', default: () => 'waiting' })
  
  const allCookies = ref<CookieCategory[]>(DEFAULT_COOKIES)
  
  const is = (identifier: string): boolean => {
    const preferences = cookiePreferences.value
    if (!preferences) return false
    try {
      const cookieData = typeof preferences === 'string' ? JSON.parse(preferences) : preferences
      if (!cookieData || !Array.isArray(cookieData)) return false
      const category = cookieData.find((cat: any) => cat.is === identifier)
      if (category) return category.value === true
      for (const cat of cookieData) {
        const option = cat.options?.find((opt: any) => opt.is === identifier)
        if (option) return option.value === true
      }
      return false
    } catch (error) {
      console.error('Failed to parse cookie preferences:', error)
      return false
    }
  }

  const readCookies = () => {
    const preferences = cookiePreferences.value
    if (!preferences) return null
    try {
      return typeof preferences === 'string' ? JSON.parse(preferences) : preferences
    } catch (error) {
      console.error('Failed to parse cookie preferences:', error)
      return null
    }
  }

  const toggleCookie = (cookieIs: string) => {
    const cookieData = readCookies()
    if (!cookieData || !Array.isArray(cookieData)) return
    
    const category = cookieData.find((cat: any) => cat.is === cookieIs)
    if (category && !category.protected) {
      category.value = !category.value
    }
    
    for (const cat of cookieData) {
      const option = cat.options?.find((opt: any) => opt.is === cookieIs)
      if (option && !option.protected) {
        option.value = !option.value
        break
      }
    }
    
    cookiePreferences.value = cookieData as any
    allCookies.value = cookieData
  }

  const manageTransitionsCSS = () => {
    if (!import.meta.client) return;
    const transitionsActive = is('transitions');
    const existingLink = document.getElementById('transitions-css') as HTMLLinkElement;

    if (transitionsActive && !existingLink) {
      const link = document.createElement('link');
      link.id = 'transitions-css';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = '/css/transitions.css';
      document.head.appendChild(link);
    } else if (!transitionsActive && existingLink) {
      document.head.removeChild(existingLink);
    }
  }

  const loadSavedPreferences = () => {
    manageTransitionsCSS()
    const savedCookies = readCookies()
    if (!savedCookies) return
    try {
      if (Array.isArray(savedCookies)) {
        allCookies.value = savedCookies
      } 
    } catch (e) { console.error('❌ Failed to load preferences:', e) }
  }

  const acceptAllCookies = () => {
    allCookies.value.forEach(category => { 
      if (!category.protected) { category.value = true } 
      category.options?.forEach(option => { 
        if (!option.protected) { option.value = true } 
      }) 
    })
    cookieStatus.value = 'accepted'
    cookiePreferences.value = allCookies.value as any
    console.log('✅ All cookies accepted')
    
    applyDeviceThemeIfActive()
  }

  const savePreferences = () => {
    cookieStatus.value = 'accepted'
    cookiePreferences.value = allCookies.value as any
    console.log('✅ Preferences saved')
    
    applyDeviceThemeIfActive()
  }

  const applyDeviceThemeIfActive = () => {
    if (!import.meta.client) return
    
    if (is("prefers")) {
      /* const { applyTheme, saveThemeToStorage } = useTheme()
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      const themeToApply = prefersDarkMode ? "dark" : "light"
      applyTheme(themeToApply)
      saveThemeToStorage(themeToApply) */
    }
  }

  const rejectAllCookies = () => {
    allCookies.value.forEach(category => { 
      if (!category.protected) { category.value = false } 
      category.options?.forEach(option => { 
        if (!option.protected) { option.value = false } 
      }) 
    })
    cookieStatus.value = 'rejected'
    cookiePreferences.value = allCookies.value as any
    console.log('❌ All cookies rejected (except protected ones)')
    
    if (import.meta.client) {
      /* const { applyTheme, saveThemeToStorage } = useTheme()
      applyTheme('light')
      saveThemeToStorage('light') */
    }
  }

  const isCookieDecided = computed(() => cookieStatus.value !== 'waiting')
  const isAccepted = computed(() => cookieStatus.value === 'accepted')

  return { 
    is, 
    readCookies, 
    toggleCookie,
    allCookies,
    loadSavedPreferences,
    manageTransitionsCSS,
    acceptAllCookies,
    savePreferences,
    rejectAllCookies,
    isCookieDecided,
    isAccepted,
    cookieStatus
  }
}
