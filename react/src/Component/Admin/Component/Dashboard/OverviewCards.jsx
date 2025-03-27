import React from "react";
import PropTypes from "prop-types";

const OverviewCards = ({
    role,
    branch,
    admname,
    totalRequests,
    officeCount,
}) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Admin Information Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Admin Information
                    </h2>
                    <p className="text-lg font-medium text-gray-900">
                        {admname}
                    </p>
                </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>Role:</span>
                    <span className="font-medium capitalize">{role}</span>
                </div>
                <div className="flex justify-between">
                    <span>Branch:</span>
                    <span className="font-medium">{branch}</span>
                </div>
            </div>
        </div>

        {/* Total Appointments Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-green-50 rounded-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Total Appointments
                    </h2>
                    <p className="text-3xl font-bold text-gray-900">
                        {totalRequests}
                    </p>
                </div>
            </div>
            <div className="text-sm text-gray-500">
                All time appointments in your branch
            </div>
        </div>

        {/* Offices Card (for superadmin only) */}
        {role === "superadmin" && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-purple-50 rounded-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Total Offices
                        </h2>
                        <p className="text-3xl font-bold text-gray-900">
                            {officeCount}
                        </p>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Offices in {branch} branch
                </div>
            </div>
        )}
    </div>
);

OverviewCards.propTypes = {
    role: PropTypes.string.isRequired,
    branch: PropTypes.string.isRequired,
    admname: PropTypes.string.isRequired,
    totalRequests: PropTypes.number.isRequired,
    officeCount: PropTypes.number,
};

export default OverviewCards;
