import React from "react";
import { Modal, Box } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, children }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
          width: { xs: "90%", sm: "400px" }, // responsive width
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;