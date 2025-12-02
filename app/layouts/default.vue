<script lang="ts" setup>
const {
    is,
    allCookies,
    loadSavedPreferences,
    acceptAllCookies,
    savePreferences,
    rejectAllCookies,
    isCookieDecided,
} = useCookies();
const isCustomizing = ref(false);
const toggleCookiesMenu = ref(false);
const hasPreferencesChanged = ref(false);
const originalPreferences = ref<any>(null);
const tempCookies = ref<any>(null);


const toggleCustomize = () => {
    isCustomizing.value = !isCustomizing.value
    if (isCustomizing.value) {
        loadSavedPreferences()
        tempCookies.value = JSON.parse(JSON.stringify(allCookies.value))
        originalPreferences.value = JSON.parse(JSON.stringify(allCookies.value))
        hasPreferencesChanged.value = false
    } else {
        tempCookies.value = null
    }
}

const isOptionDisabled = (cookie: any, option: any) => {
    if (option.protected) return true;

    if (option.is === 'prefers') {
        const themesOption = cookie.options?.find((opt: any) => opt.is === 'themes');
        return !themesOption?.value;
    }

    return false;
}
const isCategoryFullyChecked = (cookie: any) => {
  if (!cookie.options || cookie.options.length === 0) return false
  
  const nonProtectedOptions = cookie.options.filter((opt: any) => !opt.protected)
  if (nonProtectedOptions.length === 0) return false
  
  return nonProtectedOptions.every((opt: any) => opt.value === true)
}
const toggleCategoryOptions = (cookie: any) => {
  if (!cookie.options || cookie.protected) return
  
  const isFullyChecked = isCategoryFullyChecked(cookie)
  console.log(`🔄 Toggle category "${cookie.name}": ${isFullyChecked ? 'Unchecking all' : 'Checking all'}`)
  
  cookie.options.forEach((option: any) => {
    if (option.protected) getRequestFingerprint
    
    if (isFullyChecked) {
      option.value = false
    } else {
      if (!isOptionDisabled(cookie, option)) {
        option.value = true
      }
    }
  })
  
  checkPreferencesChanged()
}
const handleCheckboxChange = (cookie: any, option: any) => {
    if (option.is === 'themes' && !option.value) {
        const devicePreferedOption = cookie.options?.find((opt: any) => opt.is === 'prefers');
        if (devicePreferedOption) {
            devicePreferedOption.value = false;
        }
    }

    if (!option.protected) {
        checkPreferencesChanged()
    }
}

const checkPreferencesChanged = () => {
    if (!originalPreferences.value || !tempCookies.value) {
        hasPreferencesChanged.value = false
        return
    }

    for (const cookie of tempCookies.value) {
        const originalCookie = originalPreferences.value.find((c: any) => c.id === cookie.id)
        if (!originalCookie || !cookie.options) continue

        for (const option of cookie.options) {
            if (option.protected) continue 

            const originalOption = originalCookie.options?.find((o: any) => o.id === option.id)
            if (originalOption && originalOption.value !== option.value) {
                hasPreferencesChanged.value = true
                return
            }
        }
    }

    hasPreferencesChanged.value = false
}

const applyTempCookies = () => {
    if (tempCookies.value) {
        allCookies.value = JSON.parse(JSON.stringify(tempCookies.value))
    }
}

const acceptAll = () => {
  console.log('✅ Accept All clicked')
  allCookies.value.forEach(category => { 
    if (!category.protected) { category.value = true } 
    category.options?.forEach(option => { 
      if (!option.protected) { option.value = true } 
    }) 
  })
  acceptAllCookies()
  tempCookies.value = null
}
const rejectAll = () => {
  console.log('❌ Reject All clicked')
  allCookies.value.forEach(category => { 
    if (!category.protected) { category.value = false } 
    category.options?.forEach(option => { 
      if (!option.protected) { option.value = false } 
    }) 
  })
  rejectAllCookies()
  tempCookies.value = null
}
const loader = (delay: number) => {
    const loader = document.querySelector('.page-loader')
    setTimeout(() => {
        if (loader) loader.classList.remove('active')
    }, delay)
}
onMounted(() => {
    loader(300)
})

