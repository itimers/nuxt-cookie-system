// composables/useCookies.ts
type Theme = 'light' | 'dark' | 'blue' | 'green' | 'emerald' | 'premium'

type CookieOption = {
  id: number
  protected: boolean
  name: string
  value: boolean
  class: string
}

type CookieCategory = {
  id: number
  protected: boolean
  name: string
  value: boolean
  class: string
  description: string
  options?: CookieOption[]
}

/* -------------------------------- Helpers -------------------------------- */
const isClient = () => typeof window !== 'undefined'

const ls = {
  get: (k: string) => (isClient() ? localStorage.getItem(k) : null),
  set: (k: string, v: string) => { if (isClient()) localStorage.setItem(k, v) },
  rm: (k: string) => { if (isClient()) localStorage.removeItem(k) },
  clear: () => { try { isClient() && localStorage.clear() } catch { /* noop */ } },
}

const addOrRemoveStylesheet = (id: string, href: string, active: boolean) => {
  if (!isClient()) return
  const existing = document.getElementById(id) as HTMLLinkElement | null
  if (active && !existing) {
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = href
    document.head.appendChild(link)
  } else if (!active && existing) {
    existing.remove()
  }
}

/* ------------------------------- Composable ------------------------------- */
export function useCookies() {
  // state
  const isModalCookie = ref(false)
  const isMoreOptions = ref(false)
  const isAccepted = ref(false)
  const localstorage = ref(true)
  const localStorageEnabled = ref(true)

  const cookies = reactive<CookieCategory[]>([
    {
      id: 1,
      protected: false,
      name: 'marketing',
      value: false,
      class: 'm',
      description:
        'Marketing cookies are used to track user behavior on the website and to improve the user experience.',
      options: [
        { id: 1, protected: false, name: 'ip', value: false, class: '' },
        { id: 2, protected: false, name: 'country', value: false, class: '' },
        { id: 3, protected: false, name: 'timezone', value: false, class: '' },
        { id: 4, protected: false, name: 'time', value: false, class: '' },
        { id: 5, protected: false, name: 'spenttime', value: false, class: '' },
        { id: 6, protected: false, name: 'chatbot', value: false, class: '' },
      ],
    },
    {
      id: 2,
      protected: false,
      name: 'socials',
      value: false,
      class: 's',
      description:
        'Social media cookies are used to track user behavior on the website and to improve the user experience.',
      options: [
        { id: 1, protected: true, name: 'google', value: true, class: '' },
        { id: 2, protected: false, name: 'facebook', value: false, class: '' },
        { id: 3, protected: false, name: 'youtube', value: false, class: '' },
        { id: 4, protected: false, name: 'instagram', value: false, class: '' },
        { id: 5, protected: false, name: 'tiktok', value: false, class: '' },
        { id: 6, protected: false, name: 'linkedin', value: false, class: '' },
      ],
    },
    {
      id: 3,
      protected: false,
      name: 'performance',
      value: false,
      class: 'p',
      description:
        'Performance cookies are used to track user behavior on the website and to improve the user experience.',
      options: [
        { id: 1, protected: false, name: 'themes', value: false, class: '' },
        { id: 2, protected: false, name: 'prefers', value: false, class: '' },
        { id: 3, protected: false, name: 'langs', value: false, class: '' },
        { id: 4, protected: false, name: 'localstorage', value: false, class: '' },
        { id: 5, protected: false, name: 'scroll-listeners', value: false, class: '' },
        { id: 6, protected: false, name: 'section-pagination', value: false, class: '' },
        { id: 7, protected: false, name: 'slider', value: false, class: '' },
        { id: 8, protected: false, name: 'modals', value: false, class: '' },
        { id: 9, protected: false, name: 'menus', value: false, class: '' },
        { id: 10, protected: false, name: 'animations', value: false, class: 'a' },
        { id: 11, protected: false, name: 'transitions', value: false, class: 't' },
        { id: 12, protected: false, name: 'blur', value: false, class: 'b' },
        { id: 13, protected: false, name: 'auth-user', value: false, class: '' },
      ],
    },
  ])


  const isStaticCookie = useCookie('isStatic', {
    default: () => true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    httpOnly: false,
    path: '/',
  }) as Ref<boolean> 

  const isStatic = computed<boolean>(() => isStaticCookie.value)
  const setStatic = (value: boolean): void => { isStaticCookie.value = value }
  const toggleStatic = (): void => { isStaticCookie.value = !isStaticCookie.value }
  const getIsStatic = (): boolean => isStaticCookie.value

  /* ----------------------------- Getters (fns) ---------------------------- */
  const isCookieActive = (name: string): boolean => {
    const cat = cookies.find(c => c.name === name)
    if (cat) return !!cat.value
    for (const c of cookies) {
      const opt = c.options?.find(o => o.name === name)
      if (opt) return !!opt.value
    }
    return false
  }

  /* ----------------------------- Core routines ---------------------------- */
  const save = () => {
    const minimal = cookies.map(c => ({
      id: c.id,
      value: c.value,
      protected: c.protected,
      options: c.options?.map(o => ({ id: o.id, value: o.value, protected: o.protected })),
    }))
    ls.set('cookies', JSON.stringify(minimal))
  }

  const load = () => {
    const raw = ls.get('cookies')
    if (!raw) return
    const parsed = JSON.parse(raw) as Array<{ id: number; value: boolean; protected?: boolean; options?: Array<{ id: number; value: boolean; protected?: boolean }> }>
    cookies.forEach(cat => {
      const saved = parsed.find(c => c.id === cat.id)
      if (!saved) return
      cat.value = saved.value
      if (typeof saved.protected === 'boolean') cat.protected = saved.protected
      if (cat.options && saved.options) {
        cat.options = cat.options.map(o => {
          const so = saved.options!.find(s => s.id === o.id)
          return so ? { ...o, value: so.value, protected: so.protected ?? o.protected } : o
        })
      }
    })
  }

  const manageDocumentClasses = () => {
    if (!isClient()) return
    const html = document.documentElement
    // skini sve
    cookies.forEach(cat => {
      cat.class && html.classList.remove(cat.class)
      cat.options?.forEach(o => o.class && html.classList.remove(o.class))
    })
    // dodaj aktivne class-e kategorija
    cookies.forEach(cat => { if (cat.value && cat.class) html.classList.add(cat.class) })
    // i opcija (tvoj originalni uslov: ako je !value → add class; ostavljam isto ponašanje)
    cookies.forEach(cat => cat.options?.forEach(o => { if (!o.value && o.class) html.classList.add(o.class) }))

    // stylesheets toggles (spojeno u jedan helper)
    addOrRemoveStylesheet('transitions-css', '/css/transitions.css', isCookieActive('transitions'))
    addOrRemoveStylesheet('scroll-css', '/css/scroll.css', isCookieActive('section-pagination'))
  }

  /* const { setTheme } = useUi() */
  const updateThemeBasedOnPrefers = () => {
    if (!isClient()) return
    const perf = cookies.find(c => c.name === 'performance')
    if (!perf) return
    const prefers = perf.options?.find(o => o.name === 'prefers')
    const themes = perf.options?.find(o => o.name === 'themes')

    // ako themes nisu aktivni → uvek light
    /* if (themes && !themes.value) { setTheme('light', true); return }

    // ako prefers aktivan → device preference
    if (prefers && prefers.value) {
      const deviceDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(deviceDark ? 'dark' : 'light', true)
      return
    }

    // inače default light
    setTheme('light', true) */
  }

  /* --------------------------------- API ---------------------------------- */
  const initializeCookies = () => {
    if (!isClient()) return
    try {
      load()
      const accepted = ls.get('cookieAccepted')
      isAccepted.value = accepted === 'true'
      isModalCookie.value = accepted === null || accepted === undefined
      manageDocumentClasses()
    } catch {
      isModalCookie.value = true
      isAccepted.value = false
    }
  }

  const toggleCookie = (name: string) => {
    // prvo probaj kategoriju
    const cat = cookies.find(c => c.name === name)
    if (cat) {
      if (!cat.protected) {
        cat.value = !cat.value
        cat.options?.forEach(o => { if (!o.protected) o.value = cat.value })
      }
    } else {
      // pa opciju
      for (const c of cookies) {
        const opt = c.options?.find(o => o.name === name)
        if (!opt) continue
        if (!opt.protected) {
          opt.value = !opt.value
          // special-case: localstorage
          if (opt.name === 'localstorage' && !opt.value) {
            ls.clear()
            ls.set('cookieAccepted', 'true')
            localstorage.value = false
          }
          // sync kategoriju ako su sve opcije off
          if (opt.value && !c.protected) c.value = true
          if (!opt.value) {
            const allOff = c.options?.every(o => !o.value || o.protected)
            if (allOff && !c.protected) c.value = false
          }
        }
        break
      }
    }

    // special handling: teme/prefers
    if (['themes', 'prefers', 'performance'].includes(name)) {
      updateThemeBasedOnPrefers()
    }

    manageDocumentClasses()
    save()
  }

  const acceptAllCookies = () => {
    cookies.forEach(c => {
      if (!c.protected) c.value = true
      c.options?.forEach(o => { if (!o.protected) o.value = true })
    })
    updateThemeBasedOnPrefers()
    manageDocumentClasses()
    save()
    isAccepted.value = true
    isModalCookie.value = false
    ls.set('cookieAccepted', 'true')
  }

  const declineAllCookies = () => {
    cookies.forEach(c => {
      if (!c.protected) c.value = false
      c.options?.forEach(o => { if (!o.protected) o.value = false })
    })
    updateThemeBasedOnPrefers()
    manageDocumentClasses()
    ls.clear()
    // ls.set('cookieAccepted', 'true') // kao u tvom kodu: ostavljeno isključeno
    isAccepted.value = true
    isModalCookie.value = false
  }

  const resetCookiesToDefault = () => {
    cookies.forEach(c => {
      if (!c.protected) c.value = false
      c.options?.forEach(o => { if (!o.protected) o.value = false })
    })
    updateThemeBasedOnPrefers()
    manageDocumentClasses()
    ls.clear()
    save()
  }

  const acceptSelectedCookies = () => {
    manageDocumentClasses()
    updateThemeBasedOnPrefers()
    save()
    isAccepted.value = true
    isModalCookie.value = false
    ls.set('cookieAccepted', 'true')
  }

  const setLocalStorageEnabled = (v: boolean) => {
    localstorage.value = v
    if (v) {
      ls.set('localstorage', JSON.stringify(v))
      save()
    } else {
      ls.clear()
      ls.set('cookieAccepted', 'true')
    }
  }

  /* --------------------------------- return -------------------------------- */
  return {
    // state
    cookies,
    isModalCookie, isMoreOptions, isAccepted,
    localstorage, localStorageEnabled,

    // getters (as functions)
    isCookieActive,

    // actions
    initializeCookies,
    toggleCookie,
    acceptAllCookies,
    declineAllCookies,
    resetCookiesToDefault,
    acceptSelectedCookies,
    setLocalStorageEnabled,


    isStatic,
    setStatic,
    toggleStatic,
    getIsStatic,
  }
}
