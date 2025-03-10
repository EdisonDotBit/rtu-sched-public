/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            screens: {
                "xsm": "200px",
            },
        },
    },
    plugins: [
        require("daisyui")],
};
