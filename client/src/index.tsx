import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import DataContextProvider from "./context/DataContextProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <DataContextProvider>
    <App />
  </DataContextProvider>
);
