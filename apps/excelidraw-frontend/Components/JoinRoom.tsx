// Components/JoinRoom.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoomAPI } from "@/utlis/api";

interface JoinRoomModalProps {
    open: boolean;
    onClose: () => void;
}

interface Room {
    id: number;
    slug: string;
    adminId: string;
}

export default function JoinRoomModal({ open, onClose }: JoinRoomModalProps) {
    const [roomID, setRoomID] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            loadAvailableRooms();
        }
    }, [open]);

    const loadAvailableRooms = async () => {
        try {
            const response = await RoomAPI.getRooms();
            console.log("Dashboard response:", response);
            setAvailableRooms(response.rooms || []);
        } catch (err) {
            console.error("Failed to load rooms:", err);
        }
    };

    if (!open) return null;

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        const parsedRoomId = Number(roomID);
        
        console.log("=== FORM SUBMISSION ===");
        console.log("Input value:", roomID);
        console.log("Parsed ID:", parsedRoomId);
        console.log("Is valid number:", !isNaN(parsedRoomId) && parsedRoomId > 0);
        
        if (isNaN(parsedRoomId) || parsedRoomId <= 0) {
            setError("Please enter a valid room ID");
            return;
        }

        setLoading(true);

        try {
            const response = await RoomAPI.joinRoom({ roomId: parsedRoomId });
            console.log("Join successful, response:", response);

            if (response.roomId) {
                onClose();
                router.push(`/canvas/${response.roomId}`);
            }
        } catch (err: any) {
            console.error("Join room error:", err);
            
            if (err.response?.status === 404) {
                setError(`Room ${parsedRoomId} not found. Please check the ID.`);
            } else if (err.response?.status === 400) {
                setError("Invalid room ID format.");
            } else if (err.response?.status === 401) {
                setError("Authentication failed. Please sign in again.");
            } else {
                setError(err.response?.data?.message || "Failed to join room. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const selectRoom = (id: number) => {
        setRoomID(id.toString());
        setError("");
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[480px] max-h-[80vh] overflow-y-auto p-6 rounded-2xl shadow-2xl border border-gray-200 animate-fadeIn">

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Join a Room
                </h2>

                {/* Available Rooms */}
                {availableRooms.length > 0 && (
                    <div className="mb-5">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Your Rooms (click to select):
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                            {availableRooms.map((room) => (
                                <button
                                    key={room.id}
                                    type="button"
                                    onClick={() => selectRoom(room.id)}
                                    className={`w-full flex justify-between items-center p-3 rounded-lg 
                                               transition ${
                                                   roomID === room.id.toString()
                                                       ? 'bg-blue-100 border-2 border-blue-500'
                                                       : 'bg-gray-50 hover:bg-blue-50 border border-gray-200'
                                               }`}
                                >
                                    <span className="text-sm font-medium text-gray-800">
                                        {room.slug}
                                    </span>
                                    <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                                        {room.id}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleJoinRoom} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Enter Room ID
                        </label>

                        <input
                            type="number"
                            placeholder="Enter 6-digit room ID"
                            value={roomID}
                            onChange={(e) => {
                                setRoomID(e.target.value);
                                setError("");
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            disabled={loading}
                            min="100000"
                            max="999999"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter a 6-digit room ID (100000-999999)
                        </p>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 
                                       hover:bg-gray-300 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !roomID}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white 
                                       hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Joining..." : "Join Room"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}