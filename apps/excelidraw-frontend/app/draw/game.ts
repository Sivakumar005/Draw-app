import { Tool } from "@/Components/Canvas";
import { getExistingShapes } from "./http";
import { v4 as uuid } from "uuid";

type Shape = {
    id: string,
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    id: string,
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    id: string,
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle";
    private eraserRadius = 15;


    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();

    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape.shape)
                this.clearCanvas();
            } else if (message.type == 'deleteShape') {
                const id = message.id;
                this.existingShapes = this.existingShapes.filter((s) => s.id !== id);
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.forEach((shape) => {
            this.ctx.strokeStyle = "rgba(255,255,255)";
            this.ctx.lineWidth = 2;
            if (shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type == 'line') {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
            }
        })
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY
    }
    mouseUpHandler = (e: MouseEvent) => {
        if (this.selectedTool == "eraser") {
            this.clicked = false;
            return;
        }
        this.clicked = false
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        if (selectedTool === "rect") {
            shape = {
                id: uuid(),
                type: "rect",
                x: this.startX,
                y: this.startY,
                width,
                height
            };
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                id: uuid(),
                type: "circle",
                centerX: this.startX + radius,
                centerY: this.startY + radius,
                radius: radius
            }
        } else if (selectedTool === 'line') {
            shape = {
                id: uuid(),
                type: "line",
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY
            }
        }

        if (!shape) {
            return;
        }

        this.existingShapes.push(shape);

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))
    }
    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            // this.clearCanvas();
            // this.ctx.strokeStyle = "rgba(255, 255, 255)"
            const selectedTool = this.selectedTool;
            // console.log(selectedTool)

            if (selectedTool == 'eraser') {
                const x = e.clientX;
                const y = e.clientY;

                const shapeToErase = this.findShapeAt(x, y);

                if (shapeToErase) {
                    this.existingShapes = this.existingShapes.filter((s) => s.id !== shapeToErase.id);
                    this.clearCanvas();

                    this.socket.send(
                        JSON.stringify({
                            type: "deleteShape",
                            id: shapeToErase.id,
                            roomId: this.roomId
                        })
                    )
                }
                this.clearCanvas();

                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, this.eraserRadius);
                gradient.addColorStop(0, "rgba(180, 180, 180, 0.7)");  // light grey center
                gradient.addColorStop(1, "rgba(100, 100, 100, 0.05)");
                this.ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, this.eraserRadius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }

            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255,255,255)";
            this.ctx.lineWidth = 2;

            if (selectedTool === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            } else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }

            else if (selectedTool === 'line') {
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(e.clientX, e.clientY);
                this.ctx.stroke();
            }

        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)

    }
    findShapeAt(x: number, y: number): Shape | null {
        for (let shape of this.existingShapes) {
            if (shape.type === "rect") {
                // expand detection slightly to include edges near the eraser circle
                if (
                    x >= shape.x - this.eraserRadius &&
                    x <= shape.x + shape.width + this.eraserRadius &&
                    y >= shape.y - this.eraserRadius &&
                    y <= shape.y + shape.height + this.eraserRadius
                ) {
                    return shape;
                }
            }

            else if (shape.type === "circle") {
                const dx = x - shape.centerX;
                const dy = y - shape.centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // consider eraser radius as hit tolerance
                if (distance <= shape.radius + this.eraserRadius) {
                    return shape;
                }
            }

            else if (shape.type === "line") {
                const dist = this.pointToLineDistance(
                    x,
                    y,
                    shape.startX,
                    shape.startY,
                    shape.endX,
                    shape.endY
                );
                // eraser radius replaces static 5px tolerance
                if (dist < this.eraserRadius) return shape;
            }
        }
        return null;
    }

    pointToLineDistance(
        px: number,
        py: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): number {
        // project cursor point onto line segment and compute perpendicular distance
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) param = dot / lenSq;

        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

}