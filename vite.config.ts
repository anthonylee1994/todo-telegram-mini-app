import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: "react-vendor",
                            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        },
                        {
                            name: "mui-vendor",
                            test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
                        },
                        {
                            name: "app-vendor",
                            test: /[\\/]node_modules[\\/](axios|moment|zustand)[\\/]/,
                        },
                    ],
                },
            },
        },
    },
    plugins: [react()],
    server: {
        allowedHosts: ["8c25-61-239-192-170.ngrok-free.app"],
    },
});
