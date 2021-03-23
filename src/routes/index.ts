import express, { Router } from 'express';
import apiRouter from "./api";
import discordRouter from "./auth/DiscordAuth";
import steamRouter from "./auth/SteamAuth";

const router = Router();

router.get('/ping',  (req: express.Request, res: express.Response, next: express.NextFunction) => {
	return res.json({hello: "world!"});
});
router.use('/api', apiRouter);

router.use('/auth/discord', discordRouter);
router.use('/auth/steam', steamRouter);

export default router;
