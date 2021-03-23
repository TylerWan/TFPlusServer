import express, {Router} from 'express';
import passport from "passport";
import {addAuthKey, generateAuthKey, linkDiscord} from "../../services/auth/AuthService";
import {Id_Type} from "../../models/userAccounts/UserIdTypes";
import {getUserAccountById} from "../../services/userAccounts/UserAccountService";

const discordRouter = Router();

discordRouter.get('/', passport.authenticate('discord', { scope: ['identify'] }),
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
	}
);

discordRouter.get('/callback',
	passport.authenticate('discord', { failureRedirect: '/' }),
	async (req: any, res: express.Response, next: express.NextFunction) =>{
		const userJson = req.user;
		if (!!userJson.id) {
			const existingAuthkey = req.cookies["tfplus-authkey"];
			const authKeyAccount = await getUserAccountById(Id_Type.AUTH_KEY, existingAuthkey.toString());
			if (!!authKeyAccount && !!authKeyAccount.steamId) {
				const authKey = generateAuthKey();
				await addAuthKey(authKey, Id_Type.ACCOUNT_ID, authKeyAccount.accountId);
				await linkDiscord(authKey, userJson.id);
				// await checkInUser(authKey, Id_Type.DISCORD_ID, userJson.id);
				res.cookie('tfplus-authkey', authKey);
			}
		}
		console.log('userJson');
		console.log(userJson);
		res
			.redirect('http://localhost:3000/login')
	});

export default discordRouter;
