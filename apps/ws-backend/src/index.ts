import { WebSocket, WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close()
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
    }

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user.rooms.filter(x => x !== parsedData.room);
    }

    console.log("message received")
    console.log(parsedData);

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      const roomIdInt = parseInt(roomId, 10);

      if (isNaN(roomIdInt)) {
        console.error("Invalid roomId:", roomId);
        return;
      }

      await prismaClient.chat.create({
        data: {
          roomId: roomIdInt,
          message,
          userId: userId,
          // If your schema has a User relation, you might need:
          // user: {
          //     connect: {
          //         id: userId
          //     }
          // }
        }
      });

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))
        }
      })
    }

    if (parsedData.type == 'deleteShape') {
      const roomId = parsedData.roomId;
      const shapeId = parsedData.id;
      try {
        const shapeMessage = await prismaClient.chat.findFirst({
          where: {
            roomId: parseInt(roomId, 10),
            message: {
              contains: shapeId
            }
          }
        });
        if (shapeMessage) {
          await prismaClient.chat.delete({
            where: { id: shapeMessage.id }
          });
        }
        users.forEach(user => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
              type: "deleteShape",
              id: shapeId,
              roomId
            }));
          }
        }); 
      }
      catch (err) {
        console.log("error deleting shape:",err);
      }
    }
  });
});
