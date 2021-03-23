import express, {Router} from 'express';
import {getUserAccountById} from "../../services/userAccounts/UserAccountService";
import {Id_Type} from "../../models/userAccounts/UserIdTypes";
import {UserAccount} from "../../models/userAccounts/UserAccount";
import {getAccountByAuthKey} from "../../services/auth/AuthService";
import {IncomingMessage} from "http";
import router from "../index";
import pugRouter from "./pug";

const apiRouter = Router();

apiRouter.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
	return res.json({api: "nice!"});
});

apiRouter.use('/pug', pugRouter);

apiRouter.get('/user/self', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const authKey = req.query.authKey?.toString();
	let user: UserAccount;
	if (!!authKey) {
		user = await getAccountByAuthKey(authKey);
	}
	return res.json({
		user
	});
});

const auth_token = "ya29.a0AfH6SMDVzlx3EhBR0jdMEz7n4FLUarV7GA2rD7j8vZQxl093Ck7F8Y91qwOeYs7tmrB7vkE8C-Blcl_8zzdE74-WVrC46Ci-etKh4tO2G6fFA8Yr4VqfcUTdJo_bX1Z12lIVmGWb7_QnuaDE-ukmnQBdJAfMhlZ8pWH7GnPzAeQ"
apiRouter.get('/doc/:docid', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const https = require('https');

	https.get('https://docs.googleapis.com/v1/documents/' + req.params.docid + '?access_token=' + auth_token, (resp: IncomingMessage) => {
		let data = '';

		// A chunk of data has been received.
		resp.on('data', (chunk) => {
			data += chunk;
		});

		// The whole response has been received. Print out the result.
		resp.on('end', () => {
			res.send(JSON.parse(JSON.stringify(data)))
		});

	}).on("error", (err: Error) => {
		console.log("Error: " + err.message);
	});
	// res.send(example);

});


export default apiRouter;
