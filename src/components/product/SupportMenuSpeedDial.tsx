import React from "react";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ChatIcon from "@mui/icons-material/Chat";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const actions = [
  { icon: <SupportAgentIcon />, name: "Contact Support" },
  { icon: <MenuBookIcon />, name: "Help Center" },
  { icon: <ChatIcon />, name: "Live Chat" },
];

const SupportMenuSpeedDial = () => {
  return (
    <SpeedDial
      ariaLabel="Support menu"
      sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}
      icon={<SpeedDialIcon icon={<HelpOutlineIcon />} />}
      direction="up"
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {}}
        />
      ))}
    </SpeedDial>
  );
};

export default SupportMenuSpeedDial;
