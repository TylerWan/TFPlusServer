export enum PermissionActions {
	DEFAULT = 0,
	WRITE_GUIDES = 1,
	RUN_PUG = 2,
	ADMIN_PUG = 3,
	ALL = 4
}

export enum PermissionLevels {
	DEFAULT,
	GUIDE,
	RUNNER,
	RUNNER_ADMIN,
	OWNER
}

export let permissionMap = new Map<PermissionLevels, PermissionActions[]> ([
	[PermissionLevels.GUIDE, [
		PermissionActions.WRITE_GUIDES
	]],
	[PermissionLevels.RUNNER, [
		PermissionActions.RUN_PUG
	]],
	[PermissionLevels.RUNNER_ADMIN, [
		PermissionActions.RUN_PUG,
		PermissionActions.ADMIN_PUG
	]],
	[PermissionLevels.OWNER, [
		PermissionActions.ALL
	]]
])
