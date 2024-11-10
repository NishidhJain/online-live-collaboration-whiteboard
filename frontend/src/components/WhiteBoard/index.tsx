import { useEffect, useRef } from "react";

import type {
  TToolbarState,
  TToolbarStateAction,
} from "@/hooks/useToolbarReducer";

type TWhiteBoardProps = {
  toolBarReducer: [TToolbarState, React.Dispatch<TToolbarStateAction>];
};

const WhiteBoard: React.FC<TWhiteBoardProps> = ({ toolBarReducer }) => {
  const [toolbarState, dispatchUpdateToolbarState] = toolBarReducer;

  const whiteBoardRef = useRef<HTMLCanvasElement>(null);
  const isDrawingAllowed = useRef<boolean>(false);
  const whiteBoard2DContext = useRef<CanvasRenderingContext2D | null>();

  useEffect(() => {
    whiteBoard2DContext.current = whiteBoardRef.current?.getContext("2d");
  }, []);

  useEffect(() => {
    if (toolbarState.clearWhiteBoard) {
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
    }
  }, [toolbarState.clearWhiteBoard]);

  const handleMouseDownEvent = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!whiteBoard2DContext.current) return;

    isDrawingAllowed.current = true;
    whiteBoard2DContext.current.beginPath();
    whiteBoard2DContext.current.moveTo(e.clientX, e.clientY);
  };

  const handleMouseMoveEvent = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!whiteBoard2DContext.current || !isDrawingAllowed.current) return;

    whiteBoard2DContext.current.strokeStyle =
      toolbarState.activeAction === "erase" ? "#fff" : toolbarState.color;
    whiteBoard2DContext.current.lineWidth = toolbarState.brushSize[0];
    whiteBoard2DContext.current.lineTo(e.clientX, e.clientY);
    whiteBoard2DContext.current.stroke();
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
