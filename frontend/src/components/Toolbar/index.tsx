import { Pencil, Eraser, Trash2, Palette, Ruler } from "lucide-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Slider } from "../ui/slider";
import type {
  TToolbarState,
  TToolbarStateAction,
} from "@/hooks/useToolbarReducer";
import { colors } from "./helper";

type TToolbarProps = {
  toolBarReducer: [TToolbarState, React.Dispatch<TToolbarStateAction>];
};

const Toolbar: React.FC<TToolbarProps> = ({ toolBarReducer }) => {
  const [toolbarState, dispatchUpdateToolbarState] = toolBarReducer;

  const handlePencilButtonClick = () => {
    dispatchUpdateToolbarState({
      type: "CHANGE_ACTIVE_ACTION",
      payload: "draw",
    });
  };

  const handleEraserButtonClick = () => {
    dispatchUpdateToolbarState({
      type: "CHANGE_ACTIVE_ACTION",
      payload: "erase",
    });
  };

  const handleClearButtonClick = () => {
    dispatchUpdateToolbarState({
      type: "CLEAR_WHITEBOARD",
      payload: true,
    });
  };

  const handleBrushSizeChange = (e: number[]) => {
    dispatchUpdateToolbarState({ type: "CHANGE_BRUSH_SIZE", payload: e });
  };

  const handleColorChange = (e: string) => {
    dispatchUpdateToolbarState({ type: "CHANGE_COLOR", payload: e });
  };

  return (
    <section className="flex items-center gap-2 border shadow fixed bottom-5 left-2/4 -translate-x-1/2 bg-white px-4 py-2 rounded-md">
      <Button
        size="icon"
        variant={toolbarState.activeAction === "draw" ? "secondary" : "ghost"}
        onClick={handlePencilButtonClick}
      >
        <Pencil
          strokeWidth={toolbarState.activeAction === "draw" ? "3" : "2"}
        />
      </Button>

      <Button
        size="icon"
        variant={toolbarState.activeAction === "erase" ? "secondary" : "ghost"}
        onClick={handleEraserButtonClick}
      >
        <Eraser
          strokeWidth={toolbarState.activeAction === "erase" ? "3" : "2"}
        />
      </Button>

      <Button size="icon" variant="ghost" onClick={handleClearButtonClick}>
        <Trash2 />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost">
            <Palette />
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <ul className="flex flex-wrap gap-4">
            {colors.map((color) => (
              <li
                key={color}
                className={`size-7 rounded hover:scale-105 ease-linear ${
                  toolbarState.color === color
                    ? "scale-110 border border-black opacity-90"
                    : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              ></li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>
          <Button size="icon" variant="ghost">
            <Ruler />
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <Slider
            min={1}
            max={20}
            value={toolbarState.brushSize}
            onValueChange={handleBrushSizeChange}
          />
        </PopoverContent>
      </Popover>
    </section>
  );
};

export default Toolbar;
