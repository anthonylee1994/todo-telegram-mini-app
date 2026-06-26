import ReactDOM from "react-dom/client";
import {App} from "./app.tsx";
import {Provider} from "./components/ui/provider";
import {Toaster} from "./components/ui/toaster";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider>
        <App />
        <Toaster />
    </Provider>
);
