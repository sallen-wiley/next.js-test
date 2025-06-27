import React, { useState } from "react";
import { Divider, Fab, Menu, MenuItem, ListItemIcon } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import LiveChat from "./LiveChat";

const SupportMenuFabMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showChat, setShowChat] = useState(false);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLiveChat = () => {
    setAnchorEl(null);
    setShowChat(true);
  };

  return (
    <>
      {!showChat && (
        <Fab
          color="primary"
          onClick={handleOpen}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          aria-label="Open support menu"
        >
          <HelpOutlineIcon />
        </Fab>
      )}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem onClick={handleLiveChat}>
          <ListItemIcon>
            <ChatBubbleRoundedIcon fontSize="small" />
          </ListItemIcon>
          Live Chat
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <HelpOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          Help Center
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FeedbackRoundedIcon fontSize="small" />
          </ListItemIcon>
          Leave feedback
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <NewReleasesRoundedIcon fontSize="small" />
          </ListItemIcon>
          Release notes
        </MenuItem>
      </Menu>
      {showChat && <LiveChat onClose={() => setShowChat(false)} />}
    </>
  );
};

export default SupportMenuFabMenu;
