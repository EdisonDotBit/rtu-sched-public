/** @type {import('tailwindcss').Config} */
module.exports = {
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
    plugins: [require("daisyui")],
};
