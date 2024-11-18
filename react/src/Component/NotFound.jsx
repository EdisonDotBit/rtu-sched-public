import NotFoundLogo from "./Subcomponent/Asset/page-not-found.png";
function NotFound() {
    return (
        <div className="relative w-full h-full flex justify-center items-center">
            <img className="w-[500px] h-auto" src={NotFoundLogo} alt="" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 text-white p-4">
                    404 Not found
                </div>
            </div>
        </div>
    );
}

export default NotFound;
