import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App({ children }) {
    return (
        <div className="font-roboto flex flex-col min-h-screen bg-gray-100">
            {children} {/* Render the child components (e.g., Routes) */}
            <ToastContainer />
        </div>
    );
}

export default App;
