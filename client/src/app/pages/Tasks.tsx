import { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../types.tsx';
import {
  Box,
  useTheme,
  Button,
  useMediaQuery,
} from '@mui/material';
import User from '../shared/User.tsx';
import TaskForm from '../components/TaskForm.tsx';
import TaskList from '../components/TaskList.tsx';

const Tasks = () => {
  const [route, setRoute] = useState('tasklist');
  const user = useSelector((st: RootState) => st.app.user);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery('(max-width:1000px)');
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      flexDirection={isSmallScreen ? 'column' : 'row'}
      alignItems={isSmallScreen ? 'center' : 'flex-start'}
    >
      <User />
      <Box
        display="flex"
        gap="1rem"
        flexDirection="column"
        margin="2rem"
        width={'90%'}
      >
        <Box display="flex" gap="1rem">
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
            }}
            onClick={() => setRoute('tasklist')}
          >
            /tasklist
          </Button>
          {user?.role !== 'viewer' && (
            <Button
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
              }}
              onClick={() => setRoute('taskform')}
            >
              /taskform
            </Button>
          )}
        </Box>
        {route === 'taskform' && <TaskForm setRoute={setRoute} />}
        {route === 'tasklist' && <TaskList />}
      </Box>
    </Box>
  );
};

export default Tasks;
