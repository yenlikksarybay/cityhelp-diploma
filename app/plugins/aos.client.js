import AOS from 'aos'
import 'aos/dist/aos.css'

export default defineNuxtPlugin(() => {
	const router = useRouter()

	AOS.init({
		duration: 800,
		once: true,
	})

	router.afterEach(() => {
		AOS.refresh()
	})
})