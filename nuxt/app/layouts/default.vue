<script lang="ts" setup>
const allCookies = ref([
    { id: 1, protected: false, name: 'marketing', value: false, class: 'm', description: 'Marketing cookies are used to track user behavior on the website and to improve the user experience.', options: [{ id: 1, protected: false, name: 'ip', value: false }, { id: 2, protected: false, name: 'country', value: false }, { id: 3, protected: false, name: 'timezone', value: false }, { id: 4, protected: false, name: 'time', value: false }, { id: 5, protected: false, name: 'spenttime', value: false }, { id: 6, protected: false, name: 'chatbot', value: false }] },
    { id: 2, protected: false, name: 'socials', value: false, class: 's', description: 'Social media cookies are used to track user behavior on the website and to improve the user experience.', options: [{ id: 1, protected: true, name: 'google', value: true }, { id: 2, protected: false, name: 'facebook', value: false }, { id: 3, protected: false, name: 'youtube', value: false }, { id: 4, protected: false, name: 'instagram', value: false }, { id: 5, protected: false, name: 'tiktok', value: false }, { id: 6, protected: false, name: 'linkedin', value: false }] },
    { id: 3, protected: false, name: 'performance', value: false, class: 'p', description: 'Performance cookies are used to track user behavior on the website and to improve the user experience.', options: [{ id: 1, protected: false, name: 'themes', value: false }, { id: 2, protected: false, name: 'prefers', value: false }, { id: 3, protected: false, name: 'langs', value: false }, { id: 4, protected: false, name: 'localstorage', value: false }, { id: 5, protected: false, name: 'scroll-listeners', value: false }, { id: 6, protected: false, name: 'section-pagination', value: false }, { id: 7, protected: false, name: 'slider', value: false }, { id: 8, protected: false, name: 'modals', value: false }, { id: 9, protected: false, name: 'menus', value: false }, { id: 10, protected: false, name: 'animations', value: false }, { id: 11, protected: false, name: 'transitions', value: false }, { id: 12, protected: false, name: 'blur', value: false, }, { id: 13, protected: false, name: 'auth-user', value: false }] }
])

const cookieStatusCookie = useCookie<'waiting' | 'accepted' | 'rejected'>('cookie-accepted', { 
    maxAge: 60 * 60 * 24 * 365, 
    path: '/', 
    sameSite: 'lax', 
    default: () => 'waiting'
})

const savedPreferences = useCookie('cookie-preferences', { 
    maxAge: 60 * 60 * 24 * 365, 
    path: '/', 
    sameSite: 'lax'
})

const isCookieDecided = computed(() => cookieStatusCookie.value !== 'waiting')

const isCustomizing = ref(false);
const toggleCookiesMenu = ref(false);

const loadSavedPreferences = () => {
    if (!savedPreferences.value) return
    try {
        let parsed: any
        if (typeof savedPreferences.value === 'string') parsed = JSON.parse(savedPreferences.value)
        else parsed = savedPreferences.value
        if (parsed && Array.isArray(parsed)) allCookies.value = parsed
    } catch (e) { console.error('❌ Failed to load preferences:', e) }
}

const toggleCustomize = () => {
    isCustomizing.value = !isCustomizing.value
    if (isCustomizing.value) loadSavedPreferences()
}

const saveCookies = () => {
    cookieStatusCookie.value = 'accepted'
    savedPreferences.value = allCookies.value as any
    toggleCookiesMenu.value = false
    isCustomizing.value = false
    console.log('✅ Cookies accepted')
}

