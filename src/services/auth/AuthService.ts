import {customAlphabet} from 'nanoid'
import {getUserAccountById, linkUserDiscord, setUserAccountFirestore} from "../userAccounts/UserAccountService";
import {Id_Type} from "../../models/userAccounts/UserIdTypes";
import {getSteamAccount} from "../steam/SteamService";
import {UserAccount} from "../../models/userAccounts/UserAccount";
import {assignDefined, AvatarType, getExternalAvatarUrl} from "../../utils/parsing";
import {getDiscordAccount} from "../discord/DiscordUserAPI";
import {getDiscordIdBySteamId, getSteamIdByDiscordId} from "../firestore/OldDatabaseService";
import getRglProfileInfo from "../pug/RGLFetch";

export function generateAuthKey(): string {
	let authKeyAlphabet = "abcdefghijklmnopqrstuvwxyz";
	authKeyAlphabet += authKeyAlphabet.toUpperCase() + "0123456789";
	const nanoid = customAlphabet(authKeyAlphabet, 10)
	return nanoid()
}

export async function getAccountByAuthKey(authKey: string) {
	return await getUserAccountById(Id_Type.AUTH_KEY, authKey);
}

export async function addAuthKey(authKey: string, idType: Id_Type, id: string) {
	const existingUser = await getUserAccountById(idType, id);
	if (!existingUser.authKeys) {
		existingUser.authKeys = [];
	}
	existingUser.authKeys.push(authKey);
	setUserAccountFirestore(existingUser).then(r=>{});
}

export async function checkInUser(authKey: string, idType: Id_Type, id: string) {
	return await updateAccountProfile(idType, id).then(user => {
		addAuthKey(authKey, Id_Type.ACCOUNT_ID, user.accountId);
	});
}

export async function linkDiscord(authKey: string, discordId: string) {
	const existingUser = await getUserAccountById(Id_Type.AUTH_KEY, authKey);
	return await linkUserDiscord(existingUser.accountId, discordId)
}

export async function updateAccountProfile(externalAccountIdType: Id_Type, external_id: string) {
	if (!external_id) return;
	let existingUser: UserAccount = await getUserAccountById(externalAccountIdType, external_id);
	if (!existingUser) {
		existingUser = {
			accountId: "",
			authKeys: new Array<string>(),
			avatarUrl: "",
			discordAvatar: "",
			discordId: "",
			lastRead: new Date(),
			steamAvatarHash: "",
			steamId: "",
			username: "",
			permissionLvl: 0
		};
	}

	let steamId = existingUser.steamId || (externalAccountIdType === Id_Type.STEAM_ID ? external_id : "");
	let discordId = existingUser.discordId || (externalAccountIdType === Id_Type.DISCORD_ID ? external_id : "");
	if (!steamId && !!discordId) {
		steamId = await getSteamIdByDiscordId(discordId);
		if (!!steamId) {
			const rglFetch = await getRglProfileInfo(steamId, '');
			if (rglFetch) {
				steamId = rglFetch._steamId;
				if (!existingUser.username && rglFetch.playerName) {
					existingUser.username = rglFetch.playerName;
				}
			}
		}
	}

	if (!!steamId && !discordId) {
		discordId = await getDiscordIdBySteamId(steamId);
	}

	if (!!steamId) {
		const latestSteam = await getSteamAccount(steamId);
		if (!!latestSteam) {
			existingUser.steamAvatarHash = latestSteam.avatarhash;
			existingUser.steamId = latestSteam.steamid;
			if (!existingUser.username && !!latestSteam.personaname) {
				existingUser.username = latestSteam.personaname
			}
			if (!existingUser.avatarUrl) {
				existingUser.avatarUrl = getExternalAvatarUrl(AvatarType.STEAM, latestSteam.avatarhash, latestSteam.steamid)
			}
		}
	}

	if (!!discordId) {
		const latestDiscord = await getDiscordAccount(external_id);
		if (!!latestDiscord) {
			existingUser.discordId = latestDiscord.id;
			existingUser.discordAvatar = latestDiscord.avatar;
			if (!existingUser.username && latestDiscord.username) {
				existingUser.username = latestDiscord.username;
			}
			if (!existingUser.avatarUrl) {
				existingUser.avatarUrl = getExternalAvatarUrl(AvatarType.DISCORD, latestDiscord.avatar, latestDiscord.id);
			}
		}
	}
	if (!!steamId) {
		const existingUserSteam: UserAccount = await getUserAccountById(Id_Type.STEAM_ID, steamId);
		assignDefined(existingUser, {...existingUserSteam})
	}
	if (!!discordId) {
		const existingUserDiscord: UserAccount = await getUserAccountById(Id_Type.DISCORD_ID, discordId);
		assignDefined(existingUser, {...existingUserDiscord})
	}

	if (!!existingUser && (existingUser.discordId || existingUser.steamId)) {
		return await setUserAccountFirestore(existingUser);
	}

	return existingUser;
}

