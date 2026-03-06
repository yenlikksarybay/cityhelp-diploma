import venCodeInput from "@venegrad/vue3-code-input"
import '@venegrad/vue3-code-input/dist/venCodeInput.css'

export default defineNuxtPlugin((nuxt) => {
	nuxt.vueApp.use(venCodeInput);
});