export function minutesBetweenDates(date1: any, date2: any): number {
	if (date1 && date2) {
		return Math.abs(date1 - date2) / 1000 / 60;
	}
	return 0;
}

export function getExternalAvatarUrl(avatarType: AvatarType, hash?: string, userId?: string,): string {
	switch(avatarType) {
		case AvatarType.STEAM: {
			return `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/21/${ hash }_full.jpg`;
		}
		case AvatarType.DISCORD: {
			return `https://cdn.discordapp.com/avatars/${ userId }/${ hash }`;
		}
	}

	return "";
}
export enum AvatarType {
	DISCORD,
	STEAM
}
export function assignDefined(target: any, source: any) {
	for (const key of Object.keys(source)) {
		const val = source[key];
		if (!!val) {
			target[key] = val;
		}
	}
	return target;
}
