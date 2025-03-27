import React from "react";
import PropTypes from "prop-types";

const EmptyState = ({ message }) => (
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
        <p className="mt-2 text-gray-500">{message}</p>
    </div>
);

EmptyState.propTypes = {
    message: PropTypes.string.isRequired,
};

export default EmptyState;
