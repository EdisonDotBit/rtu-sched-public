/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                roboto: ["Roboto", 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
            },
            screens: {
                "xsm": "200px",
            },
        },
    },
    plugins: [daisyui],
};
