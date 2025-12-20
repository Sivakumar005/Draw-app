"use client";
import { WS_URL } from "@/config";
import { useEffect, useState, useRef } from "react";
import { Canvas } from "./Canvas";
import { tokenStorage } from "@/utlis/auth";

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
        try {
            const token = tokenStorage.get();
            if (!token) {
                setConnectionStatus('error');
                console.error('No authentication token found');
                return;
            }

            // Fix: Remove extra closing brace
            const ws = new WebSocket(`${WS_URL}?token=${token}`);

            ws.onopen = () => {
                console.log('WebSocket connected');
                setConnectionStatus('connected');
                setSocket(ws);
                reconnectAttemptsRef.current = 0;
                
                ws.send(JSON.stringify({
                    type: "join_room",
                    roomId
                }));
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('error');
            };

            ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                setConnectionStatus('disconnected');
                setSocket(null);

                // Attempt to reconnect
                if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current += 1;
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
                    console.log(`Reconnecting in ${delay}ms... (Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
                    
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectWebSocket();
                    }, delay);
                } else {
                    console.error('Max reconnection attempts reached');
                }
            };

            // Heartbeat to keep connection alive
            const heartbeatInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'ping' }));
                }
            }, 30000); // Every 30 seconds

            // Store interval for cleanup
            (ws as any).heartbeatInterval = heartbeatInterval;

        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            setConnectionStatus('error');
        }
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            // Cleanup
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socket) {
                if ((socket as any).heartbeatInterval) {
                    clearInterval((socket as any).heartbeatInterval);
                }
                socket.close();
            }
        };
    }, [roomId]);

    if (connectionStatus === 'error') {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Connection Error</h2>
                    <p className="mb-4">Failed to connect to the server.</p>
                    <button 
                        onClick={() => {
                            reconnectAttemptsRef.current = 0;
                            setConnectionStatus('connecting');
                            connectWebSocket();
                        }}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    if (connectionStatus === 'connecting' || !socket) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Connecting to server...</p>
                    {reconnectAttemptsRef.current > 0 && (
                        <p className="text-sm text-gray-400 mt-2">
                            Reconnection attempt {reconnectAttemptsRef.current}/{maxReconnectAttempts}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            {connectionStatus === 'disconnected' && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded shadow-lg z-50">
                    Connection lost. Reconnecting...
                </div>
            )}
            <Canvas roomId={roomId} socket={socket} />
        </>
    );
}