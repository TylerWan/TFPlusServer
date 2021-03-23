import {IncomingMessage} from "http";
import PugAccount from "../../models/pugs/PugAccount";

const https = require("https");

const cheerio = require('cheerio');

const formats = [
	"prolander",
	"highlander",
	"trad. sixes"
]

const forbiddenFormats = [
	"cup",
	"yomps",
	"eu",
	"au",
	"region",
	"popup",
	"experiment"
]
function divToElo (divName: string) {
	divName = divName.toLowerCase();
	if (divName.includes('newcomer')) {
		return 500;
	}
	if (divName.includes('amateur')) {
		return 700;
	}
	if (divName.includes('intermediate') || divName.includes('im')) {
		return 1000;
	}
	if (divName.includes('main')) {
		return 1200;
	}
	if (divName.includes('div-2')) {
		return 1400;
	}
	if (divName.includes('advanced')) {
		return 1500;
	}
	if (divName.includes('div-1')) {
		return 1600;
	}
	if (divName.includes('challenger')) {
		return 1750;
	}
	if (divName.includes('invite')) {
		return 1900;
	}
	return -1;

}

export let divisions = [
	'newcomer',
	'amateur',
	'intermediate',
	'main',
	'div-2',
	'advanced',
	'div-1',
	'challenger',
	'invite'
]
function eloToDiv(elo: number) {
	if (elo <= 700) {
		return 'Newcomer/Amateur';
	}
	if (elo <= 900) {
		return 'Amateur/IM';
	}
	if (elo <= 1100) {
		return 'IM';
	}
	if (elo <= 1300) {
		return 'Main';
	}
	if (elo <= 1700) {
		return 'Advanced/Challenger';
	}
	if (elo > 1700) {
		return 'Invite';
	}
}

interface rglPlayerElos {
	highlander : {elo: number, div: string}
	prolander : {elo: number, div: string}
	'trad. sixes' : {elo: number, div: string}
}

interface RGLReturn {
	_steamId: string,
	_discordId: string,
	playerName: string,
	underBan: boolean,
	underProbation: boolean,
	playerElos: rglPlayerElos
}

export default async function getRglProfileInfo(steamId: string, discordId: string): Promise<RGLReturn | undefined> {
	if (!isSteamId(steamId) && !isDiscordId(discordId)) {
		return undefined;
	}
	let _steamId = steamId;
	let _discordId = discordId;
	return new Promise(
		(resolve, reject) => {
			const profileUrl = isSteamId(steamId) ? 'https://rgl.gg/Public/PlayerProfile.aspx?p=' + steamId :
				'https://rgl.gg/Public/PlayerProfile.aspx?d=' + discordId
			return https.get(profileUrl, (resp: IncomingMessage) => {
				let data = '';

				// A chunk of data has been recieved.
				resp.on('data', (chunk) => {
					data += chunk;
				});

				resp.on('end', () => {
					function elementText(e: any) {
						return $(e).text().trim();
					}

					const rawPage = data;
					if (rawPage.includes('Player does not exist in RGL')) {
						resolve(undefined);
					}

					const discordIndex = rawPage.indexOf("discordapp.com/users/");
					if (discordIndex > 0) {
						_discordId = rawPage.substr(discordIndex + "discordapp.com/users/".length, 18)
					}

					const steamIndex = rawPage.indexOf("steamcommunity.com/profiles/")
					if (steamIndex > 0) {
						_steamId = rawPage.substr(steamIndex + "steamcommunity.com/profiles/".length, 17)
					}


					const underProbation = rawPage.includes('Player is under probation')
					const underBan = rawPage.includes('Player is banned from RGL')
					const $ = cheerio.load(rawPage);
					const playerName = $('#ContentPlaceHolder1_Main_lblPlayerName').html();
					const playerElos: any = {};
					for (const fmt in formats) {
						if (formats.hasOwnProperty(fmt)) {
							playerElos[formats[fmt]] = {
								elo: -1,
								div: 'None'
							};
						}
					}
					const mainColChildren = $('.col-sm-9').children();
					for (const child in mainColChildren) if (mainColChildren.hasOwnProperty(child)) {
						const chVal = mainColChildren[child];
						if (chVal.name === 'h3') {
							const tCh = chVal.children[0];
							if (tCh && tCh.name === 'span') {

								const formatTitle = $(tCh).text().toLowerCase();
								let format = formatTitle;
								if ($(tCh).text().includes('RGL')) {

									// Check if proper format
									let isValidFormat = false;
									for (const fmt in formats) {
										if (formats.hasOwnProperty(fmt) && formatTitle.includes(formats[fmt])) {
											isValidFormat = true;
											format = formats[fmt];
										}
									}
									for (const ff in forbiddenFormats) {
										if (forbiddenFormats.hasOwnProperty(ff) && formatTitle.includes(forbiddenFormats[ff])) {
											isValidFormat = false;
										}
									}

									if (isValidFormat) {
										// console.log($(tCh).text())
										let formatElo = 0;
										let fmtTable = $(chVal).next()[0];
										fmtTable = $(fmtTable).next()[0];
										fmtTable = $(fmtTable.firstChild).next()[0];
										let tbr = $(fmtTable.firstChild).next()[0];
										let foundValidSeasons = 0;
										while (tbr && foundValidSeasons < 2) {
											const season = $(tbr.firstChild).next()[0];
											const div = $(season).next()[0];
											const team = $(div).next()[0];
											const endRank = $(team).next()[0];
											const recW = $(endRank).next()[0];
											let roundsWith = 0;
											let rwW = elementText(recW).split('-');
											const rlW = parseInt(rwW[1].replace(/[^0-9]/g, ''));
											rwW = parseInt(rwW[0].replace(/[^0-9]/g, ''));
											roundsWith = rwW + rlW;
											// let recWo = $(recW).next()[0];
											// let amtWn = $(recWo).next()[0];
											// let join = $(amtWn).next()[0];
											// let left = $(join).next()[0];
											// let ar = [season, div, team, endRank, recW, recWo, amtWn, join, left];
											if (formatElo > 0) {
												formatElo = (formatElo + divToElo(elementText(div)))/2;
											} else {
												formatElo = divToElo(elementText(div));
											}
											if (formatElo > 0 && roundsWith >= 5) {
												foundValidSeasons++;
											} else {}
											tbr = $(tbr).next()[0];
										}
										if (foundValidSeasons > 0) {
											playerElos[format] = {
												elo: formatElo,
												div: eloToDiv(formatElo),
												username: playerName
											}
										}
									}



								}
							}
						}
					}
					console.log('elos')
					console.log(playerElos)
					resolve({
						_steamId,
						_discordId,
						playerName,
						underBan,
						underProbation,
						playerElos
					})
				});

			}).on("error", (err: Error) => {
				console.log("Error: " + err.message);
			});
		}
	)
}
function isSteamId(steamId: string) {
	return !!steamId && (typeof steamId === "string") && steamId.length === 17;
}

function isDiscordId(discordId: string) {
	return !!discordId && (typeof discordId === "string") && discordId.length === 18;
}
