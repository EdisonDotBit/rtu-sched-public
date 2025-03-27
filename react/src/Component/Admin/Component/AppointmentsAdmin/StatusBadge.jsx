const StatusBadge = ({ status }) => {
    const statusClasses = {
        ongoing: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        done: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusClasses[status.toLowerCase()] ||
                "bg-gray-100 text-gray-800"
            }`}
        >
            {status}
        </span>
    );
};

export default StatusBadge;
