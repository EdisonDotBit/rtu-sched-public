export const generateColorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 50%)`;
};

export const barChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            mode: "index",
            intersect: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                drawBorder: false,
            },
        },
        x: {
            grid: {
                display: false,
            },
        },
    },
    animation: {
        duration: 2000,
    },
};