declare global {
    interface Window {
        initGoogleMapsCallback?: () => void;
        google: any;
    }
}

export { }; 