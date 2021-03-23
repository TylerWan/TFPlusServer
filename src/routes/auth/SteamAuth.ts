import express, {Router} from 'express';
import passport from "passport";
import {addAuthKey, checkInUser, generateAuthKey, updateAccountProfile} from "../../services/auth/AuthService";
import {Id_Type} from "../../models/userAccounts/UserIdTypes";

const steamRouter = Router();

steamRouter.get('/', passport.authenticate('steam', { failureRedirect: 'http://localhost:3000/login' }),
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
		res.redirect('http://localhost:3000/login');
	});

steamRouter.get('/callback',
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
		req.url = req.originalUrl;
		next();
	},
	passport.authenticate('steam', { failureRedirect: 'http://localhost:3000/login'}),
	async (req: any, res: express.Response, next: express.NextFunction) =>{
		const userJson = req.user._json;
		if (!!userJson.steamid) {
			await updateAccountProfile(Id_Type.STEAM_ID, userJson.steamid).then(r=>{});
			const authKey = generateAuthKey();
			await checkInUser(authKey, Id_Type.STEAM_ID, userJson.steamid);
			res.cookie('tfplus-authkey', authKey);
		}
		console.log('userJson');
		console.log(userJson);
		res
			.redirect('http://localhost:3000/login')
	});

export default steamRouter;
