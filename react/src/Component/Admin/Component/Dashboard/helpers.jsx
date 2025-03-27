import React from "react";
import PropTypes from "prop-types";

export const LoadingSpinner = () => {
    return React.createElement(
        "div",
        { className: "flex justify-center items-center h-64" },
        React.createElement("div", {
            className:
                "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500",
        })
    );
};

export const ErrorDisplay = ({ error }) => {
    return React.createElement(
        "div",
        {
            className:
                "text-center p-4 bg-red-50 rounded-lg max-w-md mx-auto mt-8",
        },
        [
            React.createElement(
                "svg",
                {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-12 w-12 mx-auto text-red-500",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                },
                React.createElement("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                })
            ),
            React.createElement(
                "p",
                { className: "mt-2 text-red-600 font-medium" },
                error
            ),
        ]
    );
};

ErrorDisplay.propTypes = {
    error: PropTypes.string.isRequired,
};
