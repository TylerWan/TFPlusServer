import getRGLProfileInfo from "./RGLFetch";
import PugAccount from "../../models/pugs/PugAccount";
import {getBaseFormatElos, PugRoleType6s, PugRoleTypeHL, RoleStats} from "../../models/pugs/RoleElos";

export async function getLatestRGL(steamId: string, discordId: string): Promise<PugAccount> {
	const pugAccountTemplate: PugAccount = {
		eloStats: undefined,
		steamId: undefined,
		discordId: undefined
	}
	return getRGLProfileInfo(steamId, discordId).then(r=> {
		if (!!r) {
			const hlBase = r.playerElos.highlander.elo > 0 ? r.playerElos.highlander.elo : r.playerElos.prolander.elo;
			pugAccountTemplate.eloStats = {
				SIXES: getBaseFormatElos("SIXES", hlBase) as { [role in PugRoleType6s]: RoleStats },
				HIGHLANDER: getBaseFormatElos("HIGHLANDER", r.playerElos["trad. sixes"].elo) as { [role in PugRoleTypeHL]: RoleStats },
			}
			pugAccountTemplate.steamId = r._steamId;
			pugAccountTemplate.discordId = r._discordId;
		}
		return pugAccountTemplate;
	})
}
