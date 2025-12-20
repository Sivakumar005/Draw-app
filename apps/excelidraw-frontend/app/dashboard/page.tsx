"use client";

import { useState } from "react";
import CreateRoomModal from "@/Components/CreateRoom";
import GetRooms from "@/Components/GetRooms";
import JoinRoomModal from "@/Components/JoinRoom";

export default function Dashboard() {
    const [openModal, setOpenModal] = useState(false);
    const [joinModal, setJoinModal] = useState(false);

    return (
        <div className="p-6">
            <div className="flex gap-6 float-end">

                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    New Room
                </button>
                <button
                    onClick={() => setJoinModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Join Room
                </button>
            </div>

            <GetRooms />

            <CreateRoomModal open={openModal} onClose={() => setOpenModal(false)} />
            <JoinRoomModal open={joinModal} onClose={() => setJoinModal(false)} />
            
        </div>
    );
}
