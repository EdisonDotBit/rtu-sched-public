export default function PurposeList({
    offData,
    selectedOffice,
    setSelectedOffice,
    purposes,
    openPurposeModal,
    openInstructionModal,
    confirmDelete,
    isLoading,
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="w-full md:w-auto">
                    <label
                        htmlFor="office-select"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Office Name
                    </label>
                    <select
                        id="office-select"
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedOffice?.offid || ""}
                        onChange={(e) => {
                            const officeId = e.target.value;
                            const office = offData.find(
                                (o) => o.offid === officeId
                            );
                            setSelectedOffice(office);
                        }}
                    >
                        {offData.map((office) => (
                            <option key={office.offid} value={office.offid}>
                                {office.offname} ({office.offabbr})
                            </option>
                        ))}
                    </select>
                </div>
                {selectedOffice && (
                    <button
                        onClick={() =>
                            openPurposeModal(
                                selectedOffice,
                                selectedOffice.offname
                            )
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors self-end md:self-auto"
                    >
                        Add Purpose
                    </button>
                )}
            </div>

            {!selectedOffice ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                        Please select an office to view purposes
                    </p>
                </div>
            ) : purposes.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="mt-2 text-gray-600">No purposes added yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Purpose
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Instruction
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {purposes.map((purposeItem, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {purposeItem.purpose}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {purposeItem.instruction ? (
                                            <button
                                                onClick={() =>
                                                    openInstructionModal(
                                                        purposeItem
                                                    )
                                                }
                                                className="text-blue-600 hover:text-blue-800 flex items-center"
                                            >
                                                <svg
                                                    className="h-5 w-5 mr-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                View Instruction
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    openInstructionModal(
                                                        purposeItem
                                                    )
                                                }
                                                className="text-gray-500 hover:text-gray-700 flex items-center"
                                            >
                                                <svg
                                                    className="h-5 w-5 mr-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                                Add Instruction
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() =>
                                                confirmDelete(purposeItem)
                                            }
                                            className="text-red-600 hover:text-red-900"
                                            disabled={isLoading}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
