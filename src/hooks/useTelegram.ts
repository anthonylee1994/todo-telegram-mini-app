import {useEffect} from "react";

export function useTelegram() {
    useEffect(() => {
        window.Telegram?.WebApp?.ready?.();
        window.Telegram?.WebApp?.expand?.();
    }, []);
}
