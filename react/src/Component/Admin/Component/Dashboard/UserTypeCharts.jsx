import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import CustomMultiColumnLegend from "./CustomMultiColumnLegend";
import { generateColorFromString } from "../../../../Hooks/chartUtils";

const UserTypeCharts = ({
    role,
    viewMode,
    appointmentsByUserType,
    hiddenUserTypes,
    hiddenOffices,
    toggleUserType,
    toggleOffice,
    barChartOptions,
}) => {
    const getAllUserTypeLabels = () => {
        if (role !== "superadmin") {
            return appointmentsByUserType.map((u) => u.userType);
        }
        return [
            ...new Set(
                appointmentsByUserType.flatMap((office) =>
                    office.users.map((u) => u.userType)
                )
            ),
        ];
    };

    const getAllOfficeLabels = () => {
        if (role !== "superadmin") return [];
        return appointmentsByUserType.map((o) => o.officeName);
    };

    const getUserTypeChartData = () => {
        if (role === "superadmin") {
            if (viewMode === "combined") {
                const combinedUsers = appointmentsByUserType
                    .filter(
                        (office) => !hiddenOffices.includes(office.officeName)
                    )
                    .flatMap((office) => office.users)
                    .filter((user) => !hiddenUserTypes.includes(user.userType))
                    .reduce((acc, user) => {
                        const existing = acc.find(
                            (u) => u.userType === user.userType
                        );
                        if (existing) existing.count += user.count;
                        else acc.push({ ...user });
                        return acc;
                    }, []);

                return {
                    labels: combinedUsers.map((user) => user.userType),
                    datasets: [
                        {
                            label: "All Offices Combined",
                            data: combinedUsers.map((user) => user.count),
                            backgroundColor: combinedUsers.map((user) =>
                                generateColorFromString(user.userType)
                            ),
                            borderColor: combinedUsers.map((user) =>
                                generateColorFromString(user.userType)
                            ),
                            borderWidth: 1,
                        },
                    ],
                };
            } else {
                const allUserTypes = [
                    ...new Set(
                        appointmentsByUserType
                            .flatMap((office) =>
                                office.users.map((user) => user.userType)
                            )
                            .filter((type) => !hiddenUserTypes.includes(type))
                    ),
                ];

                return {
                    labels: allUserTypes,
                    datasets: appointmentsByUserType
                        .filter(
                            (office) =>
                                !hiddenOffices.includes(office.officeName)
                        )
                        .map((office, idx) => {
                            const color = generateColorFromString(
                                office.officeName
                            );
                            return {
                                label: office.officeName,
                                data: allUserTypes.map((userType) => {
                                    const found = office.users.find(
                                        (u) => u.userType === userType
                                    );
                                    return found ? found.count : 0;
                                }),
                                backgroundColor: color,
                                borderColor: color,
                                borderWidth: 1,
                            };
                        }),
                };
            }
        } else {
            const filteredUsers = appointmentsByUserType.filter(
                (user) => !hiddenUserTypes.includes(user.userType)
            );

            return {
                labels: filteredUsers.map((user) => user.userType),
                datasets: [
                    {
                        label: "User Count",
                        data: filteredUsers.map((user) => user.count),
                        backgroundColor: filteredUsers.map((user) =>
                            generateColorFromString(user.userType)
                        ),
                        borderColor: filteredUsers.map((user) =>
                            generateColorFromString(user.userType)
                        ),
                        borderWidth: 1,
                    },
                ],
            };
        }
    };

    return (
        <div className="space-y-6">
            <CustomMultiColumnLegend
                labels={getAllUserTypeLabels()}
                colors={getAllUserTypeLabels().map(generateColorFromString)}
                hiddenItems={hiddenUserTypes}
                toggleItem={toggleUserType}
                title="Toggle User Types"
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
                    data={getUserTypeChartData()}
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
                                            ? "User Types (All Offices Combined)"
                                            : "Appointments by Office"
                                        : "User Type Distribution",
                                font: { size: 16 },
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        let label = context.dataset.label || "";
                                        if (
                                            role === "superadmin" &&
                                            viewMode === "byOffice"
                                        ) {
                                            label = `${context.dataset.label} - ${context.parsed.y} ${context.label}`;
                                        } else {
                                            if (label) label += ": ";
                                            label += context.parsed.y;
                                        }
                                        return label;
                                    },
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

UserTypeCharts.propTypes = {
    role: PropTypes.string.isRequired,
    viewMode: PropTypes.string.isRequired,
    appointmentsByUserType: PropTypes.array.isRequired,
    hiddenUserTypes: PropTypes.array.isRequired,
    hiddenOffices: PropTypes.array.isRequired,
    toggleUserType: PropTypes.func.isRequired,
    toggleOffice: PropTypes.func.isRequired,
    barChartOptions: PropTypes.object.isRequired,
};

export default UserTypeCharts;
