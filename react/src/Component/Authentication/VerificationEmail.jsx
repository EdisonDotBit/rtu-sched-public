import React from "react";

const VerificationEmail = ({ pin }) => {
    return (
        <div className="bg-gray-100 flex justify-center items-center min-h-screen p-4">
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Hello,</h2>
                <p className="text-gray-600 mt-2">Your verification PIN is:</p>
                <h1 className="text-4xl font-bold text-[#194F90] mt-4 tracking-widest">
                    {pin}
                </h1>
                <p className="text-gray-500 mt-4">
                    Please enter this PIN to complete your registration.
                </p>
            </div>
        </div>
    );
};

export default VerificationEmail;
