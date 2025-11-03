# 🍪 Nuxt Cookie Consent System

> 🌐 A modern, customizable, and GDPR-compliant cookie consent system built with Nuxt 3.

**📖 [Srpska verzija](README.sr.md) | English**

---

## ✨ About the Project

This project represents a **professional cookie consent system** developed in **Nuxt 3** with **TypeScript** and **composable architecture**. The system supports **granular cookie control**, **temporary staging**, **protected cookies**, **conditional loader**, and many other advanced features for GDPR compliance.

**Key highlights:**
- 🎨 Beautiful UI with smooth transitions and animations
- 🔧 Granular control over cookie categories and individual options
- ⚡ Performance optimized with conditional loader system
- 🎯 Smart state management with temporary staging
- 🌐 SSG compatible and hydration-safe
- 📱 Fully responsive design
- ♿ Accessible with ARIA labels

**The smart loader** only displays when cookies are accepted, improving Lighthouse performance scores and providing better user experience.

---

## 🎯 Key Features

### 🎛️ **Cookie Management**
- ✅ Accept All / Reject All quick actions
- ✅ Protected cookies that cannot be disabled
- ✅ Category-level control (toggle entire categories)
- ✅ Option-level control (fine-grained individual options)
- ✅ Persistent storage (preferences saved for 1 year)
- ✅ Temporary staging (preview changes before saving)

### 🎨 **User Interface**
- ✅ Smooth animations (fade and slide transitions)
- ✅ Customizable menu with expandable options
- ✅ Visual feedback (hover, active, click animations)
- ✅ Mobile optimized responsive design
- ✅ Floating action button for quick access
- ✅ Gradient backgrounds with blur effects

### 🛠️ **Developer Features**
- ✅ Simple `is()` function API for cookie checks
- ✅ Composable architecture (reusable Nuxt 3 composable)
- ✅ Full TypeScript support and type safety
- ✅ Easy integration (drop-in solution)
- ✅ Well documented with comprehensive examples
- ✅ Performance-first optimization

### 🚀 **Performance**
- ✅ Conditional loader (only when cookies accepted)
- ✅ Smart CSS loading (dynamic stylesheet management)
- ✅ Minimal bundle size (no heavy dependencies)
- ✅ Fast hydration (optimized for SSG/SSR)
- ✅ Lighthouse optimized (better FCP scores)

---

## 🛠️ Technologies

- **Framework:** Nuxt 3 (v4.1.3)
- **Language:** TypeScript
- **Runtime:** Vue 3 (v3.5.22)
- **Router:** Vue Router (v4.6.3)
- **Styling:** CSS with CSS Variables
- **Font:** Poppins (Google Fonts)

**Browser APIs:**
- 🍪 Cookie API for storing preferences
- 🎨 CSS Variables for dynamic theming
- 📱 Media Queries for responsive design
- 🎭 CSS Transitions for animations

---

## 📦 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/itimers/nuxt-cookie-system.git
cd nuxt-cookie-system/nuxt
```

### 2️⃣ Install dependencies

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

---

## 🚀 Running the Project

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production Build

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

### Static Site Generation (SSG)

Generate static site for deployment:

```bash
# npm
npm run generate

# pnpm
pnpm generate

# yarn
yarn generate

# bun
bun run generate
```

### Preview Production Build

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

---

## 🎮 Usage

### Basic Example

```vue
<template>
  <div>
    <!-- Show content only if analytics is enabled -->
    <div v-if="is('analytics')">
      <h3>Analytics Enabled</h3>
      <p>Google Analytics is tracking this page.</p>
    </div>

    <!-- Show content only if themes cookie is enabled -->
    <ThemeSelector v-if="is('themes')" />

    <!-- Show content only if entire Marketing category is enabled -->
    <AdsComponent v-if="is('marketing')" />
  </div>
</template>

<script setup>
const { is } = useCookies()
</script>
```

### Programmatic Cookie Management

```vue
<script setup>
const { 
  is,                      // Check if cookie is enabled
  allCookies,             // Reactive cookie state
  acceptAllCookies,       // Accept all cookies
  rejectAllCookies,       // Reject all (except protected)
  savePreferences,        // Save current preferences
  loadSavedPreferences,   // Load saved preferences
  isCookieDecided,        // Check if user made a choice
  cookieStatus            // 'waiting' | 'accepted' | 'rejected'
} = useCookies()

// Check multiple cookies
const canShowAds = computed(() => {
  return is('marketing') && is('analytics')
})

