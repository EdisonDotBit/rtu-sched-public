import React from "react";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";

const VerificationEmail = ({ pin }) => {
    return (
        <div className="bg-gray-100 flex justify-center items-center min-h-screen p-6 font-sans">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8 text-center border border-gray-200">
                {/* Brand Logo */}
                <div className="flex justify-center mb-4">
                    <img
                        src={Logo}
                        alt="Company Logo"
                        className="w-20 h-20 rounded-full shadow-md"
                    />
                </div>

                {/* Greeting and Message */}
                <h2 className="text-2xl font-bold text-gray-800">Hello,</h2>
                <p className="text-gray-600 mt-2 text-lg">
                    Your verification PIN is:
                </p>

                {/* PIN Display */}
                <div className="bg-[#194F90] text-white text-4xl font-bold py-4 px-6 rounded-lg mt-4 inline-block tracking-widest shadow-md">
                    {pin}
                </div>

                {/* Instructions */}
                <p className="text-gray-500 mt-6 text-sm leading-relaxed">
                    Please enter this PIN to complete your registration.
                    <br />
                    If you didn't request this, you can ignore this email.
                </p>

                {/* Footer */}
                <div className="border-t border-gray-200 mt-6 pt-4 text-sm text-gray-500">
                    <p>
                        &copy; {new Date().getFullYear()} Your Company. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerificationEmail;
