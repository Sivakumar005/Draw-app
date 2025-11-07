"use client";
import { WS_URL } from "@/config";
import { useEffect,useState } from "react";
import { Canvas } from "./Canvas";
import { tokenStorage } from "@/utlis/auth";

export function RoomCanvas({roomId}:{roomId:string}){
    const [socket,setSocket]=useState<WebSocket|null>(null);

    useEffect(()=>{
        const token=tokenStorage.get();
        const ws=new WebSocket(`${WS_URL}?token=${token}}`);

        ws.onopen=()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
        }
    },[]);

    

    if(!socket){
        return(
            <div>
                Connecting to server....
            </div>
        )
    }
    
    return(
        <Canvas roomId={roomId} socket={socket}/>
    )
}