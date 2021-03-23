import express, {NextFunction, Request, Response} from "express";
import http from 'http';
import session from 'express-session'
import passport from 'passport'
import * as steamStrategy from 'passport-steam';
import * as discordStrategy from 'passport-discord'
import cors from 'cors';
import bodyParser from 'body-parser';
import errorhandler from 'errorhandler';
import {AddressInfo} from 'net'
import morgan from 'morgan';
import methodOverride from 'method-override';
import * as FirestoreService from './services/firestore/FirestoreService'
import * as DiscordService from './services/discord/DiscordService'
import cookieParser from "cookie-parser";
import router from "./routes";
import {runSample} from "./services/googledoc/GoogleDocService";
import {initSocket} from "./services/socket/SocketService";
import {updateAccountProfile} from "./services/auth/AuthService";
import {Id_Type} from "./models/userAccounts/UserIdTypes";
import {runs} from "./services/mumble/MumbleService";


const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

// Normal express config defaults
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

app.use(cookieParser());

if (!isProduction) {
	app.use(errorhandler());
}

/**
 * Router Definition
 */


app.use(router);
console.log('appp..')

interface Error {
	status?: number;
}

class ErrorImpl implements Error {
	status: number;
}
/// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	const err = new ErrorImpl();
	err.status = 404; // using response here
	next(err);
});

/// error handlers
type ServerError = {
	status: number;
	message: string;
}

app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
	const status = err.status || 500;
	res.status(status);
	res.json({
		message: err.message,
		error: err
	});
});

passport.serializeUser(function(user:any, done:any) {
	done(null, user);
});

passport.deserializeUser(function(obj:any, done:any) {
	done(null, obj);
});
const localSteamStrategy = {
	returnURL: 'http://localhost:8080/auth/steam/callback',
	realm: 'http://localhost:8080/',
	apiKey: 'B232601FCB8754E2844A33F4B6CAFBBC'
};
const prodSteamStrategy = {
	returnURL: 'http://localhost:8080/auth/steam/callback',
	realm: 'http://localhost:8080/',
	apiKey: 'B232601FCB8754E2844A33F4B6CAFBBC'
};

passport.use(new steamStrategy.Strategy((isProduction ? prodSteamStrategy: localSteamStrategy),
	function(identifier: any, profile: any, done: any) {
		// asynchronous verification, for effect...
		process.nextTick(function () {
			profile.identifier = identifier;
			return done(null, profile);
		});
	}));

const localDiscordStrategy = {
	clientID: '746194841464995942',
	clientSecret: 'XRgvsib7FHRhl4Yu6a3c5Vtx0wxvpnj7',
	callbackURL: 'http://localhost:8080/auth/discord/callback',
	scope: ['identify']
};
const prodDiscordStrategy = {
	clientID: '746194841464995942',
	clientSecret: 'XRgvsib7FHRhl4Yu6a3c5Vtx0wxvpnj7',
	callbackURL: 'http://localhost:8080/auth/discord/callback',
	scope: ['identify']
};
passport.use(new discordStrategy.Strategy((isProduction ? prodDiscordStrategy: localDiscordStrategy),
	function(accessToken: any, refreshToken: any, profile: any, done: any) {
		process.nextTick(function() {
			return done(null, profile);
		});
	}));

const socketIo = require("socket.io");
FirestoreService.initFirestore().then(r => {});
DiscordService.initDiscord().then(r => {})
runSample().then(r => {});
runs().then(r => {});
console.log('bitch')
// finally, let's start our server...
const server: http.Server = http.createServer(app);
initSocket(server);
/*setTimeout(()=>{
	updateAccountProfile(Id_Type.DISCORD_ID, '171663568377348096').then(r=>{
		console.log('r');
		console.log(r);
	})
}, 1000)*/
server.listen( process.env.PORT || 8080, () => {
	const { port } = server.address() as AddressInfo;

	if (!isProduction) {

	}

});