</script>
<template>
    <div class="app">
        <div v-if="is('localstorage')" style="padding: 20px; background: #f0f9ff; border: 2px solid #3bbbc9; border-radius: 8px; margin: 20px;">
            <h3 style="color: #3bbbc9; margin-bottom: 10px;">✅ Local Storage Cookie is Active</h3>
            <p style="color: #666; margin-bottom: 15px;">
                This content is only visible because you have enabled the <strong>localstorage</strong> cookie.
            </p>
            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3bbbc9;">
                <h4 style="color: #3d3d3d; margin-bottom: 8px;">How to use the <code>is()</code> function:</h4>
                <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
                    <li><code>is('localstorage')</code> - Check if a specific cookie option is enabled</li>
                    <li><code>is('marketing')</code> - Check if entire cookie category is enabled</li>
                    <li><code>is('themes')</code> - Check any cookie by its identifier</li>
                </ul>
                <p style="margin-top: 10px; color: #666; font-size: 0.9rem;">
                    Use it in <code>v-if</code>, <code>v-show</code>, or computed properties to conditionally render content based on user's cookie preferences.
                </p>
            </div>
        </div>
        <button
            @click="toggleCookiesMenu = !toggleCookiesMenu"
            class="toggle-cookies-btn"
            aria-label="Toggle Cookie Settings"
        >
            🍪 Cookies
        </button>
        <NuxtPage />
        <ClientOnly>
            <Transition name="goup" mode="out-in">
        <div class="cookies" v-if="!isCookieDecided || toggleCookiesMenu" :class="{ active: isCustomizing }">
          <Transition name="fadeinup" mode="out-in">
            <div class="cookie-customizing" v-if="isCustomizing">
              <div class="cookie-wrapper-scroll">
                <div class="cookie-wrapper">
                  <div v-for="cookie in (tempCookies || [])" :key="cookie.id" class="cookie-category">
                    <div class="category-header">
                      <div class="category-info">
                        <h3>{{ cookie.name }}</h3>
                        <p>{{ cookie.description }}</p>
                      </div>
                      <div class="category-toggle" v-if="!cookie.protected">
                        <input class="inp-cbx" :id="`cbx-category-${cookie.id}`" type="checkbox"
                          style="display: none;" :checked="isCategoryFullyChecked(cookie)"
                          @change="toggleCategoryOptions(cookie)" />
                        <label class="cbx" :for="`cbx-category-${cookie.id}`">
                          <span> <svg width="12px" height="9px" viewbox="0 0 12 9">
                              <polyline points="1 5 4 8 11 1"></polyline>
                            </svg> </span>
                        </label>
                      </div>
                    </div>
                    <div class="cookie-options">
                      <div v-for="option in cookie.options" :key="option.id" class="cookie-option"
                        :class="{ protected: option.protected, disabled: isOptionDisabled(cookie, option) }">
                        <input class="inp-cbx" :id="`cbx-${cookie.id}-${option.id}`" type="checkbox"
                          style="display: none;" v-model="option.value" :disabled="isOptionDisabled(cookie, option)"
                          @change="handleCheckboxChange(cookie, option)" />
                        <label class="cbx" :for="`cbx-${cookie.id}-${option.id}`">
                          <span> <svg width="12px" height="9px" viewbox="0 0 12 9">
                              <polyline points="1 5 4 8 11 1"></polyline>
                            </svg> </span>
                          <span>{{ option.name }}</span>
                          <p v-if="option.protected">Required</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="splashes">
                <div class="splash"></div>
                <div class="splash"></div>
                <div class="splash"></div>
              </div>
            </div>
          </Transition>
          <div class="cookie-banner">
            <h2>🍪 We use cookies</h2>
            <p>This website uses cookies to enhance the user experience. By clicking "Accept All", you agree to
              the
              use
              of all cookies. You can also customize your cookie preferences by clicking "Customize".</p>
            <div class="buttons">
              <button
                @click="acceptAll(); toggleCookiesMenu = false; isCustomizing = false; hasPreferencesChanged = false">Accept
                All</button>
              <button
                @click="rejectAll(); toggleCookiesMenu = false; isCustomizing = false; hasPreferencesChanged = false">Reject
                All</button>
              <button
                @click="applyTempCookies(); savePreferences(); toggleCookiesMenu = false; isCustomizing = false; hasPreferencesChanged = false"
                v-if="isCustomizing && hasPreferencesChanged">Save Preferences</button>
              <button @click="toggleCustomize()" :class="{ active: isCustomizing }">Customize</button>
            </div>
          </div>
        </div>
      </Transition>
        </ClientOnly>
    </div>
