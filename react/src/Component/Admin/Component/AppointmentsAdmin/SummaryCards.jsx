const SummaryCards = ({ searchResults }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">
                    Total Appointments
                </h3>
                <p className="text-2xl font-semibold">{searchResults.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Ongoing</h3>
                <p className="text-2xl font-semibold text-yellow-600">
                    {
                        searchResults.filter((a) => a.aptstatus === "ongoing")
                            .length
                    }
                </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Confirmed</h3>
                <p className="text-2xl font-semibold text-blue-600">
                    {
                        searchResults.filter((a) => a.aptstatus === "confirmed")
                            .length
                    }
                </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-2xl font-semibold text-green-600">
                    {searchResults.filter((a) => a.aptstatus === "done").length}
                </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
                <p className="text-2xl font-semibold text-red-600">
                    {
                        searchResults.filter((a) => a.aptstatus === "cancelled")
                            .length
                    }
                </p>
            </div>
        </div>
    );
};

export default SummaryCards;
