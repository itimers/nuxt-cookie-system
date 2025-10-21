<script lang="ts" setup>
const allCookies = ref([
    { id: 1, protected: false, name: 'marketing', value: false, class: 'm', description: 'Marketing cookies are used to track user behavior on the website and to improve the user experience.', options: [ { id: 1, protected: false, name: 'ip', value: false }, { id: 2, protected: false, name: 'country', value: false }, { id: 3, protected: false, name: 'timezone', value: false }, { id: 4, protected: false, name: 'time', value: false }, { id: 5, protected: false, name: 'spenttime', value: false }, { id: 6, protected: false, name: 'chatbot', value: false } ] },
    { id: 2, protected: false, name: 'socials', value: false, class: 's', description: 'Social media cookies are used to track user behavior on the website and to improve the user experience.', options: [ { id: 1, protected: true, name: 'google', value: true }, { id: 2, protected: false, name: 'facebook', value: false }, { id: 3, protected: false, name: 'youtube', value: false }, { id: 4, protected: false, name: 'instagram', value: false }, { id: 5, protected: false, name: 'tiktok', value: false }, { id: 6, protected: false, name: 'linkedin', value: false } ] },
    { id: 3, protected: false, name: 'performance', value: false, class: 'p', description: 'Performance cookies are used to track user behavior on the website and to improve the user experience.', options: [ { id: 1, protected: false, name: 'themes', value: false }, { id: 2, protected: false, name: 'prefers', value: false }, { id: 3, protected: false, name: 'langs', value: false }, { id: 4, protected: false, name: 'localstorage', value: false }, { id: 5, protected: false, name: 'scroll-listeners', value: false }, { id: 6, protected: false, name: 'section-pagination', value: false }, { id: 7, protected: false, name: 'slider', value: false }, { id: 8, protected: false, name: 'modals', value: false }, { id: 9, protected: false, name: 'menus', value: false }, { id: 10, protected: false, name: 'animations', value: false }, { id: 11, protected: false, name: 'transitions', value: false }, { id: 12, protected: false, name: 'blur', value: false, }, { id: 13, protected: false, name: 'auth-user', value: false } ] }
])
const cookieAcceptedCookie = useCookie('cookie-accepted', { maxAge: 60 * 60 * 24 * 365, path: '/', sameSite: 'lax', default: () => false })
const savedPreferences = useCookie('cookie-preferences', { maxAge: 60 * 60 * 24 * 365, path: '/', sameSite: 'lax' })
const isCookieAccepted = computed({ get: () => cookieAcceptedCookie.value === true, set: (value: boolean) => cookieAcceptedCookie.value = value })
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
    isCookieAccepted.value = true
    savedPreferences.value = allCookies.value as any
    toggleCookiesMenu.value = false
    isCustomizing.value = false
}
</script>
<template>
    <div>
        <LazyCookies v-if="isCookieAccepted" v-model:toggle-cookies-menu="toggleCookiesMenu" />
        <NuxtPage />
        <div v-if="!isCookieAccepted || toggleCookiesMenu">
            <div class="cookie-banner">
                <h2>We use cookies</h2>
                <p>This website uses cookies to enhance the user experience. By clicking "Accept All", you agree to the
                    use
                    of all cookies. You can also customize your cookie preferences by clicking "Customize".</p>
                <div class="buttons"></div>
                <button @click="saveCookies()">Accept All</button>
                <button @click="saveCookies()" v-if="isCustomizing">Save Preferences</button>
                <button @click="toggleCustomize()">Customize</button>
            </div>
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
                <button @click="saveCookies()">Save Preferences</button>
            </div>
        </div>
    </div>
</template>