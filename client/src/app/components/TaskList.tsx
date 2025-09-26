import { Box, Stack, Typography, Button, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import WidgetWrapper from './WidgetWrapper.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type Task } from '../../types.tsx';
import { setTasks } from '../../state.tsx';
import TaskItem from './TaskItem.tsx';
import CustomModal from './CustomModal.tsx';
import TaskForm from './TaskForm.tsx';

const TaskList = () => {
  const token = useSelector((st: RootState) => st.app.token);
  const tasks = useSelector((st: RootState) => st.app.tasks);
  const dispatch = useDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const theme = useTheme();
  const getTasks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/tasks`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg =
          errorData.message || `${response.status} ${response.statusText}`;
        throw new Error(errMsg);
      }
      const res = await response.json();
      dispatch(setTasks(res.tasks));
    } catch (error: any) {
      console.error({ message: error.message });
      alert(error.message);
    }
  };

  const removeTask = async () => {
    try {
      const id = selectedTask?._id;
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/tasks/remove/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg =
          errorData.message || `${response.status} ${response.statusText}`;
        throw new Error(errMsg);
      }
      const res = await response.json();
      dispatch(setTasks(res.tasks));
      setSelectedTask(null);
      setShowRemoveModal(false);
    } catch (error: any) {
      console.error({ message: error.message });
      alert(error.message);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);
  return (
    <>
      <WidgetWrapper
        margin={'0rem!important'}
        maxHeight={'70vh'}
        overflow={'scroll'}
      >
        <Box>
          {tasks && tasks.length > 0 ? (
            tasks.map((task: Task) => (
              <TaskItem
                key={task._id}
                task={task}
                setShowEditModal={setShowEditModal}
                setShowRemoveModal={setShowRemoveModal}
                setSelectedTask={setSelectedTask}
              ></TaskItem>
            ))
          ) : (
            <Typography variant="h5" color={theme.palette.secondary.main}>
              No exsting tasks. Click on taskform to create a task
            </Typography>
          )}
        </Box>
      </WidgetWrapper>
      {showEditModal && (
        <CustomModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
        >
          {selectedTask ? (
            <TaskForm
              editFormValues={selectedTask}
              setShowEditModal={setShowEditModal}
              setSelectedTask={setSelectedTask}
            />
          ) : (
            'Loading...'
          )}
        </CustomModal>
      )}
      {showRemoveModal && (
        <CustomModal
          open={showRemoveModal}
          onClose={() => setShowRemoveModal(false)}
        >
          {selectedTask && (
            <Box>
              <Stack spacing={2} sx={{ minWidth: 300 }}>
                <Typography variant="h6">Confirm Delete</Typography>
                <Typography variant="body2">
                  Are you sure you want to remove{' '}
                  <strong>{selectedTask.title}</strong>?
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button onClick={() => setShowRemoveModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={removeTask}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}
        </CustomModal>
      )}
    </>
  );
};

export default TaskList;
