import axios from "axios";

function getApiBaseUrl() {
    return import.meta.env.VITE_API_URL || "";
}

function getTelegramInitData() {
    return window.Telegram?.WebApp?.initData || "";
}

export const apiClient = axios.create({
    baseURL: getApiBaseUrl(),
});

apiClient.interceptors.request.use(config => {
    const initData = getTelegramInitData();

    if (initData) {
        config.headers.set("X-Telegram-Init-Data", initData);
    }

    return config;
});
