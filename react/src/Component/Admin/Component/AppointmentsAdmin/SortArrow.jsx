import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function SortArrow({ direction }) {
    if (direction === "asc") {
        return <FaChevronUp size={12} />;
    }
    return <FaChevronDown size={12} />;
}
