import { Tooltip } from "@mui/material";

const TooltipWrapper = ({ children, title, disabled = false }) => (
    <Tooltip title={title}>
        {disabled ? <span>{children}</span> : children}
    </Tooltip>
);

export default TooltipWrapper;
