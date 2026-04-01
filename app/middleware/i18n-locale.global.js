export default defineNuxtRouteMiddleware((to, from) => {
	const { $i18n } = useNuxtApp();
	const localePath = useLocalePath();

	if (!$i18n || !$i18n.locale) { return };

	const currentLocale = $i18n.locale.value;
	const defaultLocale = $i18n.defaultLocale || "kz";
	const supportedLocales = $i18n.availableLocales || [defaultLocale];

	const hasLocalePrefix = supportedLocales.some((loc) =>
		to.path.startsWith(`/${loc}`)
	);

	if (hasLocalePrefix && to.path.startsWith(`/${currentLocale}`)) {
		return;
	}

	if (hasLocalePrefix) { return };
	if (currentLocale === defaultLocale && !hasLocalePrefix) { return };

	return navigateTo(localePath(to.fullPath), { replace: true });
});
