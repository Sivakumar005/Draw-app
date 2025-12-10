'use client'
import axios from "axios"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoomAPI } from "@/utlis/api";
const HTTP_BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
export default function dashboard() {
    const [createRomm, setCreateRoom] = useState(false);
    const [roomName, setRoomName] = useState("");
    const router = useRouter();
    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response =await RoomAPI.createRoom({
                name:roomName
            })
            if(response.roomId){
                router.push(`/canvas/${response.roomId}`); 
            }

        } catch (err) {

        }
    }
    return (
        <div>
            <button
                onClick={() => setCreateRoom(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                New Room
            </button>

            {createRomm && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        bg-white shadow-lg p-6 rounded w-80 border">
                    <form onSubmit={handleCreateRoom} >
                        <h2>Enter the room name: </h2>
                        <input type="text" placeholder="Room Name..." value={roomName}
                            onChange={(e) => setRoomName(e.target.value)} />
                            <br />

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setCreateRoom(false)}
                                className="px-3 py-1 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Create Room
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}