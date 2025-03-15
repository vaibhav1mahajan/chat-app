import WebSocket from 'ws';
import { User } from './User';
export class UserManager {
    private static id :number = 1;
    private static _instance: UserManager;
    private users: User[];
    private constructor() {
        this.users = [];
    }

    public static getInstance(): UserManager {
        if (!UserManager._instance) {
            UserManager._instance = new UserManager();
        }
        return UserManager._instance;
    }
    
  public addUser(userId: string, ws: WebSocket) {
    const newId = UserManager.id++;
    this.users.push(new User(newId, ws, userId));
    ws.on("close", () => {
        this.removeUser(newId);
        // Notify other users about user going offline
        this.broadcastUserStatus(userId, false);
    });
    // Notify other users about new user
    this.broadcastUserStatus(userId, true);
    this.setupErrorHandler(ws, userId);
  }

  public removeUser(id: number) {
    this.users = this.users.filter((user) => user.id !== id);
  }
  public sendMessage(senderId: string, receiverId: string, message: string) {
    const receiver = this.users.find((user) => user.userId === receiverId);
    const sender = this.users.find((user) => user.userId === senderId);

    if (!sender) return;

    if (receiver) {
        receiver.send({
            type: "message",
            content: message,
            senderId,
            timestamp: new Date().toISOString()
        });
        
        // Send delivery confirmation to sender
        sender.send({
            type: "messageDelivered",
            receiverId,
            timestamp: new Date().toISOString()
        });
    } else {
        // Handle offline user case
        sender.send({
            type: "error",
            message: "User is not online",
            receiverId
        });
    }
  }

  private broadcastUserStatus(userId: string, isOnline: boolean) {
    const statusMessage = {
        type: isOnline ? 'userJoined' : 'userLeft',
        userId: userId
    };

    this.users.forEach(user => {
        if (user.userId !== userId) {
            user.send(statusMessage);
        }
    });
  }

  // Get list of online users
  public getOnlineUsers(): string[] {
    return this.users.map((user) => user.userId);
  }

  // Check if a user is online
  public isUserOnline(userId: string): boolean {
    return this.users.some((user) => user.userId === userId);
  }

  // Add error handling for WebSocket connections
  private setupErrorHandler(ws: WebSocket, userId: string) {
    ws.on("error", (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
      // You might want to clean up the connection here
    });
  }
 
  
  
}