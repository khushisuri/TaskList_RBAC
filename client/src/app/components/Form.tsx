import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  TextField,
  useTheme,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import WidgetWrapper from './WidgetWrapper.tsx';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../state.tsx';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

type Role = '' | 'owner' | 'admin' | 'viewer';

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  org: string;
  orgId: string;
  parentOrgId?: string; // set when hasParent is true
}

interface FormValuesLogin {
  email: string;
  password: string;
}

interface Organization {
  _id: string;
  name: string;
  parentOrgId: string | null;
  createdAt: string;
  updatedAt: string;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const signupSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  firstName: yup.string().required('Firstname cannot be empty'),
  lastName: yup.string().required('Lastname cannot be empty'),
  role: yup.mixed<Role>().oneOf(['owner', 'admin', 'viewer']).required(),

  // if owner → orgName required; else not required
  org: yup.string().when('role', {
    is: 'owner',
    then: (s) => s.required('Organization name is required for owners'),
    otherwise: (s) => s.notRequired(),
  }),

  // if admin/viewer → orgId required; else not required
  orgId: yup.string().when('role', {
    is: (r: Role) => r === 'admin' || r === 'viewer',
    then: (s) => s.required('Please select an organization'),
    otherwise: (s) => s.notRequired(),
  }),

  // parentOrgId stays optional; we only send it when hasParent is true
  parentOrgId: yup.string().notRequired(),
});

const Form = () => {
  const [page, setPage] = useState<'login' | 'signup'>('login');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [hasParent, setHasParent] = useState(false); // UI-only
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:700px)');

  const getOrganizations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/organizations`);
      const res = await response.json();
      setOrganizations(res.organizations ?? []);
    } catch (err) {
      console.error('Failed to load organizations', err);
      setOrganizations([]);
    }
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  const signupHandler = async (values: FormValues) => {
    try {
      // Build payload according to your rules
      const payload: any = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
      };

      if (values.role === 'owner') {
        payload.org = values.org;
        if (hasParent && values.parentOrgId) {
          payload.parentOrgId = values.parentOrgId;
        }
      } else {
        payload.orgId = values.orgId;
      }

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg =
          errorData.message || `${response.status} ${response.statusText}`;
        throw new Error(errMsg);
      }
      const res = await response.json();
      dispatch(setUser(res.user));
      setPage('login');
    } catch (error: any) {
      console.error({ message: error.message });
      alert(error.message);
    }
  };

  const loginHandler = async (values: FormValuesLogin) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg =
          errorData.message || `${response.status} ${response.statusText}`;
        throw new Error(errMsg);
      }
      const res = await response.json();
      dispatch(setUser(res.user));
      dispatch(setToken(res.token));
      navigate('/tasks');
    } catch (error: any) {
      console.error({ message: error.message });
      alert(error.message);
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: '',
      org: '',
      orgId: '',
      parentOrgId: '',
    },
    validationSchema: page === 'signup' ? signupSchema : loginSchema,
    onSubmit: (values) => {
      if (page === 'signup') {
        signupHandler(values);
      } else {
        loginHandler(values);
      }
    },
  });

  const tier1Orgs = organizations.filter((o) => o.parentOrgId === null);

  return (
    <WidgetWrapper
      theme={theme}
      width={isSmallScreen ? '90%' : '60%'}
      margin={'2rem auto !important'}
    >
      <Typography
        color={theme.palette.secondary.dark}
        variant="h2"
        fontWeight={500}
        paddingBottom={'1rem'}
      >
        Get Started
      </Typography>

      <form
        onSubmit={formik.handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
      >
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        {page === 'signup' && (
          <>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
            />

            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                label="Role"
                value={formik.values.role}
                onChange={(e) => {
                  // reset org-specific fields when role changes
                  formik.handleChange(e);
                  setHasParent(false);
                  formik.setFieldValue('org', '');
                  formik.setFieldValue('orgId', '');
                  formik.setFieldValue('parentOrgId', '');
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <MenuItem value="">
                  <em>Select Role</em>
                </MenuItem>
                <MenuItem value="owner">Owner</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <Typography color="error" variant="caption">
                  {formik.errors.role}
                </Typography>
              )}
            </FormControl>

            {formik.values.role === 'owner' ? (
              <Box>
                <TextField
                  fullWidth
                  id="org"
                  name="org"
                  label="New Organization Name"
                  value={formik.values.org}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.org && Boolean(formik.errors.org)}
                  helperText={formik.touched.org && formik.errors.org}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasParent}
                      onChange={(e) => {
                        setHasParent(e.target.checked);
                        if (!e.target.checked) {
                          formik.setFieldValue('parentOrgId', '');
                        }
                      }}
                    />
                  }
                  label="This organization has a parent (Tier-1)"
                />

                {hasParent && (
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="parent-org-label">
                      Select Parent Organization
                    </InputLabel>
                    <Select
                      labelId="parent-org-label"
                      id="parentOrgId"
                      name="parentOrgId"
                      label="Select Parent Organization"
                      value={formik.values.parentOrgId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.parentOrgId &&
                        Boolean(formik.errors.parentOrgId)
                      }
                    >
                      <MenuItem value="">
                        <em>Select Parent</em>
                      </MenuItem>
                      {tier1Orgs.map((org) => (
                        <MenuItem key={org._id} value={org._id}>
                          {org.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.parentOrgId &&
                      formik.errors.parentOrgId && (
                        <Typography color="error" variant="caption">
                          {formik.errors.parentOrgId}
                        </Typography>
                      )}
                  </FormControl>
                )}
              </Box>
            ) : (
              <FormControl fullWidth margin="normal">
                <InputLabel id="org-select-label">Organization</InputLabel>
                <Select
                  labelId="org-select-label"
                  id="orgId"
                  name="orgId"
                  label="Organization"
                  value={formik.values.orgId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.orgId && Boolean(formik.errors.orgId)}
                >
                  <MenuItem value="">
                    <em>Select Organization</em>
                  </MenuItem>
                  {organizations.map((org) => (
                    <MenuItem key={org._id} value={org._id}>
                      {org.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.orgId && formik.errors.orgId && (
                  <Typography color="error" variant="caption">
                    {formik.errors.orgId}
                  </Typography>
                )}
              </FormControl>
            )}
          </>
        )}

        <Typography
          sx={{ cursor: 'pointer' }}
          color={theme.palette.secondary.dark}
          onClick={() =>
            setPage((prev) => (prev === 'signup' ? 'login' : 'signup'))
          }
        >
          {page === 'login'
            ? 'Do not have an account? Signup'
            : 'Already have an account? Login'}
        </Typography>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
        <Box display={'flex'} alignItems={'center'} gap="1rem">
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="button"
            onClick={() =>
              loginHandler({
                email: 'viewer@gmail.com',
                password: 'Taekook1@',
              })
            }
          >
            Login as Viewer
          </Button>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="button"
            onClick={() =>
              loginHandler({
                email: 'admin@gmail.com',
                password: 'Taekook1@',
              })
            }
          >
            Login as Admin
          </Button>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="button"
            onClick={() =>
              loginHandler({
                email: 'owner@gmail.com',
                password: 'Taekook1@',
              })
            }
          >
            Login as Owner
          </Button>
        </Box>
      </form>
    </WidgetWrapper>
  );
};

export default Form;
