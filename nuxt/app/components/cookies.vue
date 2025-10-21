<script lang="ts" setup>
const { is } = useCookies();
const props = defineProps<{
    toggleCookiesMenu: boolean
}>();
const emit = defineEmits<{
    (e: 'update:toggleCookiesMenu', value: boolean): void
}>();
const toggleMenu = () => {
    emit('update:toggleCookiesMenu', !props.toggleCookiesMenu);
};
</script>
<template>
    <div>
        <h3>Prihvaceni kolacici</h3>
        <button @click="toggleMenu">Toggle Cookies Menu</button>
        <div style="margin-top: 20px;">
            <h4>Cookie Status:</h4>
            <p v-if="is('marketing')">✅ Marketing cookies are enabled</p>
            <p v-else>❌ Marketing cookies are disabled</p>
            <p v-if="is('socials')">✅ Social cookies are enabled</p>
            <p v-else>❌ Social cookies are disabled</p>
            <p v-if="is('performance')">✅ Performance cookies are enabled</p>
            <p v-else>❌ Performance cookies are disabled</p>
            <hr>
            <p v-if="is('ip')">✅ IP tracking is enabled</p>
            <p v-if="is('google')">✅ Google is enabled</p>
            <p v-if="is('themes')">✅ Themes are enabled</p>
        </div>
    </div>
</template>