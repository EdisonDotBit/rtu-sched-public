import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const SortArrow = ({ direction }) => {
    if (direction === "asc") {
        return <FaChevronUp size={12} />;
    }
    return <FaChevronDown size={12} />;
};

const TableHeader = ({ sortConfig, sortData, role }) => {
    const columns = [
        { key: "aptid", label: "Appt #" },
        { key: "apttype", label: "Type" },
        { key: "aptname", label: "Full Name" },
        { key: "aptbranch", label: "Branch" },
        { key: "aptoffice", label: "Office" },
        { key: "aptdate", label: "Date" },
        { key: "apttime", label: "Time" },
        { key: "aptpurpose", label: "Purpose" },
        { key: "", label: "Other Purpose" },
        { key: "aptstudnum", label: "ID Number" },
        { key: "aptstatus", label: "Status" },
        { key: "aptemail", label: "Email" },
        { key: "", label: "Attachments" },
        ...(role !== "superadmin" ? [{ key: "", label: "Actions" }] : []),
    ];

    return (
        <thead className="bg-gray-50">
            <tr>
                {columns.map((column) => (
                    <th
                        key={column.key || column.label}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => column.key && sortData(column.key)}
                    >
                        <div className="flex items-center">
                            {column.label}
                            {column.key && (
                                <span className="ml-1">
                                    {sortConfig.key === column.key && (
                                        <SortArrow
                                            direction={sortConfig.direction}
                                        />
                                    )}
                                </span>
                            )}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeader;
