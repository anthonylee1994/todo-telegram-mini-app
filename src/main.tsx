import {CssBaseline, createTheme, ThemeProvider} from "@mui/material";
import ReactDOM from "react-dom/client";
import {App} from "./app.tsx";
import "./index.css";

const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
);
