import { Tooltip } from "react-tooltip";

import Dashboard from "./components/Dashboard";
import "react-tooltip/dist/react-tooltip.css";

function App() {
  return (
    <>
      <Dashboard />
      {/* Global tooltip */}
      <Tooltip id="app-tooltip" place="top" effect="solid" />
    </>
  );
}

export default App;
