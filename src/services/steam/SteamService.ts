import fetch from 'node-fetch'

export function getSteamApiUrl(steamId: string) {
	const steamAPIKey = "KEY";
	return `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${ steamAPIKey }` +
		`&steamids=${ steamId }&format=json`
}

export async function getSteamAccount(steamId: string): Promise<SteamApiResponse> {
	const apiUrl = getSteamApiUrl(steamId);
	return await fetch(apiUrl).then(async steamResponse => {
		const data = steamResponse.json();
		return await data.then(resp => {
			if (!resp) {
				return null;
			}
			const user = resp.response.players[0];
			return {
				steamid: user?.steamid,
				personaname: user?.personaname,
				avatarhash: user?.avatarhash,
			};
		})
	});
}

export interface SteamApiResponse {
	steamid: string,
	personaname: string,
	avatarhash: string
}
