// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/image', '@pinia/nuxt'],
	css: ['@/assets/scss/index.scss'],

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `
						@use "@/assets/scss/abstracts/variables" as *;
						@use "@/assets/scss/abstracts/colors" as *;
						@use "@/assets/scss/base/colors" as *;
					`
				}
			}
		}
  },


	runtimeConfig: {
    public: {
        baseURL: 'https://api.darynbagdar.kz/api'
    }
	},


  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
})