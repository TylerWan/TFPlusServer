const NoodleJS = require('noodle.js');


export async function runs() {
	let tabs: Map<string, boolean> = new Map<string, boolean>();
	const client = new NoodleJS({

	});
	
	client.on('ready', (info: any) => {

	});
	
	client.on('voiceData', (info: any) => {
		//console.log(client.users.get(info.sender).name)
		tabs.set(client.users.get(info.sender).name,!info.lastFrame);
		console.log(tabs);
	});
	
	client.connect();
}
