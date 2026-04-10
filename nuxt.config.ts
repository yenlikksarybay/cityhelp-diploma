// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/image', '@pinia/nuxt', 'nuxt-swiper', '@nuxtjs/i18n'],
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
        {
          src: "https://yastatic.net/s3/mapsapi-jslibs/heatmap/0.0.1/heatmap.min.js",
          type: "text/javascript",
          defer: true,
        },
      ],
    },
  },

	i18n: {
		defaultLocale: 'kz',
		locales: [
      { code: 'ru', name: 'Ru', file: 'ru.json', flag: "https://cityhelp-diploma-yij7.vercel.app/assets/images/content/ru-flag.png" },
      { code: 'kz', name: 'Kz', file: 'kz.json', flag: "https://cityhelp-diploma-yij7.vercel.app/assets/images/content/kz-flag.png" },
      { code: 'en', name: 'En', file: 'en.json', flag: "https://cityhelp-diploma-yij7.vercel.app/assets/images/content/en-flag.png" },
    ],
		vueI18n: "./i18n.config.ts",
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
		mongodbUri: "",
		mongodbUser: "",
		mongodbPassword: "",
		mongodbHost: "127.0.0.1:27017",
		mongodbDatabase: "cityhelp",
		serverPort: "",
		geminiApiKey: "",
		geminiModel: "gemini-1.5-flash",
		public: {
			baseURL: "/api",
		},
	},

  devtools: { enabled: true },
})
