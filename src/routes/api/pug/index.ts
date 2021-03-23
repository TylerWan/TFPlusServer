import express, {Router} from 'express';
import {getChannelsByType} from "../../../services/discord/DiscordChannelService";

const pugRouter = Router();

pugRouter.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
	return res.json({api: "woof!"});
});

pugRouter.get('/channels/waiting', (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const waitingChannels = getChannelsByType("Waiting");

	return res.json([
		{
			username: "testuser1",
			avatarUrl: "https://picsum.photos/200",
			discordId: "23454"
		},
		{
			username: "testuser2",
			avatarUrl: "https://picsum.photos/200",
			discordId: "323454"
		}
	]);
});

export default pugRouter