// Custom accept logic
const acceptMarketingOnly = () => {
  allCookies.value.forEach(category => {
    if (category.name === 'Marketing') {
      category.value = true
      category.options?.forEach(opt => {
        if (!opt.protected) opt.value = true
      })
    }
  })
  savePreferences()
}
</script>
```

### Conditional Loader System

The loader automatically shows only when cookies are accepted:

```typescript
// In nuxt.config.ts - already configured!
app: {
  head: {
    script: [{
      innerHTML: `
        (function() {
          var cookies = document.cookie.split(';');
          var cookieAccepted = cookies.find(function(c) { 
            return c.trim().startsWith('cookie-accepted='); 
          });
          var status = cookieAccepted ? cookieAccepted.split('=')[1] : 'waiting';
          
          var style = document.createElement('style');
          if (status === 'accepted') {
            style.innerHTML = '.page-loader { display: flex; }';
          } else {
            style.innerHTML = '.page-loader { display: none; }';
          }
          document.head.appendChild(style);
        })();
      `
    }]
  }
}
```

**Why this approach?**
- ⚡ Lighthouse Optimization - Prevents unnecessary loader on first visit
- 🎯 Better UX - Shows loader only to returning users
- 🚀 Faster Load Times - No loader delay for new visitors
- 📊 Better Scores - Improves First Contentful Paint (FCP)

---

## ⚙️ Options and Props

### 📋 **useCookies() API Reference**

| Function | Return Type | Description |
|----------|-------------|-------------|
| `is(identifier)` | `boolean` | 🔍 Check if specific cookie/category is enabled |
| `readCookies()` | `CookieCategory[] \| null` | 📖 Get current cookie preferences |
| `toggleCookie(cookieIs)` | `void` | 🔄 Toggle specific cookie on/off |
| `loadSavedPreferences()` | `void` | 💾 Load preferences from cookie storage |
| `acceptAllCookies()` | `void` | ✅ Accept all non-protected cookies |
| `rejectAllCookies()` | `void` | ❌ Reject all non-protected cookies |
| `savePreferences()` | `void` | 💾 Save current preferences to cookies |
| `manageTransitionsCSS()` | `void` | 🎨 Dynamically load/unload transition CSS |

### 📊 **Reactive State**

| Property | Type | Description |
|----------|------|-------------|
| `allCookies` | `Ref<CookieCategory[]>` | 🍪 Current state of all cookies |
| `isCookieDecided` | `ComputedRef<boolean>` | ✅ Whether user has made a choice |
| `isAccepted` | `ComputedRef<boolean>` | ✅ Whether cookies are accepted |
| `cookieStatus` | `Ref<string>` | 📊 Current status: 'waiting', 'accepted', 'rejected' |

### 🔧 **TypeScript Interfaces**

```typescript
interface CookieCategory {
  id: number
  protected: boolean      // Cannot be disabled by user
  name: string
  value: boolean
  description: string
  options?: CookieOption[]
}

interface CookieOption {
  id: number
  protected: boolean      // Cannot be disabled by user
  name: string
  value: boolean
  is: string             // Unique identifier for is() checks
}
```

---

## 🏗️ Project Structure

```
nuxt-cookie-system/nuxt/
├── � app/
│   ├── � components/
│   │   └── cookies.vue              # 🍪 Cookie banner component
│   ├── � composables/
│   │   └── useCookies.ts            # 🎯 Main cookie management composable
│   ├── � layouts/
│   │   └── default.vue              # 🖼️ Default layout with cookie system
│   └── � pages/
│       └── index.vue                # 🏠 Home page
├── � public/
│   └── robots.txt                   # 🤖 SEO robots file
├── nuxt.config.ts                   # ⚙️ Nuxt configuration with loader
├── package.json                     # 📦 Dependencies
├── tsconfig.json                    # 🔧 TypeScript configuration
└── README.md                        # � Documentation
```

### Key Files

**`app/composables/useCookies.ts`** - 🎯 Core cookie system logic  
**`app/layouts/default.vue`** - 🎨 Cookie UI and state management  
**`nuxt.config.ts`** - ⚙️ Loader configuration and app settings

---

## 🧩 Key Code Functionalities

### 1️⃣ **Temporary Cookie System (tempCookies)**

**Problem:** Users could accidentally enable cookies before saving.  
**Solution:** Staging system with preview:

```typescript
const tempCookies = ref<any>(null)

// Create deep copy for safe editing
const toggleCustomize = () => {
  if (isCustomizing.value) {
    tempCookies.value = JSON.parse(JSON.stringify(allCookies.value))
    originalPreferences.value = JSON.parse(JSON.stringify(allCookies.value))
  }
}

