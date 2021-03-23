export type Elos = {
	SIXES: {[role in PugRoleType6s]: RoleStats},
	HIGHLANDER: {[role in PugRoleTypeHL]: RoleStats}
}

export type RoleStats = {
	elo: number,
	pugIds: string[],
	playtimeSec: number
}

export type PugRoleTypeHL = "SCOUT" | "SOLDIER" | "PYRO" | "DEMOMAN" | "HEAVY" | "ENGINEER" | "MEDIC" | "SNIPER" | "SPY"

export type PugRoleType6s = "SCOUT" | "ROAMER" | "POCKET" | "DEMOMAN" | "MEDIC"

export function getBaseFormatElos(format: "SIXES" | "HIGHLANDER", baseElo: number) {
	const baseEloStat: RoleStats = {
		elo: baseElo,
		pugIds: [],
		playtimeSec: 0
	}
	if (format === "SIXES") {
		const baseSixes: {[role in PugRoleType6s]: RoleStats} = {
			SCOUT: baseEloStat,
			ROAMER: baseEloStat,
			POCKET: baseEloStat,
			DEMOMAN: baseEloStat,
			MEDIC: baseEloStat
		};
		return baseSixes;
	} else {
		const baseHl: {[role in PugRoleTypeHL]: RoleStats} ={
			SCOUT: baseEloStat,
			SOLDIER: baseEloStat,
			PYRO: baseEloStat,
			DEMOMAN: baseEloStat,
			HEAVY: baseEloStat,
			ENGINEER: baseEloStat,
			MEDIC: baseEloStat,
			SNIPER: baseEloStat,
			SPY: baseEloStat
		};
		return baseHl
	}
}
