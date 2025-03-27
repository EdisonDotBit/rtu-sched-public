const ActionButton = ({ onClick, disabled, label, color = "blue" }) => {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        green: "bg-green-100 text-green-800 hover:bg-green-200",
        yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        red: "bg-red-100 text-red-800 hover:bg-red-200",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-3 py-1 rounded-md text-xs ${colorClasses[color]} ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            {label}
        </button>
    );
};

export default ActionButton;
