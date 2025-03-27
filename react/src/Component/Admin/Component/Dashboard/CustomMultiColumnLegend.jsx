import React from "react";
import PropTypes from "prop-types";

const CustomMultiColumnLegend = ({
    labels,
    colors,
    hiddenItems = [],
    toggleItem,
    title = "Toggle Items",
    columnCount = 3,
}) => {
    const columnSize = Math.ceil(labels.length / columnCount);
    const columns = Array.from({ length: columnCount }, (_, i) =>
        labels.slice(i * columnSize, (i + 1) * columnSize)
    );

    return (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
            <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columnCount} gap-4`}
            >
                {columns.map((column, colIndex) => (
                    <div key={colIndex} className="space-y-2">
                        {column.map((label, index) => {
                            const globalIndex = colIndex * columnSize + index;
                            return (
                                <div
                                    key={globalIndex}
                                    className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
                                    onClick={() => toggleItem(label)}
                                >
                                    <span
                                        className="inline-block h-3 w-3 rounded-full mr-2 flex-shrink-0"
                                        style={{
                                            backgroundColor:
                                                colors[
                                                    globalIndex % colors.length
                                                ],
                                        }}
                                    ></span>
                                    <span
                                        className={`text-sm truncate ${
                                            hiddenItems.includes(label)
                                                ? "opacity-50 line-through"
                                                : ""
                                        }`}
                                        title={label}
                                    >
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

CustomMultiColumnLegend.propTypes = {
    labels: PropTypes.array.isRequired,
    colors: PropTypes.array.isRequired,
    hiddenItems: PropTypes.array,
    toggleItem: PropTypes.func.isRequired,
    title: PropTypes.string,
    columnCount: PropTypes.number,
};

export default CustomMultiColumnLegend;
