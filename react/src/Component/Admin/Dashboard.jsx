import React, { useState, useCallback } from "react";
import { useAuth } from "../../Hooks/useAuth";
import axios from "axios";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

import CollapsibleSection from "./Component/Dashboard/CollapsibleSection";
import OverviewCards from "./Component/Dashboard/OverviewCards";
import UserTypeCharts from "./Component/Dashboard/UserTypeCharts";
import PurposeCharts from "./Component/Dashboard/PurposeCharts";
import OfficeSummaryTable from "./Component/Dashboard/OfficeSummaryTable";
import EmptyState from "./Component/Dashboard/EmptyState";
import { LoadingSpinner, ErrorDisplay } from "./Component/Dashboard/helpers";
import { barChartOptions } from "../../Hooks/chartUtils";
import {
    processAppointmentsByUserType,
    processAppointmentsByPurpose,
    processOfficeSummaries,
} from "../../Hooks/dataProcessors";

const Dashboard = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { user, role, branch } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        totalRequests: 0,
        appointmentsByUserType: [],
        appointmentsByPurpose: [],
        officeSummaries: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [admname, setAdmname] = useState("");
    const [isUserTypeCollapsed, setIsUserTypeCollapsed] = useState(false);
    const [isPurposeCollapsed, setIsPurposeCollapsed] = useState(false);
    const [viewMode, setViewMode] = useState("byOffice");
    const [hiddenPurposes, setHiddenPurposes] = useState([]);
    const [hiddenUserTypes, setHiddenUserTypes] = useState([]);
    const [hiddenOffices, setHiddenOffices] = useState([]);

    const getData = useCallback(async () => {
        setLoading(true);
        try {
            let endpoint =
                role === "superadmin"
                    ? `${apiBaseUrl}/api/branchapt/${branch}`
                    : `${apiBaseUrl}/api/filteredapt/${role}/${branch}`;

            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();

            const processedData = {
                totalRequests: data.length,
                appointmentsByUserType: processAppointmentsByUserType(
                    data,
                    role
                ),
                appointmentsByPurpose: processAppointmentsByPurpose(data, role),
                officeSummaries: processOfficeSummaries(data, role),
            };

            setDashboardData(processedData);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError(
                "An error occurred while fetching dashboard data. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    }, [role, branch, apiBaseUrl]);

    const fetchAdminName = useCallback(async () => {
        if (user) {
            try {
                const response = await axios.get(
                    `${apiBaseUrl}/api/admin/informa/${user}`
                );
                setAdmname(response.data.data.admname);
            } catch (error) {
                console.error("Error fetching admin name:", error);
            }
        }
    }, [user, apiBaseUrl]);

    useDebouncedEffect(
        () => {
            if (role && branch) {
                getData();
            }
        },
        [role, branch, apiBaseUrl],
        500
    );

    useDebouncedEffect(
        () => {
            fetchAdminName();
        },
        [fetchAdminName],
        500
    );

    const toggleUserTypeCollapsed = useCallback(() => {
        setIsUserTypeCollapsed((prev) => !prev);
    }, []);

    const togglePurposeCollapsed = useCallback(() => {
        setIsPurposeCollapsed((prev) => !prev);
    }, []);

    const toggleItemVisibility = (setter) => (item) => {
        setter((prev) =>
            prev.includes(item)
                ? prev.filter((p) => p !== item)
                : [...prev, item]
        );
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard
                    </h1>
                    <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>

                <OverviewCards
                    role={role}
                    branch={branch}
                    admname={admname}
                    totalRequests={dashboardData.totalRequests}
                    officeCount={dashboardData.officeSummaries.length}
                />

                {role === "superadmin" && (
                    <div className="flex justify-end mb-4">
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

                <CollapsibleSection
                    title="Appointments by User Type"
                    isCollapsed={isUserTypeCollapsed}
                    onToggle={toggleUserTypeCollapsed}
                >
                    {dashboardData.appointmentsByUserType.length > 0 ? (
                        <UserTypeCharts
                            role={role}
                            viewMode={viewMode}
                            appointmentsByUserType={
                                dashboardData.appointmentsByUserType
                            }
                            hiddenUserTypes={hiddenUserTypes}
                            hiddenOffices={hiddenOffices}
                            toggleUserType={toggleItemVisibility(
                                setHiddenUserTypes
                            )}
                            toggleOffice={toggleItemVisibility(
                                setHiddenOffices
                            )}
                            barChartOptions={barChartOptions}
                        />
                    ) : (
                        <EmptyState message="No user type data available" />
                    )}
                </CollapsibleSection>

                <CollapsibleSection
                    title="Appointments by Purpose"
                    isCollapsed={isPurposeCollapsed}
                    onToggle={togglePurposeCollapsed}
                >
                    {dashboardData.appointmentsByPurpose.length > 0 ? (
                        <PurposeCharts
                            role={role}
                            viewMode={viewMode}
                            appointmentsByPurpose={
                                dashboardData.appointmentsByPurpose
                            }
                            hiddenPurposes={hiddenPurposes}
                            hiddenOffices={hiddenOffices}
                            togglePurpose={toggleItemVisibility(
                                setHiddenPurposes
                            )}
                            toggleOffice={toggleItemVisibility(
                                setHiddenOffices
                            )}
                            barChartOptions={barChartOptions}
                            setViewMode={setViewMode}
                        />
                    ) : (
                        <EmptyState message="No purpose data available" />
                    )}
                </CollapsibleSection>

                <OfficeSummaryTable
                    role={role}
                    branch={branch}
                    officeSummaries={dashboardData.officeSummaries}
                />
            </div>
        </div>
    );
};

export default Dashboard;
