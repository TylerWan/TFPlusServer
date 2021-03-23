import RoleElos, {Formats, PugRoleType} from "./RoleElos";
import {UserAccount} from "../userAccounts/UserAccount";

export default interface PugState {
	pugId: string,
	format: Formats,
	subState: PugSubState,
	playerPool: UserAccount[],
	teams: {
		blue: PugPlayer[],
		red: PugPlayer[]
	}
}

export type PugSubState = [
	"IDLE",
	"RECRUITING",
	"DRAFTING",
	"GAME",
	"POSTGAME",
	"FATKIDDING"
]

export type PugPlayer = {
	userAccount: UserAccount,
	roleElos: RoleElos,
	role: PugRoleType
}
