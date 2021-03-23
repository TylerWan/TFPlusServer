import {UserAccount} from "../../models/userAccounts/UserAccount";
import {getDocumentListener, getDocumentValueOnce, getFirestore, setDocumentValue} from "../firestore/FirestoreService";
import {DatabaseCollections} from "../../utils/database";
import {generateAuthKey} from "../auth/AuthService";
import {Id_Type} from "../../models/userAccounts/UserIdTypes";
import {minutesBetweenDates} from "../../utils/parsing";
import {GLOBAL_VARIABLES} from "../../utils/GlobalVariables";
import {getDiscordAccount} from "../discord/DiscordUserAPI";


export interface UserAccountIndex {
	[userId: string]: UserAccount
}

export interface UserHasListener {
	[userId: string]: boolean
}

let localUserAccounts: UserAccountIndex = {};

const hasActiveListener: UserHasListener = {};

export function setAllLocalUserAccounts(users: UserAccountIndex) {
	return localUserAccounts = users;
}

export function getAllLocalUserAccounts(): UserAccountIndex {
	return localUserAccounts;
}

export function setLocalUserAccount(user: UserAccount) {
	return localUserAccounts[user.accountId] = user;
}

export function getLocalUserAccount(idType: Id_Type, id: string): UserAccount {

	switch (idType) {
		case Id_Type.ACCOUNT_ID: {
			if (!!localUserAccounts[id]) {
				return localUserAccounts[id];
			}
		} break;

		case Id_Type.AUTH_KEY: {
			for (const userId in localUserAccounts) {
				if (localUserAccounts.hasOwnProperty(userId)) {
					const userInfo = localUserAccounts[userId];
					if (userInfo.authKeys?.includes(id)) {
						return userInfo;
					}
				}
			}
		} break;

		case Id_Type.DISCORD_ID: {
			for (const userId in localUserAccounts) {
				if (localUserAccounts.hasOwnProperty(userId)) {
					const userInfo = localUserAccounts[userId];
					if (userInfo.discordId === id) {
						return userInfo;
					}
				}
			}
		} break

		case Id_Type.STEAM_ID: {
			for (const userId in localUserAccounts) {
				if (localUserAccounts.hasOwnProperty(userId)) {
					const userInfo = localUserAccounts[userId];
					if (userInfo.steamId === id) {
						return userInfo;
					}
				}
			}
		}
	}
	return null;
}

export async function getUserAccountById(idType: Id_Type, id: string) {

	let userAccount = getLocalUserAccount(idType, id);
	if (!userAccount || !hasActiveListener[userAccount.accountId] || isUserStale(userAccount)) {
		const userId = userAccount?.accountId || (idType === Id_Type.ACCOUNT_ID ? id : "");
		if (userId) {
			await getDocumentListener(
				getFirestoreUsersRef(),
				userId,
				userAccountListener
			);
		}
		userAccount = getLocalUserAccount(idType, id);
	}
	if (!!localUserAccounts[userAccount?.accountId]) {
		localUserAccounts[userAccount?.accountId].lastRead = new Date();
	}
	return userAccount;

}

function getFirestoreUsersRef() {
	return getFirestore().collection(DatabaseCollections.UserAccounts);
}

async function getUserAccountFirestore(idType: Id_Type, id: string) {
	switch (idType) {
		case Id_Type.ACCOUNT_ID: {
			return await getDocumentValueOnce(getFirestoreUsersRef(), id).then((user) => {
				return user;
			})
		}

		case Id_Type.STEAM_ID: {
			return await getFirestoreUsersRef().where('steamId', '==', id).get().then(user => {
				return user;
			})
		}

		case Id_Type.DISCORD_ID: {
			return await getFirestoreUsersRef().where('discordId', '==', id).get().then(user => {
				return user;
			})
		}

		case Id_Type.AUTH_KEY: {
			return await getFirestoreUsersRef().where('authKeys', 'array-contains', id).get().then(user => {
				return user;
			})
		}
	}
	return null;

}

export async function setUserAccountFirestore(user: UserAccount) {
	if (!user.accountId) {
		user.accountId = generateAuthKey();
	}
	setLocalUserAccount(user);
	await setDocumentValue(getFirestoreUsersRef(), user, user.accountId, true).then(r => {});
	return user;
}

export async function linkUserDiscord(accountId: string, discordId: string) {
	const existingAccount = await getUserAccountById(Id_Type.ACCOUNT_ID, accountId);
	const discordUser = await getDiscordAccount(discordId);
	existingAccount.discordId = discordUser.id;
	existingAccount.discordAvatar = discordUser.avatar;
	return await setUserAccountFirestore(existingAccount);
}


function userAccountListener(listener: any, userInfo: UserAccount, err?: Error) {

	if (userInfo) {
		setLocalUserAccount(userInfo);
	}

	if (!userInfo || isUserStale(userInfo) || err) {
		if (hasActiveListener[userInfo?.accountId]) {
			hasActiveListener[userInfo?.accountId] = false;
		}
		listener();
	} else {
		hasActiveListener[userInfo.accountId] = true;
	}

}

function isUserStale(user: UserAccount) {
	const lastReadDate = new Date(user.lastRead);
	return minutesBetweenDates(Date.now(), lastReadDate) > GLOBAL_VARIABLES.MIN_BETWEEN_USER_READS;
}
