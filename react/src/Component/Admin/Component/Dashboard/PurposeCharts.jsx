import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import CustomMultiColumnLegend from "./CustomMultiColumnLegend";
import { generateColorFromString } from "../../../../Hooks/chartUtils";

const PurposeCharts = ({
    role,
    viewMode,
    appointmentsByPurpose,
    hiddenPurposes,
    hiddenOffices,
    togglePurpose,
    toggleOffice,
    barChartOptions,
    setViewMode,
}) => {
    const getAllPurposeLabels = () => {
        if (role !== "superadmin") {
            return appointmentsByPurpose.map((p) => p.purpose);
        }
        return [
            ...new Set(
                appointmentsByPurpose.flatMap((office) =>
                    office.purposes.map((p) => p.name)
                )
            ),
        ];
    };

    const getAllOfficeLabels = () => {
        if (role !== "superadmin") return [];
        return appointmentsByPurpose.map((o) => o.officeName);
    };

    const getPurposeChartData = () => {
        if (role === "superadmin") {
            if (viewMode === "combined") {
                // Combined view logic remains the same
                const allPurposes = getAllPurposeLabels().filter(
                    (purpose) => !hiddenPurposes.includes(purpose)
                );

                return {
                    labels: appointmentsByPurpose
                        .filter(
                            (office) =>
                                !hiddenOffices.includes(office.officeName)
                        )
                        .map((office) => office.officeName),
                    datasets: allPurposes.map((purpose) => ({
                        label: purpose,
                        data: appointmentsByPurpose
                            .filter(
                                (office) =>
                                    !hiddenOffices.includes(office.officeName)
                            )
                            .map((office) => {
                                const found = office.purposes.find(
                                    (p) => p.name === purpose
                                );
                                return found ? found.count : 0;
                            }),
                        backgroundColor: generateColorFromString(purpose),
                        borderColor: generateColorFromString(purpose),
                        borderWidth: 1,
                    })),
                };
            } else {
                // Modified By Office view logic
                const filteredOffices = appointmentsByPurpose.filter(
                    (office) => !hiddenOffices.includes(office.officeName)
                );

                const allPurposes = [
                    ...new Set(
                        filteredOffices.flatMap((office) =>
                            office.purposes.map((p) => p.name)
                        )
                    ),
                ].filter((purpose) => !hiddenPurposes.includes(purpose));

                return {
                    labels: filteredOffices.map((office) => office.officeName),
                    datasets: allPurposes.map((purpose) => {
                        return {
                            label: purpose,
                            data: filteredOffices.map((office) => {
                                const foundPurpose = office.purposes.find(
                                    (p) => p.name === purpose
                                );
                                return foundPurpose ? foundPurpose.count : 0;
                            }),
                            backgroundColor: generateColorFromString(purpose),
                            borderColor: generateColorFromString(purpose),
                            borderWidth: 1,
                        };
                    }),
                };
            }
        } else {
            // Regular user view remains the same
            const filteredPurposes = appointmentsByPurpose.filter(
                (p) => !hiddenPurposes.includes(p.purpose)
            );

            return {
                labels: filteredPurposes.map((p) => p.purpose),
                datasets: [
                    {
                        label: "Purposes",
                        data: filteredPurposes.map((p) => p.count),
                        backgroundColor: filteredPurposes.map((p) =>
                            generateColorFromString(p.purpose)
                        ),
                        borderColor: filteredPurposes.map((p) =>
                            generateColorFromString(p.purpose)
                        ),
                        borderWidth: 1,
                    },
                ],
            };
        }
    };

    return (
        <div className="space-y-6">
            {role === "superadmin" && (
                <div className="flex justify-end">
                    <div className="inline-flex rounded-md shadow-sm">
                        <button
                            onClick={() => setViewMode("combined")}
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                                viewMode === "combined"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            Combined View
                        </button>
                        <button
                            onClick={() => setViewMode("byOffice")}
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                viewMode === "byOffice"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            By Office
                        </button>
                    </div>
                </div>
            )}

            <CustomMultiColumnLegend
                labels={getAllPurposeLabels()}
                colors={getAllPurposeLabels().map(generateColorFromString)}
                hiddenItems={hiddenPurposes}
                toggleItem={togglePurpose}
                title="Toggle Purposes"
            />

            {role === "superadmin" && viewMode === "byOffice" && (
                <CustomMultiColumnLegend
                    labels={getAllOfficeLabels()}
                    colors={getAllOfficeLabels().map(generateColorFromString)}
                    hiddenItems={hiddenOffices}
                    toggleItem={toggleOffice}
                    title="Toggle Offices"
                    columnCount={4}
                />
            )}

            <div className="w-full h-96">
                <Bar
                    data={getPurposeChartData()}
                    options={{
                        ...barChartOptions,
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            ...barChartOptions.plugins,
                            title: {
                                display: true,
                                text:
                                    role === "superadmin"
                                        ? viewMode === "combined"
                                            ? "Purpose Distribution by Office"
                                            : "Purposes by Office"
                                        : "Purpose Distribution",
                                font: { size: 16 },
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        if (role === "superadmin") {
                                            if (viewMode === "combined") {
                                                return `${context.dataset.label}: ${context.raw}`;
                                            } else {
                                                return `${context.dataset.label} (${context.label}): ${context.raw}`;
                                            }
                                        }
                                        return `${context.label}: ${context.raw}`;
                                    },
                                },
                            },
                        },
                        scales: {
                            ...barChartOptions.scales,
                            x: {
                                stacked: false, // Changed to false to show bars side-by-side
                                grid: { display: false },
                            },
                            y: {
                                stacked: false, // Changed to false
                                beginAtZero: true,
                                grid: { drawBorder: false },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

PurposeCharts.propTypes = {
    role: PropTypes.string.isRequired,
    viewMode: PropTypes.string.isRequired,
    appointmentsByPurpose: PropTypes.array.isRequired,
    hiddenPurposes: PropTypes.array.isRequired,
    hiddenOffices: PropTypes.array.isRequired,
    togglePurpose: PropTypes.func.isRequired,
    toggleOffice: PropTypes.func.isRequired,
    barChartOptions: PropTypes.object.isRequired,
    setViewMode: PropTypes.func.isRequired,
};

export default PurposeCharts;
