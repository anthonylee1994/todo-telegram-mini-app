export {};

declare global {
    interface Window {
        Telegram?: {
            WebApp?: {
                initData: string;
                contentSafeAreaInset?: {
                    bottom?: number;
                };
                safeAreaInset?: {
                    bottom?: number;
                };
                ready?: () => void;
                expand?: () => void;
                showConfirm?: (message: string, callback: (confirmed: boolean) => void) => void;
                onEvent?: (eventType: "contentSafeAreaChanged" | "safeAreaChanged" | "viewportChanged", eventHandler: () => void) => void;
                offEvent?: (eventType: "contentSafeAreaChanged" | "safeAreaChanged" | "viewportChanged", eventHandler: () => void) => void;
            };
        };
    }
}
