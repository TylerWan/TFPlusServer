import * as Discord from 'discord.js';

export interface DiscordPugVoiceChannel {
	channelId: string,
	channelName: string,
	channelType: "Waiting" | "Building" | "Team" | undefined,
	isClaimed: boolean,
	users: {[discordId: string]: Discord.User}
}