</template>

<style>
*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.app {
	position: fixed;
	width: 100%;
	height: 100%;
	overflow: hidden auto;
	justify-content: flex-start;
	align-items: flex-start;
	scrollbar-gutter: stable;
	display: flex;
	flex-direction: column;
	padding: 10px 20px 50px 20px;
}
html {
    position: relative;
    width: 100%;
    height: 100%;
	overflow: hidden;
}

body {
    position: relative;
	z-index: 1;
    width: 100%;
    height: 100%;
    color: var(--font);
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
	overflow: hidden;
}

button {
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--font);
}

a {
    text-decoration: none;
    color: var(--font);
}

h1 {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    color: var(--font);
    font-weight: 600;
}

h2 {
    font-size: clamp(1.5rem, 4vw, 2.125rem);
    color: var(--font);
    font-weight: 600;
}

h3 {
    font-size: clamp(1.25rem, 3vw, 2rem);
    color: var(--font);
    font-weight: 500;
}

p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    color: var(--font);
    font-weight: 400;
    font-family: 'Poppins', sans-serif;
}

:root {
    --app: #fff;
    --font: #3d3d3d;
    --font-four: #666;

    --loader-bg: rgb(255, 255, 255);
    --loader-in: #3498db;

    --link-active: #3bbbc9;

    --green: linear-gradient(215deg, #34a5ce, #45ddc1);
    --red: linear-gradient(135deg, #ffc7c3, #ff9b9b, #f55549, #db3a3a);

    --pag-active: #45ddc1;

    --border: #e7e7e7;

    --hbs: rgba(0, 0, 0, 0.1);
}

.cookies {
	 position: fixed;
	 z-index: 8000;
	 bottom: 0;
	 left: 50%;
	 min-width: 100%;
	 max-width: 100%;
	 transform: translateX(-50%);
	 border-radius: 0;
	 box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
	 transition: box-shadow 0.3s ease;
}
 .cookies.active .cookie-banner {
	 border-top: 1px solid var(--border);
	 box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}
 .cookies.active {
	 box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.12);
}
 .category-info {
	 display: flex;
	 flex-direction: column;
	 gap: 5px;
}
 .cookie-banner {
	 background: var(--app);
	 backdrop-filter: blur(20px);
	 padding: 24px 32px;
	 border-top: 1px solid var(--border);
}
 .cookie-banner h2 {
	 font-size: 1.5rem;
	 font-weight: 600;
	 color: var(--font);
	 margin-bottom: 12px;
}
 .cookie-banner p {
	 font-size: 0.95rem;
	 line-height: 1.6;
	 color: var(--font-four);
	 margin-bottom: 20px;
	 max-width: 100%;
}
 .cookie-banner .buttons {
	 display: flex;
	 flex-wrap: wrap;
	 gap: 12px;
	 justify-content: flex-start;
	 align-items: center;
}
 .cookie-banner button {
	 padding: 12px 24px;
	 border: none;
	 border-radius: 8px;
	 font-size: 0.95rem;
	 font-weight: 500;
	 cursor: pointer;
	 transition: all 0.3s ease;
	 white-space: nowrap;
}
 .cookie-banner button:first-of-type {
	 background: var(--link-active);
	 color: #fff;
	 box-shadow: 0 2px 8px rgba(59, 187, 201, 0.3);
}
 .cookie-banner button:first-of-type:hover {
	 transform: translateY(-2px);
	 box-shadow: 0 4px 12px rgba(59, 187, 201, 0.4);
}
 .cookie-banner button:nth-of-type(2) {
	 background: transparent;
	 color: var(--font-four);
	 border: 1px solid var(--border);
}
 .cookie-banner button:nth-of-type(2):hover {
	 background: var(--hbs);
	 border-color: var(--font-four);
}
 .cookie-banner button:nth-of-type(3) {
	 background: var(--green);
	 color: #fff;
	 box-shadow: 0 2px 8px rgba(52, 175, 206, 0.3);
}
 .cookie-banner button:nth-of-type(3):hover {
	 transform: translateY(-2px);
	 box-shadow: 0 4px 12px rgba(52, 175, 206, 0.4);
}
 .cookie-banner button:last-of-type {
	 background: transparent;
	 color: var(--link-active);
	 border: 1px solid var(--link-active);
}
 .cookie-banner button:last-of-type:hover {
	 background: var(--link-active);
	 color: #fff;
}
 .cookie-banner button:last-of-type.active {
	 background: #e74c3c;
	 color: #fff;
	 border: 1px solid #e74c3c;
	 box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}
 .cookie-banner button:last-of-type.active:hover {
	 background: #c0392b;
	 border: 1px solid #c0392b;
	 box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}
 .cookie-banner button:active {
	 transform: scale(0.98);
}
 .cookie-customizing {
	 position: absolute;
	 z-index: -2;
	 width: 100%;
	 background: var(--app);
	 backdrop-filter: blur(20px);
	 height: 100%;
	 padding: 5px;
	 min-height: 60vh;
	 overflow: hidden;
	 box-shadow: 0 0 0 2000px rgba(0, 0, 0, 0.4);
	 transform: translateY(-100%);
	 border-top: 1px solid var(--border);
}
 .cookie-wrapper-scroll {
	 position: relative;
	 width: 100%;
	 height: 100%;
	 max-height: 60vh;
	 overflow-y: auto;
	 overflow-x: hidden;
}
 .cookie-wrapper-scroll::-webkit-scrollbar {
	 width: 8px;
}
 .cookie-wrapper-scroll::-webkit-scrollbar-track {
	 background: var(--hbs);
	 border-radius: 4px;
}
 .cookie-wrapper-scroll::-webkit-scrollbar-thumb {
	 background: var(--link-active);
	 border-radius: 4px;
}
 .cookie-wrapper-scroll::-webkit-scrollbar-thumb:hover {
	 background: var(--pag-active);
}
 .cookie-wrapper {
	 position: relative;
	 display: grid;
	 grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	 gap: 24px;
	 padding: 32px;
	 width: 70%;
	 margin: 0 auto;
}
 @media (max-width: 1400px) {
	 .cookie-wrapper {
		 width: 80%;
	}
}
 @media (max-width: 1200px) {
	 .cookie-wrapper {
		 width: 85%;
	}
}
 @media (max-width: 992px) {
	 .cookie-wrapper {
		 width: 90%;
	}
}
 @media (max-width: 768px) {
	 .cookie-wrapper {
		 width: 95%;
		 grid-template-columns: 1fr;
		 padding: 20px 16px;
		 gap: 16px;
	}
}
 @media (max-width: 576px) {
	 .cookie-wrapper {
		 width: 98%;
		 padding: 16px 12px;
	}
}
 .cookie-category {
	 position: relative;
	 display: flex;
	 flex-direction: column;
	 background: var(--loader-bg);
	 border: 1px solid var(--border);
	 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
	 border-radius: 12px;
	 padding: 20px;
	 transition: all 0.3s ease;
}
 .cookie-category:hover {
	 box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	 transform: translateY(-2px);
}
 .cookie-category .category-header {
	 display: flex;
	 justify-content: space-between;
	 align-items: flex-start;
	 gap: 12px;
	 padding: 10px 9px;
	 border-radius: 8px;
}
 .cookie-category .category-toggle .cbx {
	 padding: 4px;
}
 .cookie-category h3 {
	 font-size: 1.2rem;
	 font-weight: 600;
	 color: var(--font);
	 margin-bottom: 0;
}
 @media (max-width: 576px) {
	 .cookie-category h3 {
		 font-size: 1.1rem;
	}
}
 .cookie-category > p {
	 font-size: 0.9rem;
	 line-height: 1.5;
	 color: var(--font-four);
	 margin-bottom: 16px;
}
 .cookie-options {
	 position: relative;
	 display: flex;
	 flex-direction: column;
	 gap: 12px;
	 margin-top: 5px;
	 max-height: 300px;
	 overflow-y: auto;
	 padding-right: 8px;
}
 .cookie-options::-webkit-scrollbar {
	 width: 6px;
}
 .cookie-options::-webkit-scrollbar-track {
	 background: var(--hbs);
	 border-radius: 3px;
}
 .cookie-options::-webkit-scrollbar-thumb {
	 background: var(--link-active);
	 border-radius: 3px;
}
 .cookie-options::-webkit-scrollbar-thumb:hover {
	 background: var(--pag-active);
}
 .cookie-option {
	 position: relative;
	 display: flex;
	 align-items: center;
	 padding: 8px;
	 border-radius: 8px;
	 transition: background 0.2s ease;
}
 .cookie-option:hover {
	 background: var(--hbs);
}
 .fadeinup-enter-active, .fadeinup-leave-active {
	 transition: opacity 0.5s ease, transform 0.5s ease;
}
 .fadeinup-enter-from {
	 opacity: 0;
	 transform: translateY(100%);
}
 .fadeinup-enter-to {
	 opacity: 1;
	 transform: translateY(-100%);
}
 .fadeinup-leave-from {
	 opacity: 1;
	 transform: translateY(-100%);
}
 .fadeinup-leave-to {
	 opacity: 0;
	 transform: translateY(100%);
}
 .goup-enter-active, .goup-leave-active {
	 transition: opacity 0.3s ease, bottom 0.3s ease;
}
 .goup-enter-from {
	 opacity: 0;
	 bottom: -100%;
}
 .goup-enter-to {
	 opacity: 1;
	 bottom: 0;
}
 .goup-leave-from {
	 opacity: 1;
	 bottom: 0;
}
 .goup-leave-to {
	 opacity: 0;
	 bottom: -100%;
}
 .splashes {
	 position: fixed;
	 bottom: 0;
	 left: 0;
	 width: 100%;
	 height: 100%;
	 overflow: hidden;
	 pointer-events: none;
	 filter: blur(80px);
	 opacity: 0.6;
	 z-index: -1;
}
 .splashes .splash:first-child {
	 position: absolute;
	 left: -300px;
	 top: -300px;
	 width: 600px;
	 height: 600px;
	 border-radius: 50%;
	 background: var(--loader-in);
	 opacity: 0.3;
	 animation: float 8s ease-in-out infinite;
}
 .splashes .splash:nth-child(2) {
	 position: absolute;
	 right: -300px;
	 bottom: -300px;
	 width: 600px;
	 height: 600px;
	 border-radius: 50%;
	 background: var(--pag-active);
	 opacity: 0.3;
	 animation: float 10s ease-in-out infinite reverse;
}
 .splashes .splash:last-child {
	 position: absolute;
	 right: 50%;
	 transform: translate(50%, 50%);
	 bottom: 0px;
	 width: 600px;
	 height: 600px;
	 border-radius: 50%;
	 background: var(--link-active);
	 opacity: 0.2;
	 animation: float 12s ease-in-out infinite;
}
 @keyframes float {
	 0%, 100% {
		 transform: translate(0, 0);
	}
	 50% {
		 transform: translate(30px, 30px);
	}
}
 .cbx {
	 position: relative;
	 display: flex;
	 justify-content: flex-start;
	 align-items: center;
	 gap: 12px;
	 -webkit-user-select: none;
	 user-select: none;
	 -webkit-tap-highlight-color: transparent;
	 cursor: pointer;
	 padding: 4px;
}
 .cookie-option.protected .cbx {
	 cursor: not-allowed;
	 opacity: 0.6;
}
 .cookie-option.protected .cbx:hover span:first-child {
	 border-color: var(--pag-active);
}
 .cookie-option.protected .inp-cbx:checked + .cbx span:first-child {
	 border-color: var(--pag-active);
	 background: var(--pag-active);
}
 .cookie-option.protected .inp-cbx:checked + .cbx span:nth-child(2) {
	 color: var(--pag-active);
}
 .cookie-option.disabled .cbx {
	 cursor: not-allowed;
	 opacity: 0.5;
}
 .cookie-option.disabled .cbx:hover span:first-child {
	 border-color: var(--border);
}
 .cbx p {
	 font-size: 0.75rem;
	 line-height: 1;
	 font-weight: 500;
	 background: var(--red);
	 color: white;
	 padding: 4px 8px;
	 border-radius: 6px;
	 text-transform: uppercase;
	 letter-spacing: 0.5px;
}
 .cbx span {
	 display: inline-block;
	 line-height: 1.4;
	 vertical-align: middle;
	 transform: translate3d(0, 0, 0);
}
 .cbx span:first-child {
	 position: relative;
	 width: 22px;
	 height: 22px;
	 border-radius: 6px;
	 flex-shrink: 0;
	 transform: scale(1);
	 vertical-align: middle;
	 border: 2px solid var(--border);
	 background: var(--app);
	 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
 .cbx span:first-child svg {
	 position: absolute;
	 z-index: 1;
	 top: 4px;
	 left: 4px;
	 fill: none;
	 stroke: white;
	 stroke-width: 3;
	 stroke-linecap: round;
	 stroke-linejoin: round;
	 stroke-dasharray: 16px;
	 stroke-dashoffset: 16px;
	 transition: all 0.3s ease;
	 transition-delay: 0.1s;
	 transform: translate3d(0, 0, 0);
}
 .cbx span:first-child:before {
	 content: "";
	 position: absolute;
	 width: 100%;
	 height: 100%;
	 background: var(--link-active);
	 display: block;
	 transform: scale(0);
	 opacity: 1;
	 border-radius: 4px;
	 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
 .cbx span:nth-child(2) {
	 font-size: 0.95rem;
	 color: var(--font);
	 font-weight: 500;
}
 .cbx:hover span:first-child {
	 border-color: var(--link-active);
	 box-shadow: 0 0 0 4px rgba(59, 187, 201, 0.1);
}
 .inp-cbx:checked + .cbx span:first-child {
	 border-color: var(--link-active);
	 background: var(--link-active);
	 animation: check 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
 .inp-cbx:checked + .cbx span:first-child svg {
	 stroke-dashoffset: 0;
}
 .inp-cbx:checked + .cbx span:first-child:before {
	 transform: scale(1);
	 opacity: 1;
}
 .inp-cbx:checked + .cbx span:nth-child(2) {
	 color: var(--link-active);
	 transition: all 0.3s ease;
}
 @keyframes check {
	 0% {
		 transform: scale(1);
	}
	 50% {
		 transform: scale(0.95);
	}
	 100% {
		 transform: scale(1);
	}
}
 @media (max-width: 768px) {
	 .cookie-banner {
		 padding: 20px 16px;
	}
	 .cookie-banner h2 {
		 font-size: 1.3rem;
	}
	 .cookie-banner p {
		 font-size: 0.9rem;
	}
	 .cookie-banner button {
		 padding: 10px 20px;
		 font-size: 0.9rem;
	}
	 .cookie-customizing {
		 max-height: 50vh;
	}
}
 .toggle-cookies-btn {
    margin-left: 10px;
	margin-top: 10px;
    padding: 5px 14px 5px 10px;
    background: transparent;
    color: var(--link-active);
    border: 1px solid var(--link-active);
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    z-index: 7999;
}

.toggle-cookies-btn:hover {
    background: var(--link-active);
    color: #fff;
}

.toggle-cookies-btn:active {
    transform: scale(0.98);
}

@media (max-width: 768px) {
    .toggle-cookies-btn {
        bottom: 16px;
        right: 16px;
        padding: 10px 20px;
        font-size: 0.9rem;
    }
}


.page-loader.active {
    opacity: 1;
    visibility: visible;
}

.page-loader {
    opacity: 0;
    pointer-events: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(255, 255, 255);
    justify-content: center;
    align-items: center;
    z-index: 9000;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.page-loader p {
    font-size: 1.5rem;
    color: #333;
}
</style>
