import {DocumentReference} from "@google-cloud/firestore";

export interface Guide {
	title: string,
	description: string,
	author: DocumentReference,
	gDocId: string
}
