import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "../../Hooks/useAuth"; // Ensure correct path
import axios from "axios";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";

// Reusable Collapsible Section Component
const CollapsibleSection = ({ title, isCollapsed, onToggle, children }) => (
    <div>
        <h2
            className="mt-8 text-lg font-semibold text-[#123A69] inline-flex items-center cursor-pointer hover:text-[#194F90]"
            onClick={onToggle}
        >
            {title}
            <span
                className="ml-2 transition-transform"
                style={{
                    transform: isCollapsed ? "rotate(-90deg)" : "rotate(0)",
                }}
            >
                ▼
            </span>
        </h2>
        {!isCollapsed && children}
    </div>
);

// Reusable Table Row Component
const TableRow = ({ office }) => (
    <tr>
        <td className="px-4 py-2 font-semibold">{office.officeName}</td>
        <td className="px-4 py-2">{office.totalRequests}</td>
        <td className="px-4 py-2 text-blue-600 font-medium">
            {office.ongoing}
        </td>
        <td className="px-4 py-2 text-yellow-600 font-medium">
            {office.confirmed}
        </td>
        <td className="px-4 py-2 text-green-600 font-medium">{office.done}</td>
        <td className="px-4 py-2 text-red-600 font-medium">
            {office.cancelled}
        </td>
    </tr>
);

