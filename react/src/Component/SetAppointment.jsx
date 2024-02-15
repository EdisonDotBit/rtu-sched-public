import React from "react";
import { Outlet } from "react-router-dom";
function SetAppointment() {
    return (
        <>
            {" "}
            <div>
                {" "}
                <Outlet />
            </div>
        </>
    );
}

export default SetAppointment;
