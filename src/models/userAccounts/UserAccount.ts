export interface UserAccount {
	accountId: string,
	authKeys: string[],
	avatarUrl: string,
	discordAvatar: string,
	discordId: string,
	steamAvatarHash: string,
	steamId: string,
	username: string,
	lastRead: Date,
	permissionLvl: number
}
