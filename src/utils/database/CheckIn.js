/*

const FirestoreDB = require("./FirestoreDB");

export async function checkInUpdateProfiles(options) {
	
	
	console.log('checking in');
	console.log(options);
	
	let profileTemplate = {};
	
	let profileId = options["profileId"];
	if (options["steamId"]) {
		profileTemplate.steamid = options["steamId"];
	}
	if (options["discordId"]) {
		profileTemplate.discordid = options["discordId"];
	}
	if (options?.authKey) {
		profileTemplate.authkey = options.authKey
	}
	
	FirestoreDB.savePlayer(profileTemplate, profileId)
	
	/!*    await getLatestRGL(steamId, discordId).then((rglProfile) => {
			if (!!rglProfile && !!siteAccount) {
				siteAccount.setRGLAccount(rglProfile);
			}
		});*!/
}

export function getSelfInfoFromKey(authkey) {
	console.log('actself')
	let resp = FirestoreDB.getAccount(IdType.AUTH_KEY, authkey);
	console.log(resp);
	return resp;
}
*/

