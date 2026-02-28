export function useSeo({ title, description }) {
	let darynBagdarLogo = "";

	useSeoMeta({
		title: `CityHelp - ${title}`,
		ogTitle: `CityHelp - ${title}`,
		description: description,
		ogDescription: description,
		image: darynBagdarLogo,
		ogImage: darynBagdarLogo,
	});
}
