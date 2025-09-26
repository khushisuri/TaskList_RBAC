import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  useTheme,
  Typography,
} from '@mui/material';
import WidgetWrapper from './WidgetWrapper.tsx';
import { type RootState } from '../../types.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from '../../state.tsx';
import { type Task, type TaskFormValues } from '../../types.tsx';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup
    .string()
    .max(100, 'Description should be a maximum of 100 characters'),
  completedStatus: yup.boolean(),
});

interface TaskFormProps {
  setRoute?: (route: string) => void;
  editFormValues?: Task | null;
  setSelectedTask?: React.Dispatch<React.SetStateAction<Task | null>>;
  setShowEditModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  setRoute,
  editFormValues,
  setSelectedTask,
  setShowEditModal,
}) => {
  const theme = useTheme();
  const token = useSelector((st: RootState) => st.app.token);
  const dispatch = useDispatch();

  const closeModal = () => {
    setSelectedTask?.(null);
    setShowEditModal?.(false);
  };
  const createTask = async (values: TaskFormValues, resetForm: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/tasks/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg =
          errorData.message || `${response.status} ${response.statusText}`;
        throw new Error(errMsg);
      }
      const res = await response.json();
      dispatch(setTasks(res.tasks));
      alert('Task created sucessfully');
      resetForm();
      setRoute !== undefined && setRoute('tasklist');
    } catch (error: any) {
      console.error({ message: error.message });
      alert(error.message);
    }
  };

  const editTask = async (values: TaskFormValues, resetForm: any) => {
    try {
      const id = editFormValues?._id;
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/tasks/edit/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg =
          errorData.message || `${response.status} ${response.statusText}`;
        throw new Error(errMsg);
      }
      const res = await response.json();
      dispatch(setTasks(res.tasks));
      alert('Task edited sucessfully');
      resetForm();
      closeModal();
    } catch (error: any) {
      console.error({ message: error.message });
      alert(error.message);
      closeModal();
    }
  };

  const formik = useFormik({
    initialValues: editFormValues
      ? {
          title: editFormValues.title,
          description: editFormValues.description,
          completedStatus: editFormValues.completedStatus,
        }
      : {
          title: '',
          description: '',
          completedStatus: false,
        },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      editFormValues
        ? editTask(values, resetForm)
        : createTask(values, resetForm);
    },
  });

  return (
    <WidgetWrapper theme={theme} margin="0rem !important">
      <Typography
        color={theme.palette.secondary.dark}
        variant="h2"
        fontWeight={500}
        paddingBottom={'1rem'}
      >
        {editFormValues ? 'Edit Task' : 'Create Task'}
      </Typography>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          flexDirection: 'column',
        }}
      >
        <TextField
          fullWidth
          id="title"
          name="title"
          label="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextField
          fullWidth
          id="description"
          name="description"
          label="Description"
          type="text"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          multiline
          rows={5}
        />

        <FormControlLabel
          control={
            <Checkbox
              id="completedStatus"
              name="completedStatus"
              checked={formik.values.completedStatus}
              onChange={formik.handleChange}
            />
          }
          label="Completed"
        />

        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </WidgetWrapper>
  );
};

export default TaskForm;
