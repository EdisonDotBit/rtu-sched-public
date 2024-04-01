import E from "./Subcomponent/Asset/e.jpg";
function NotFound() {
    return (
        <div className="relative w-full h-screen">
            <img className="w-full h-full object-cover" src={E} alt="" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 text-white p-4">
                    404 Not found
                </div>
            </div>
        </div>
    );
}

export default NotFound;
