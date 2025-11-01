"use client"
import { initDraw } from "@/app/draw";
import { useEffect, useRef, useState } from "react";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";
import { IconButton } from "./IconButton";

export type tool = "circle" | "rect" | "pencil";

export function Canvas({ roomId, socket }: {
    socket: WebSocket
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<tool>("circle");
    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket);
        }
    }, [canvasRef])
    return (
        <div className="h-100vh overflow-hidden">
            <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
    )
}

function Topbar({ selectedTool, setSelectedTool }: {
    selectedTool: tool,
    setSelectedTool: (s: tool) => void
}) {
    return (
        <div className="fixed top-10 left-10">
            <div className="flex gap-t">
                <IconButton onClick={() => setSelectedTool("circle")} icon={<Circle />} activated={selectedTool == 'circle'} />
                <IconButton onClick={() => setSelectedTool("rect")} icon={<RectangleHorizontal />} activated={selectedTool == 'rect'} />
                <IconButton onClick={() => setSelectedTool("pencil")} icon={<Pencil />} activated={selectedTool == 'pencil'} />
            </div>

        </div>
    )
}