"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoomAPI } from "@/utlis/api";

export default function GetRooms() {
    const [rooms, setRooms] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await RoomAPI.getRooms();
                console.log("Frontend received:", response);
                setRooms(response.rooms);
            } catch (err) {
                console.error("Failed to fetch rooms:", err);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div className="mt-10 max-w-6xl mx-auto px-4">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Rooms</h2>
            </div>

            {rooms.length === 0 ? (
                <p className="text-gray-500 text-center py-20 text-lg">
                    No rooms found — create your first room to get started.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={() => router.push(`/canvas/${room.id}`)}
                            className="group bg-white border border-gray-200 
                                       rounded-2xl p-6 shadow-sm hover:shadow-xl 
                                       hover:border-blue-600 transition-all duration-300
                                       cursor-pointer hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 
                                            rounded-xl flex items-center justify-center mb-4 
                                            text-white group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"
                                    viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 
                                          2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 
                                          2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 
                                          8.485M7 17h.01" />
                                </svg>
                            </div>

                            <h3 className="font-semibold text-gray-900 text-xl leading-snug line-clamp-2">
                                {room.slug}
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                Created on {new Date(room.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