const rejectCookies = () => {
    allCookies.value.forEach(category => {
        if (!category.protected) {
            category.value = false
        }
        category.options?.forEach(option => {
            if (!option.protected) {
                option.value = false
            }
        })
    })
    cookieStatusCookie.value = 'rejected'
    savedPreferences.value = allCookies.value as any
    toggleCookiesMenu.value = false
    isCustomizing.value = false
    console.log('❌ All cookies rejected (except protected ones)')
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
    <div class="page-loader active">
        <p>Loading...</p>
    </div>
    <div>
        <ClientOnly>
            <LazyCookies v-if="isCookieDecided" v-model:toggle-cookies-menu="toggleCookiesMenu" />
        </ClientOnly>
        <NuxtPage />

        <ClientOnly>
            <Transition name="goup" mode="out-in">
                <div class="cookies" v-if="!isCookieDecided || toggleCookiesMenu"
                    :class="{ active: isCustomizing }">
                    <Transition name="fadeinup" mode="out-in">
                        <div class="cookie-options" v-if="isCustomizing">
                            <div v-for="cookie in allCookies" :key="cookie.id" class="cookie-category">
                                <h3>{{ cookie.name }}</h3>
                                <p>{{ cookie.description }}</p>
                                <div v-for="option in cookie.options" :key="option.id" class="cookie-option">
                                    <label>
                                        <input type="checkbox" v-model="option.value" :disabled="option.protected" />
                                        {{ option.name }} <span v-if="option.protected">(Required)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Transition>
                    <div class="cookie-banner">
                        <h2>We use cookies</h2>
                        <p>This website uses cookies to enhance the user experience. By clicking "Accept All", you agree to
                            the
                            use
                            of all cookies. You can also customize your cookie preferences by clicking "Customize".</p>
                        <div class="buttons"></div>
                        <button @click="saveCookies()">Accept All</button>
                        <button @click="rejectCookies()">Reject All</button>
                        <button @click="saveCookies()" v-if="isCustomizing">Save Preferences</button>
                        <button @click="toggleCustomize()">Customize</button>
                    </div>
                </div>
            </Transition>
        </ClientOnly>
    </div>
</template>

<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { position: relative; width: 100%; height: 100%; }
body { position: relative; width: 100%; height: 100%; color: var(--font); font-family: 'Poppins', sans-serif; font-weight: 400; }
button { outline: none; border: none; background: none; cursor: pointer; color: var(--font); }
a { text-decoration: none; color: var(--font); }
h1 { font-size: clamp(1.75rem, 5vw, 2.5rem); color: var(--font); font-weight: 600; }
/* ~28px do 40px */
h2 { font-size: clamp(1.5rem, 4vw, 2.125rem); color: var(--font); font-weight: 600; }
/* ~24px do 34px */
h3 { font-size: clamp(1.25rem, 3vw, 2rem); color: var(--font); font-weight: 500; }
/* ~20px do 32px */
p { font-size: clamp(1rem, 2vw, 1.125rem); color: var(--font); font-weight: 400; font-family: 'Poppins', sans-serif; }
/* ~16px do 18px */
.cookies { position: fixed; z-index: 8000; bottom: 0; left: 50%; min-width: 100%; transform: translateX(-50%); background: #fff; border-radius: 10px; box-shadow: 0px 0px 50px 0px rgba(99, 99, 99, 0.4); transition: box-shadow 0.2s ease; }
.cookies.active .cookie-banner { border-top: 1px solid #d8d8d8; }
.cookies.active { box-shadow: none; }
.cookie-banner { background: #f1f1f1; padding: 10px 10px 10px 10px; }
.cookie-options { position: absolute; z-index: -2; display: flex; flex-wrap: wrap; max-height: 500px; overflow: hidden auto; background: white; padding: 20px; box-shadow: 0px 0px 250px 2500px rgba(105, 105, 105, 0.8); transform: translateY(-100%); }
.cookie-category { flex: 1 1 300px; }
.fadeinup-enter-active, .fadeinup-leave-active { transition: opacity .5s ease, transform .5s ease; }
.fadeinup-enter-from { opacity: 0; transform: translateY(100%); }
.fadeinup-enter-to { opacity: 1; transform: translateY(-100%); }
.fadeinup-leave-from { opacity: 1; transform: translateY(-100%); }
.fadeinup-leave-to { opacity: 0; transform: translateY(100%); }
.goup-enter-active, .goup-leave-active { transition: opacity 0.2s ease, bottom 0.2s ease; }
.goup-enter-from { opacity: 0; bottom: -100%; }
.goup-enter-to { opacity: 1; bottom: 0; }
.goup-leave-from { opacity: 1; bottom: 0; }
.goup-leave-to { opacity: 0; bottom: -100%; }

/* Page Loader - styled here, display controlled by script */
.page-loader.active { 
    opacity: 1;
    visibility: visible;
}
/* Hide loader when page is loaded */
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
