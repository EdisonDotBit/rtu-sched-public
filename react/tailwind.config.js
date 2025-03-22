/** @type {import('tailwindcss').Config} */
module.exports = {
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
