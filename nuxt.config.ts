// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/image', '@pinia/nuxt', 'nuxt-swiper'],
	plugins: ["~/plugins/maska.js", "~/plugins/sms-code.client.js"],

	css: ['@/assets/scss/index.scss'],

	app: {
    head: {
      script: [
        {
          src: "https://api-maps.yandex.ru/2.1/?apikey=5c1eac19-7d8a-427d-b5c2-0927b6599e4e&lang=ru_RU",
          type: "text/javascript",
          defer: true,
        },
      ],
    },
  },

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