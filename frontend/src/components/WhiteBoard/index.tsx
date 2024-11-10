import { useEffect, useRef } from "react";

import { socket } from "@/socket";

import type {
  TToolbarState,
  TToolbarStateAction,
} from "@/hooks/useToolbarReducer";
import { TWhiteBoardActions } from "@/types";

type TActionData = {
  action: TWhiteBoardActions;
  x: number;
  y: number;
  color: string;
  brushSize: number;
};

type TCursorPosition = Pick<TActionData, "x" | "y">;

type TWhiteBoardProps = {
  toolBarReducer: [TToolbarState, React.Dispatch<TToolbarStateAction>];
};

const WhiteBoard: React.FC<TWhiteBoardProps> = ({ toolBarReducer }) => {
  const [toolbarState, dispatchUpdateToolbarState] = toolBarReducer;

  const whiteBoardRef = useRef<HTMLCanvasElement>(null);
  const isDrawingAllowed = useRef<boolean>(false);
  const whiteBoard2DContext = useRef<CanvasRenderingContext2D | null>();

  const drawOrErase = (actionData: TActionData) => {
    if (!whiteBoard2DContext.current) return;

    const { x, y, color, brushSize } = actionData;

    whiteBoard2DContext.current.strokeStyle = color;
    whiteBoard2DContext.current.lineWidth = brushSize;
    whiteBoard2DContext.current.lineTo(x, y);
    whiteBoard2DContext.current.stroke();
  };

  const clearWhiteBoard = () => {
    if (!whiteBoard2DContext.current) return;

    whiteBoard2DContext.current?.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    dispatchUpdateToolbarState({
      type: "CLEAR_WHITEBOARD",
      payload: false,
    });
  };

  const beginPath = (cursorPosition: TCursorPosition) => {
    if (!whiteBoard2DContext.current) return;

    whiteBoard2DContext.current.beginPath();
    whiteBoard2DContext.current.moveTo(cursorPosition.x, cursorPosition.y);
  };

  useEffect(() => {
    whiteBoard2DContext.current = whiteBoardRef.current?.getContext("2d");

    const handleDrawOrErase = (actionData: TActionData) =>
      drawOrErase(actionData);
    const handleBeginPath = (actionData: TCursorPosition) =>
      beginPath(actionData);

    const handleClearWhiteBoard = () => clearWhiteBoard();

    socket.on("begin_path", handleBeginPath);
    socket.on("draw", handleDrawOrErase);
    socket.on("erase", handleDrawOrErase);
    socket.on("clear_whiteboard", handleClearWhiteBoard);

    return () => {
      socket.off("begin_path", handleBeginPath);
      socket.off("draw", handleDrawOrErase);
      socket.off("erase", handleDrawOrErase);
      socket.off("clear_whiteboard", handleClearWhiteBoard);
    };
  }, []);

  useEffect(() => {
    if (toolbarState.clearWhiteBoard) {
      clearWhiteBoard();
      socket.emit("clear_whiteboard");
    }
  }, [toolbarState.clearWhiteBoard]);

  const handleMouseDownEvent = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!whiteBoard2DContext.current) return;

    const cursorPosition = { x: e.clientX, y: e.clientY };

    isDrawingAllowed.current = true;
    beginPath(cursorPosition);

    socket.emit("begin_path", cursorPosition);
  };

  const handleMouseMoveEvent = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!whiteBoard2DContext.current || !isDrawingAllowed.current) return;

    const actionData = {
      action: toolbarState.activeAction,
      x: e.clientX,
      y: e.clientY,
      color:
        toolbarState.activeAction === "erase" ? "#fff" : toolbarState.color,
      brushSize: toolbarState.brushSize[0],
    };
    drawOrErase(actionData);

    socket.emit(toolbarState.activeAction, actionData);
  };

  const handleMouseUpEvent = () => {
    isDrawingAllowed.current = false;
  };

  return (
    <canvas
      ref={whiteBoardRef}
      height={window.innerHeight}
      width={window.innerWidth}
      onMouseDown={handleMouseDownEvent}
      onMouseMove={handleMouseMoveEvent}
      onMouseUp={handleMouseUpEvent}
    >
      Collaborative Whiteboard
    </canvas>
  );
};

export default WhiteBoard;
