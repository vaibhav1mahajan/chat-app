import type WebSocket from "ws";
import type { OutgoingMessages } from "./types";


export class User {
    id: number;
    ws: WebSocket;
    userId: string;

   constructor(id: number, ws: WebSocket, userId: string) {
    this.id = id;
    this.ws = ws;
    this.userId = userId;
   }

    public send(message: any) {
        this.ws.send(JSON.stringify(message));
    }
}