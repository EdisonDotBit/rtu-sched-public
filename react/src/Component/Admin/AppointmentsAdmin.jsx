import { useEffect, useState } from "react";
function AppointmentsAdmin() {
    const [aptemail, setAptEmail] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [aptData, setAptData] = useState({});
    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(`${apiBaseUrl}/api/all`);
            const getDataResult = await getRes.json();
            setAptData(getDataResult);
        };
        getData();
    }, []);

    return (
        <div className="flex justify-center  h-full">
            <div className="flex flex-col items-center gap-[20px]">
                <input
                    className="flex justify-center items-center text-center w-[300px] p-[5px]"
                    type="text"
                    placeholder="Enter email address"
                    value={aptemail}
                    onChange={(e) => setAptEmail(e.target.value)}
                />
                {aptData.length !== 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead className="ltr:text-center rtl:text-center">
                                <tr>
                                    <th className=" whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Appointment Number
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Type
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Full name
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Branch
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Office
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Purpose
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        ID Number
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {Array.isArray(aptData) &&
                                    aptData.slice(0, 20).map((apt, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    {apt.aptstudnum}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    {apt.aptname}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                    {apt.aptdate}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                    {apt.aptbranch}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                    {apt.aptoffice}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                    {apt.aptpurpose}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                    {apt.aptemail}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppointmentsAdmin;