// Apply only on explicit save
const applyTempCookies = () => {
  if (tempCookies.value) {
    allCookies.value = JSON.parse(JSON.stringify(tempCookies.value))
  }
}
```

**Benefits:**
- ✅ Preview changes without applying
- ✅ Cancel and revert to original
- ✅ No accidental cookie enabling
- ✅ Better UX with explicit save

### 2️⃣ **Protected Cookies**

Essential cookies that cannot be disabled:

```typescript
const isOptionDisabled = (cookie: any, option: any) => {
  if (option.protected) return true
  // Additional logic...
}
```

**UI Behavior:**
- 🔒 Checkbox disabled
- 👁️ Visual indication (opacity, cursor)
- 🏷️ "Required" badge
- 🎨 Different color scheme

### 3️⃣ **Conditional Dependencies**

Example: "Device Preferred Theme" depends on "Themes":

```typescript
const isOptionDisabled = (cookie: any, option: any) => {
  if (option.is === 'prefers') {
    const themesOption = cookie.options?.find((opt: any) => opt.is === 'themes')
    return !themesOption?.value
  }
}
```

### 4️⃣ **Hydration-Safe Loader**

**Challenge:** SSG causes hydration mismatches.  
**Solution:** Inline script before hydration:

```javascript
// Runs synchronously before Vue hydration
var cookies = document.cookie.split(';')
var status = cookieAccepted ? cookieAccepted.split('=')[1] : 'waiting'

if (status === 'accepted') {
  style.innerHTML = '.page-loader { display: flex; }'
} else {
  style.innerHTML = '.page-loader { display: none; }'
}
```

**Why it works:**
- ✅ Runs before hydration (no mismatch)
- ✅ Direct cookie reading (no reactive state)
- ✅ CSS injection (no DOM manipulation)
- ✅ Fast execution (inline, no network)

---

## 🐛 Resolved Issues

### ✅ **Hydration Mismatch Warnings**
**Problem:** SSR/CSR cookie state differences caused hydration errors.  
**Solution:** Inline script in `nuxt.config.ts` runs before Vue hydration, using CSS injection instead of reactive state.

### ✅ **Immediate Cookie Application**
**Problem:** Toggling cookies in customize menu applied them immediately, not on save.  
**Solution:** Implemented `tempCookies` staging system that only applies changes when "Save Preferences" is clicked.

### ✅ **Unused CSS Variables**
**Problem:** 20+ CSS variables cluttering the codebase, many unused.  
**Solution:** Audited entire CSS and removed 11+ unused variables, keeping only 9 essential ones.

### ✅ **Poor Lighthouse Scores**
**Problem:** Loader showing on every page load hurt performance metrics.  
**Solution:** Conditional loader displays only when cookies are accepted, improving FCP and Lighthouse scores.

---

## 🎯 Use Cases

### 📸 **E-Commerce Website**
```vue
<!-- Show personalized recommendations only if tracking enabled -->
<div v-if="is('analytics') && is('marketing')">
  <RecommendedProducts :userId="currentUser.id" />
</div>
```

### 🛍️ **Multi-Language Platform**
```vue
<!-- Enable language switching only if locales cookie active -->
<LanguageSwitcher v-if="is('locales')" />
```

### 📰 **Theme System**
```vue
<script setup>
const { is } = useCookies()
const themeEnabled = computed(() => is('themes'))

watchEffect(() => {
  if (themeEnabled.value) {
    initializeThemeSystem()
  } else {
    setDefaultTheme()
  }
})
</script>
```

### 🎨 **Analytics Integration**
```vue
<script setup>
onMounted(() => {
  if (is('analytics')) loadGoogleAnalytics()
  if (is('facebook')) loadFacebookPixel()
})
</script>
```

---

## 📝 To-Do List

- [ ] � Multi-language support for cookie descriptions
- [ ] 🎨 Theme customization options
- [ ] 📊 Analytics dashboard for cookie acceptance rates
- [ ] 🔔 Cookie policy update notifications
- [ ] 💾 Export/Import preference profiles
- [ ] 🔐 Enhanced security options
- [ ] 📱 Mobile app integration
- [ ] 🎯 A/B testing for cookie UI
- [ ] ♿ Enhanced accessibility (WCAG 2.1 AAA)
- [ ] 📦 NPM package for easy installation

---

## 📄 License

MIT License - Feel free to use for commercial and non-commercial projects.

```
Copyright (c) 2025 ITimers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

## 👨‍💻 Author

**ITimers**
- 🌐 GitHub: [@itimers](https://github.com/itimers)

---

## 🤝 Contributing

Contributions are welcome! 

1. 🍴 Fork the project
2. 🔧 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

---

## 📞 Support

For questions and support:
- 🐛 Issues: [GitHub Issues](https://github.com/itimers/nuxt-cookie-system/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/itimers/nuxt-cookie-system/discussions)

---

<div align="center">

### ⭐ If you like the project, leave a star! ⭐

Made with ❤️ by ITimers

</div>