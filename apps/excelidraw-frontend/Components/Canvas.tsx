// import { initDraw } from "@/draw";
"use client"
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon ,ArrowRight,EraserIcon} from "lucide-react";
import { Game } from "@/app/draw/game";

export type Tool = "circle" | "rect" | "line" |"eraser";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {

        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }


    }, [canvasRef]);

    return <div className="h-screen w-screen overflow-hidden relative bg-gray-50">
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="absolute inset-0 w-full h-full" />
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
}

function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div className="fixed top-3 left-3 z-50">
            <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md">
                <IconButton 
                    onClick={() => {
                        setSelectedTool("line")
                    }}
                    activated={selectedTool === "line"}
                    icon={<ArrowRight />}
                />
                <IconButton onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("eraser")
                }} activated={selectedTool === "eraser"} icon={<EraserIcon />}></IconButton>
            </div>
        </div>
}
