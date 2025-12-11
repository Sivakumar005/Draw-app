"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoomAPI } from "@/utlis/api";

interface CreateRoomModalProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateRoomModal({ open, onClose }: CreateRoomModalProps) {
    const [roomName, setRoomName] = useState("");
    const router = useRouter();

    if (!open) return null;

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await RoomAPI.createRoom({ name: roomName });

            if (response.roomId) {
                onClose();
                router.push(`/canvas/${response.roomId}`);
            }
        } catch (err: any) {
            console.error(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-96 p-6 rounded-2xl shadow-2xl border border-gray-200 animate-fadeIn">

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Create a New Room
                </h2>

                <form onSubmit={handleCreateRoom} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Room Name
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. design-collab"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white 
                                       hover:bg-blue-700 transition"
                        >
                            Create
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
