import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SignInSchema, CreateRoomSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client";
import bcrypt, { hash } from "bcrypt";
import { SALT_ROUNDS } from "@repo/backend-common/config";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

async function generateRoomId(
  prisma: typeof prismaClient
): Promise<number> {
  while (true) {
    const roomId = Math.floor(100000 + Math.random() * 900000);

    const exists = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!exists) return roomId;
  }
}


app.post('/signup', async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error)
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, SALT_ROUNDS);
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: hashedPassword,
                name: parsedData.data.name
            }
        })

        res.json({
            userId: user.id
        })
    } catch (e) {
        res.json({
            message: "User already exists with this username"
        })
    }
})

app.post('/signin', async (req, res) => {

    const parsedData = SignInSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return
    }
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
        }
    })

    if (!user) {
        res.status(403).json({
            message: "not authorized"
        })
        return;
    }
    const isPasswordValid=await bcrypt.compare(parsedData.data.password,user.password);

    if(!isPasswordValid){
        res.status(403).json({
            message:"Invalid credentials"
        })
        return
    }

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post('/create-room', middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return
    }

    const userId = req.userId;
    try {
        const roomId=await generateRoomId(prismaClient);
        const room = await prismaClient.room.create({
            data: {
                id:roomId,
                slug: parsedData.data.name,
                adminId: userId.toString(),
                createdAt: new Date().toISOString()
            }
        })

        res.json({
            roomId: room.id
        })
    } catch (err) {
        return res.status(411).json({
            message: "room already exists with this name"
        })
    }
})

app.get("/chats/:roomId",async(req,res)=>{
    const roomId=Number(req.params.roomId);
    const messages=await prismaClient.chat.findMany({
        where:{
            roomId:roomId
        },
        orderBy:{
            id:"desc"
        },
        take:50
    });
    res.json({
        messages
    })
})
 
app.get("/room/:slug",async(req,res)=>{
    const slug=req.params.slug;
    const room=await prismaClient.room.findFirst({
        where:{
            slug
        },
        
    });
    res.json({
        room
    })
})

app.get("/dashboard",middleware, async(req,res)=>{
    const userId=req.userId;
    const rooms=await prismaClient.room.findMany({
        where:{
            adminId:userId.toString()
        }
    });
    res.json({
        rooms
    })
})

app.post("/join-room",middleware,async(req,res)=>{
    const {roomId}=req.body;
    if(!roomId || typeof roomId!=="number"){
        return res.status(400).json({
            message:"Invalid room number"
        })
    }
    const room=await prismaClient.room.findUnique({
        where:{
            id:roomId
        }
    })
    if(!room){
        return res.status(404).json({
            message:"Room not found"
        })
    }
    return res.json({
        roomId:room.id,
        slug:room.slug
    })
})

app.listen(3002,()=>{
    console.log("server started on port 3002");
});
