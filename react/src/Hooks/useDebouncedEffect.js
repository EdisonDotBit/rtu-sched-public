import { useEffect } from "react";
import { debounce } from "lodash";

export const useDebouncedEffect = (callback, dependencies, delay = 500) => {
    useEffect(() => {
        const debouncedCallback = debounce(callback, delay);
        debouncedCallback();

        return () => debouncedCallback.cancel(); // Cleanup function
    }, dependencies);
};
