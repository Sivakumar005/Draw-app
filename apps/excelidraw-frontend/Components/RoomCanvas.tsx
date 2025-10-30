"use client";
import { WS_URL } from "@/config";
import { useEffect,useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}){
    const [socket,setSocket]=useState<WebSocket|null>(null);

    useEffect(()=>{
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlNjk3ZDhkYS00YWIwLTRiYmEtYjdhYi0xYzQwNGM0Y2YwNDgiLCJpYXQiOjE3NjE1ODMyMzB9.lVVsLl-yErpu1_bPhycYYxb5eZ6kvux-qARnH4-hjHw`);

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