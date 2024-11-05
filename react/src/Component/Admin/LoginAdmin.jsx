import { useState } from "react";
import { useAuth } from "../../Hooks/useAuth";
import axios from "axios";
function LoginAdmin() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({});
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/admin/login`,
                formData
            );

            if (response.status === 200) {
                // Pass the entire response to the login function
                login({
                    user: formData.admuser,
                    role: response.data.admrole,
                });
                alert("Login Success");
            }
        } catch (error) {
            alert("Wrong Credentials please try again");
        }
    };

    return (
        <>
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-2xl font-bold sm:text-3xl">LOGIN</h1>
                </div>

                <form className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                    <div>
                        <label className="m-3 input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-5/6">
                            Username :
                            <input
                                name="admuser"
                                type="text"
                                value={formData.admuser}
                                onChange={handleChange}
                                placeholder="Banaglorios Nga Pala"
                                className="grow"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="m-3 input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-5/6">
                            Password :
                            <input
                                name="admpass"
                                value={formData.admpass}
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                placeholder="Bakal Pass"
                                className="grow focus:border-blue-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}{" "}
                            </button>
                        </label>
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                            onClick={handleLogin}
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default LoginAdmin;
