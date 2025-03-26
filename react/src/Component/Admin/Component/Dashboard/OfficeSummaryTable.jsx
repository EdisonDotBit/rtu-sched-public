import React from "react";
import PropTypes from "prop-types";

const OfficeSummaryTable = ({ role, branch, officeSummaries }) => (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {role === "superadmin"
                    ? `Office Summaries in ${branch} Branch`
                    : "Office Summary"}
            </h2>
            {officeSummaries.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Office Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                    Ongoing
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                                    Confirmed
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                    Done
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                                    Cancelled
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {officeSummaries.map((office, index) => (
                                <tr
                                    key={index}
                                    className={
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                    }
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {office.officeName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {office.totalRequests}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                                        {office.ongoing}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                                        {office.confirmed}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                        {office.done}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                                        {office.cancelled}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400"
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
                    <p className="mt-2 text-gray-500">
                        No office data available
                    </p>
                </div>
            )}
        </div>
    </div>
);

OfficeSummaryTable.propTypes = {
    role: PropTypes.string.isRequired,
    branch: PropTypes.string.isRequired,
    officeSummaries: PropTypes.array.isRequired,
};

export default OfficeSummaryTable;
