"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Home() {
  const [roomId,setRoomId]=useState("");
  const router=useRouter();
  return (
    <div className={""}>
      <div>
        <input value={roomId} onChange={(e)=>{setRoomId(e.target.value)}} placeholder="Room Id"></input>
        <button onClick={()=>{
          router.push(`/room/${roomId}`)
        }}>Join Room</button>
      </div>
    </div>
  );
}
