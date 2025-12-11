"use client";

import { useState } from "react";
import CreateRoomModal from "@/Components/CreateRoom";
import GetRooms from "@/Components/GetRooms";

export default function Dashboard() {
    const [openModal, setOpenModal] = useState(false);

    return (
        <div className="p-6">
            {/* New Room Button */}
            <button
                onClick={() => setOpenModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                New Room
            </button>

            {/* Rooms List */}
            <GetRooms />

            {/* Modal */}
            <CreateRoomModal open={openModal} onClose={() => setOpenModal(false)} />
        </div>
    );
}
