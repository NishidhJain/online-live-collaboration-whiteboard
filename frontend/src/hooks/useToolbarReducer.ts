import { colors } from "@/components/Toolbar/helper";
import { TWhiteBoardActions } from "@/types";
import { useReducer } from "react";

export type TToolbarState = {
  activeAction: TWhiteBoardActions;
  brushSize: number[];
  color: string;
  clearWhiteBoard: boolean;
};

export type TToolbarStateAction =
  | {
      type: "CHANGE_COLOR";
      payload: string;
    }
  | {
      type: "CHANGE_BRUSH_SIZE";
      payload: number[];
    }
  | {
      type: "CHANGE_ACTIVE_ACTION";
      payload: TWhiteBoardActions;
    }
  | {
      type: "CLEAR_WHITEBOARD";
      payload: boolean;
    };

const toolbarInitialState: TToolbarState = {
  activeAction: "draw",
  brushSize: [3],
  color: colors[0],
  clearWhiteBoard: false,
};

function toolbarReducerFunction(
  state: TToolbarState,
  action: TToolbarStateAction
) {
  switch (action.type) {
    case "CHANGE_COLOR":
      return {
        ...state,
        color: action.payload,
      };
    case "CHANGE_BRUSH_SIZE":
      return {
        ...state,
        brushSize: action.payload,
      };
    case "CHANGE_ACTIVE_ACTION":
      return {
        ...state,
        activeAction: action.payload,
      };
    case "CLEAR_WHITEBOARD":
      return {
        ...state,
        clearWhiteBoard: action.payload,
      };
    default:
      return state;
  }
}

export const useToolbarReducer = () => {
  const toolBarReducer = useReducer(
    toolbarReducerFunction,
    toolbarInitialState
  );

  return toolBarReducer;
};
