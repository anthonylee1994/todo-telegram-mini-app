import {useWebApp} from "@vkruglikov/react-telegram-web-app";
import {useEffect} from "react";

export function useTelegram() {
    const webApp = useWebApp();
    useEffect(() => {
        function syncSafeAreaInset() {
            const bottomInset = Math.max(webApp?.contentSafeAreaInset?.bottom ?? 0, webApp?.safeAreaInset?.bottom ?? 0);
            document.documentElement.style.setProperty("--app-safe-area-inset-bottom", `${bottomInset}px`);
        }

        webApp?.ready?.();
        webApp?.expand?.();
        syncSafeAreaInset();

        webApp?.onEvent?.("contentSafeAreaChanged", syncSafeAreaInset);
        webApp?.onEvent?.("safeAreaChanged", syncSafeAreaInset);
        webApp?.onEvent?.("viewportChanged", syncSafeAreaInset);

        return () => {
            webApp?.offEvent?.("contentSafeAreaChanged", syncSafeAreaInset);
            webApp?.offEvent?.("safeAreaChanged", syncSafeAreaInset);
            webApp?.offEvent?.("viewportChanged", syncSafeAreaInset);
        };
    }, [webApp]);
}
