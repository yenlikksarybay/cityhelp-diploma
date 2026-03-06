export function useSeo({ title, description }) {
	let darynBagdarLogo = "https://cityhelp-diploma-yij7.vercel.app/assets/images/logo/logo-full.png";

	useSeoMeta({
		title: `CityHelp - ${title}`,
		ogTitle: `CityHelp - ${title}`,
		description: description,
		ogDescription: description,
		image: darynBagdarLogo,
		ogImage: darynBagdarLogo,
	});
}