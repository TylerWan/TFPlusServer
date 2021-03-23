
import * as http from "http";
import { Server, Socket } from "socket.io";
import {getusers, sendChannelUpdateSocket} from "../discord/DiscordChannelService";

let io: Server;

export function initSocket(server: http.Server) {
	// sendChannelUpdateSocket();
/*	setInterval(()=>{
		sendChannelUpdateSocket();
		},
		5000)*/
	io = new Server(server, {});
	io.sockets.on('connection', (socket: Socket) => {
		console.log('connection');
		socket.emit('status', 'Hello from Socket.io');
		socket.on('hay', data => {
			console.log('hi ' + data)
		})
		socket.on('registerRoom', (channel: string) => {
			if (!socket.rooms.has(channel)) {
					console.log('joining ' + channel)
					socket.join(channel);
					// sendChannelUpdateSocket();

			}
		})
		socket.on('disconnect', () => {
			console.log('client disconnected');
		})
	});
}

export function emitRoomInfo(roomId: string, eventName: string, data: any) {
	if (io && eventName && data) {
		io.to(roomId).emit(eventName, data);
	}
}
