import WebSocket, { WebSocketServer } from 'ws';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { prisma } from '@repo/db/index';
import { UserManager } from './UserManager';

const wss = new WebSocketServer({ port: 8080 });

const userManager = UserManager.getInstance();

wss.on('connection',async function connection(ws : WebSocket, request) {
  ws.on('error', console.error);
  const url = request.url;
  const params = url?.split('?')[1];
  const token = new URLSearchParams(params).get('token');
  if (!token) {
    ws.close();
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
      ws.close();
      return;
    }
    const id = (decoded as JwtPayload).id;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      ws.close();
      return;
    }


    ws.user = user;

    userManager.addUser(user.id, ws);
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            if (message.type === 'chat') {
                userManager.sendMessage(
                    user.id,
                    message.receiverId,
                    message.content
                );
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Send initial online users list
    ws.send(JSON.stringify({
        type: 'onlineUsers',
        users: userManager.getOnlineUsers()
    }));
    
    } catch (error) {
    ws.close();
    return;
  }
  


});