const Dashboard = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { user, role, branch } = useAuth(); // Retrieve role and branch dynamically
    const [dashboardData, setDashboardData] = useState({
        totalRequests: 0,
        appointmentsByUserType: [],
        appointmentsByPurpose: [],
        officeSummaries: [],
    }); // Default state to avoid undefined errors
    const [loading, setLoading] = useState(false); // Loading indicator
    const [error, setError] = useState(null); // Error state
    const [admname, setAdmname] = useState("");
    const [isUserTypeCollapsed, setIsUserTypeCollapsed] = useState(false);
    const [isPurposeCollapsed, setIsPurposeCollapsed] = useState(false);

    const getData = useCallback(async () => {
        setLoading(true);
        try {
            let endpoint =
                role === "superadmin"
                    ? `${apiBaseUrl}/api/branchapt/${branch}`
                    : `${apiBaseUrl}/api/filteredapt/${role}/${branch}`;

            console.log("Fetching from:", endpoint); // Debugging log

            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("API Response Data:", data); // Debugging log

            // Process API response to fit expected state structure
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50">
            <h1 className="text-2xl font-bold text-[#123A69]">Dashboard</h1>

            {/* Overview Section */}
            <div className="grid grid-cols-3 gap-6 mt-6">
                {/* Admin Information Section */}
                <div className="bg-white shadow-md p-4 rounded">
                    <h2 className="text-sm font-semibold text-gray-700">
                        Admin Information
                    </h2>
                    <p className="text-sm text-gray-600">Name: {admname}</p>
                    <p className="text-sm text-gray-600">Role: {role}</p>
                    <p className="text-sm text-gray-600">Branch: {branch}</p>
                </div>
                <div className="bg-white shadow-md p-4 rounded">
                    <h2 className="text-sm font-semibold text-gray-700">
                        Total Appointments
                    </h2>
                    <p className="text-xl font-bold text-[#194F90]">
                        {dashboardData.totalRequests}
                    </p>
                </div>
                {role === "superadmin" && (
                    <div className="bg-white shadow-md p-4 rounded">
                        <h2 className="text-sm font-semibold text-gray-700">
                            Total Offices in {branch}
                        </h2>
                        <p className="text-xl font-bold text-[#194F90]">
                            {dashboardData.officeSummaries.length}
                        </p>
                    </div>
                )}
            </div>

            {/* Appointments by User Type */}
            <CollapsibleSection
                title="Appointments by User Type"
                isCollapsed={isUserTypeCollapsed}
                onToggle={toggleUserTypeCollapsed}
            >
                {dashboardData.appointmentsByUserType.length > 0 ? (
                    role === "superadmin" ? (
                        dashboardData.appointmentsByUserType.map(
                            (office, index) => (
                                <div key={index} className="mt-4">
                                    <h3 className="text-md font-semibold text-[#194F90]">
                                        {office.officeName}
                                    </h3>
                                    <ul className="mt-2 space-y-2">
                                        {office.users.map((user, idx) => (
                                            <li
                                                key={idx}
                                                className="flex justify-between bg-white shadow-sm px-4 py-2 rounded"
                                            >
                                                <span>{user.userType}</span>
                                                <span>{user.count}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        )
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {dashboardData.appointmentsByUserType.map(
                                (user, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between bg-white shadow-sm px-4 py-2 rounded"
                                    >
                                        <span>{user.userType}</span>
                                        <span>{user.count}</span>
                                    </li>
                                )
                            )}
                        </ul>
                    )
                ) : (
                    <p className="text-gray-500 mt-4">No data available.</p>
                )}
            </CollapsibleSection>

            {/* Appointments by Purpose */}
            <CollapsibleSection
                title="Appointments by Purpose"
                isCollapsed={isPurposeCollapsed}
                onToggle={togglePurposeCollapsed}
            >
                {dashboardData.appointmentsByPurpose.length > 0 ? (
                    role === "superadmin" ? (
                        dashboardData.appointmentsByPurpose.map(
                            (office, index) => (
                                <div key={index} className="mt-4">
                                    <h3 className="text-md font-semibold text-[#194F90]">
                                        {office.officeName}
                                    </h3>
                                    <ul className="mt-2 space-y-2">
                                        {office.purposes.map((purpose, idx) => (
                                            <li
                                                key={idx}
                                                className="flex justify-between bg-white shadow-sm px-4 py-2 rounded"
                                            >
                                                <span>{purpose.name}</span>
                                                <span>{purpose.count}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        )
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {dashboardData.appointmentsByPurpose.map(
                                (purpose, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between bg-white shadow-sm p-2 rounded"
                                    >
                                        <span>{purpose.purpose}</span>
                                        <span>{purpose.count}</span>
                                    </li>
                                )
                            )}
                        </ul>
                    )
                ) : (
                    <p className="text-gray-500 mt-4">No data available.</p>
                )}
            </CollapsibleSection>

            {/* Office Summaries Section */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold text-[#123A69]">
                    {role === "superadmin"
                        ? `Office Summaries in ${branch} Branch`
                        : "Office Summaries"}
                </h2>
                {dashboardData.officeSummaries.length > 0 ? (
                    <table className="table-auto w-full mt-4 bg-white shadow-md rounded">
                        <thead>
                            <tr className="bg-[#FFDB75]">
                                <th className="px-4 py-2">Office Name</th>
                                <th className="px-4 py-2">Total Requests</th>
                                <th className="px-4 py-2">Ongoing</th>
                                <th className="px-4 py-2">Confirmed</th>
                                <th className="px-4 py-2">Done</th>
                                <th className="px-4 py-2">Cancelled</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-center">
                            {dashboardData.officeSummaries.map(
                                (office, index) => (
                                    <TableRow key={index} office={office} />
                                )
                            )}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 mt-4">
                        No office data available.
                    </p>
                )}
            </div>
        </div>
    );
};

// Helper functions for data processing
const processAppointmentsByUserType = (data, role) => {
    return role === "superadmin"
        ? data.reduce((acc, curr) => {
              const officeName = curr.aptoffice || "Unknown Office";
              const userType = curr.apttype || "Unknown";

              let officeGroup = acc.find(
                  (item) => item.officeName === officeName
              );
              if (!officeGroup) {
                  officeGroup = { officeName, users: [] };
                  acc.push(officeGroup);
              }

              const existingUser = officeGroup.users.find(
                  (u) => u.userType === userType
              );
              if (existingUser) {
                  existingUser.count += 1;
              } else {
                  officeGroup.users.push({ userType, count: 1 });
              }

              return acc;
          }, [])
        : data.reduce((acc, curr) => {
              const userType = curr.apttype || "Unknown";
              const existingUserType = acc.find(
                  (item) => item.userType === userType
              );
              if (existingUserType) {
                  existingUserType.count += 1;
              } else {
                  acc.push({ userType, count: 1 });
              }
              return acc;
          }, []);
};

const processAppointmentsByPurpose = (data, role) => {
    return role === "superadmin"
        ? data.reduce((acc, curr) => {
              const officeName = curr.aptoffice || "Unknown Office";
              const purposes = (curr.aptpurpose || "Unknown")
                  .split(", ")
                  .map((p) => p.trim());

              let officeGroup = acc.find(
                  (item) => item.officeName === officeName
              );
              if (!officeGroup) {
                  officeGroup = { officeName, purposes: [] };
                  acc.push(officeGroup);
              }

              purposes.forEach((purpose) => {
                  const existingPurpose = officeGroup.purposes.find(
                      (p) => p.name === purpose
                  );
                  if (existingPurpose) {
                      existingPurpose.count += 1;
                  } else {
                      officeGroup.purposes.push({ name: purpose, count: 1 });
                  }
              });

              return acc;
          }, [])
        : data.reduce((acc, curr) => {
              const purposes = (curr.aptpurpose || "Unknown")
                  .split(", ")
                  .map((p) => p.trim());

              purposes.forEach((purpose) => {
                  const existingPurpose = acc.find(
                      (item) => item.purpose === purpose
                  );
                  if (existingPurpose) {
                      existingPurpose.count += 1;
                  } else {
                      acc.push({ purpose, count: 1 });
                  }
              });

              return acc;
          }, []);
};

const processOfficeSummaries = (data, role) => {
    return role === "superadmin"
        ? data.reduce((acc, curr) => {
              const officeName = curr.aptoffice || "Unknown Office";
              const existingOffice = acc.find(
                  (item) => item.officeName === officeName
              );

              if (existingOffice) {
                  existingOffice.totalRequests += 1;
                  existingOffice.ongoing +=
                      curr.aptstatus === "ongoing" ? 1 : 0;
                  existingOffice.confirmed +=
                      curr.aptstatus === "confirmed" ? 1 : 0;
                  existingOffice.done += curr.aptstatus === "done" ? 1 : 0;
                  existingOffice.cancelled +=
                      curr.aptstatus === "cancelled" ? 1 : 0;
              } else {
                  acc.push({
                      officeName,
                      totalRequests: 1,
                      ongoing: curr.aptstatus === "ongoing" ? 1 : 0,
                      confirmed: curr.aptstatus === "confirmed" ? 1 : 0,
                      done: curr.aptstatus === "done" ? 1 : 0,
                      cancelled: curr.aptstatus === "cancelled" ? 1 : 0,
                  });
              }

              return acc;
          }, [])
        : [
              {
                  officeName: role,
                  totalRequests: data.length,
                  ongoing: data.filter((item) => item.aptstatus === "ongoing")
                      .length,
                  confirmed: data.filter(
                      (item) => item.aptstatus === "confirmed"
                  ).length,
                  done: data.filter((item) => item.aptstatus === "done").length,
                  cancelled: data.filter(
                      (item) => item.aptstatus === "cancelled"
                  ).length,
              },
          ];
};

export default Dashboard;
