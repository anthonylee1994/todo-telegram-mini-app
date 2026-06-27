import {CssBaseline, createTheme, ThemeProvider} from "@mui/material";
import ReactDOM from "react-dom/client";
import {App} from "./app.tsx";
import "./index.css";
import {WebAppProvider} from "@vkruglikov/react-telegram-web-app";

const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <WebAppProvider options={{smoothButtonsTransition: true}}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </WebAppProvider>
);
