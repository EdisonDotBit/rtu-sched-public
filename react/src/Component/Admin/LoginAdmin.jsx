import { useState } from "react";

function LoginAdmin() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-2xl font-bold sm:text-3xl">LOGIN</h1>
                </div>

                <form
                    action="#"
                    className="flex flex-col mx-auto mb-0 mt- max-w-md"
                >
                    <div>
                        <label className="m-3 input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-5/6">
                            Username :
                            <input
                                type="text"
                                placeholder="Banaglorios Nga Pala"
                                className="grow"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="m-3 input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-5/6">
                            Password :
                            <input
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
                            type="submit"
                            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
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
