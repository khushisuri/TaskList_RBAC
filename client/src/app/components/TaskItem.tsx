import { Box, Typography, useTheme } from "@mui/material";
import { type Task } from "../../types.tsx";
import React, { useState, useEffect } from "react";
import Flexbetween from "./Flexbetween.tsx";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { useSelector } from "react-redux";
import { type RootState } from "../../types.tsx";

interface TaskItemProps {
  task: Task;
  setSelectedTask?: React.Dispatch<React.SetStateAction<Task | null>>;
  setShowEditModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRemoveModal?: React.Dispatch<React.SetStateAction<boolean>>;
}
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  setSelectedTask,
  setShowEditModal,
  setShowRemoveModal,
}) => {
  const user = useSelector((st: RootState) => st.app.user);
  const token = useSelector((st: RootState) => st.app.token);
  const theme = useTheme();
  const [orgName, setOrgName] = useState("");

  const getOrg = async () => {
    try {
      const id = task?.orgId;
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/organizations/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      setOrgName(res.organization.name);
    } catch (error: any) {
      console.error({ message: error.message });
      alert(error.message);
    }
  };

  useEffect(() => {
    getOrg();
  }, []);

  return (
    <Box
      padding={"1rem"}
      margin={"1rem 0rem"}
      sx={{
        backgroundColor: theme.palette.secondary.light,
        borderRadius: "10px",
      }}
      display={"flex"}
      flexDirection={"column"}
      gap="0.5rem"
    >
      <Flexbetween alignItems="flex-start !important">
        <Box display={"flex"} flexDirection={"column"}>
          <Box
            sx={{
              backgroundColor: theme.palette.secondary.dark,
              color: theme.palette.secondary.light,
              width: "max-content",
              marginBottom: "0.5rem",
              borderRadius: "8px",
              padding: "0.2rem 0.5rem",
            }}
          >
            {orgName ? orgName : "Loading..."}
          </Box>
          <Typography variant="h4" fontWeight="700">
            {task.title}
          </Typography>
          <Typography
            color={theme.palette.grey[900]}
            textTransform={"capitalize"}
            fontWeight="500"
          >
            {task.description}
          </Typography>
        </Box>
        <Box display={"flex"} gap="1rem">
          <EditIcon
            sx={{ cursor: "pointer" }}
            onClick={() => {
              if (user?.role !== "viewer") {
                setSelectedTask !== undefined && setSelectedTask(task);
                setShowEditModal !== undefined && setShowEditModal(true);
              } else {
                alert(
                  "you are a viewer and dont have permission to edit a task"
                );
              }
            }}
          />
          <RemoveCircleIcon
            sx={{ cursor: "pointer" }}
            onClick={() => {
              if (user?.role !== "viewer") {
                setSelectedTask !== undefined && setSelectedTask(task);
                setShowRemoveModal !== undefined && setShowRemoveModal(true);
              } else {
                alert(
                  "you are a viewer and dont have permission to remove a task"
                );
              }
            }}
          />
        </Box>
      </Flexbetween>
      {task.completedStatus === true ? (
        <Box display={"flex"} gap="0.5rem">
          <Typography color={theme.palette.primary.dark}>
            Status: Completed
          </Typography>
          <CheckCircleIcon
            sx={{ cursor: "pointer", color: theme.palette.primary.dark }}
          />
        </Box>
      ) : (
        <Box display={"flex"} gap="0.5rem">
          <Typography color={theme.palette.secondary.dark}>
            Status: Pending
          </Typography>
          <PendingIcon
            sx={{ cursor: "pointer", color: theme.palette.secondary.dark }}
          />
        </Box>
      )}
    </Box>
  );
};

export default TaskItem;
