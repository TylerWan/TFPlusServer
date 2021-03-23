import PugState from "../../models/pugs/PugState";
import PugAccount from "../../models/pugs/PugAccount";
import {getWaitingChannelPlayers} from "../discord/DiscordChannelService";
import {Id_Type} from "../../models/userAccounts/UserIdTypes";

let localPugStates: {[pugId: string]: PugState} = {};

let localPugAccounts: {[puggerId: string]: PugAccount} = {};

let waitingPlayers: {username: string, avatarUrl: string, discordId: string}[] = [];

export function setPugStates(pugStates: {[pugId: string]: PugState}) {
	return localPugStates = pugStates;
}

export function getPugStates(): {[pugId: string]: PugState} {
	return localPugStates;
}

export function setPugState(pugId: string, pugState: PugState) {
	return localPugStates[pugId] = pugState;
}

export function getPugState(pugId: string) {
	return localPugStates[pugId];
}

export function setDiscordWaitingPlayers(players: {username: string, avatarUrl: string, discordId: string}[]) {
	waitingPlayers = players;
}

export function getPugAccount(id: string, idType: Id_Type) {

}
