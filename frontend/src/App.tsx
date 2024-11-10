import Toolbar from "./components/Toolbar";
import WhiteBoard from "./components/WhiteBoard";

import { useToolbarReducer } from "./hooks/useToolbarReducer";

export default function App() {
  const toolBarReducer = useToolbarReducer();

  return (
    <>
      <Toolbar toolBarReducer={toolBarReducer} />

      <WhiteBoard toolBarReducer={toolBarReducer} />
    </>
  );
}
