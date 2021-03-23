import {PermissionActions, PermissionLevels, permissionMap} from "../../models/userAccounts/PermissionLevels";
import {clearBit, setBit, testBit} from "../../utils/bitOps";
import {UserAccount} from "../../models/userAccounts/UserAccount";

type actionSet = {
	action: PermissionActions,
	value: boolean
}

export function editPermBits(existingPerms: number, permEdits: actionSet[]): number {
	for (const edit in permEdits) if (permEdits.hasOwnProperty(edit)) {
		existingPerms = permEdits[edit].value ? setBit(existingPerms, permEdits[edit].action) :  clearBit(existingPerms, permEdits[edit].action);
	}
	return existingPerms;
}

export function hasPermission(userAccount: UserAccount, permAction: PermissionActions): boolean {
	return permAction in permissionMap.get(userAccount.permissionLvl || 0);
}

export function hasActionPermission(userPerms: number, permAction: PermissionActions): boolean {
	return testBit(userPerms, permAction);
}
