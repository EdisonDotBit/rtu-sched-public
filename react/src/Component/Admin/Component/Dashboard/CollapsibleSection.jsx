import React from "react";

const CollapsibleSection = ({ title, isCollapsed, onToggle, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 mb-8">
        <div
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            onClick={onToggle}
        >
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <span className="text-gray-500 transition-transform duration-300">
                {isCollapsed ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </span>
        </div>
        {!isCollapsed && <div className="p-4 pt-0">{children}</div>}
    </div>
);

export default CollapsibleSection;
