import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { type Org, type RootState } from '../../types.tsx';
import WidgetWrapper from '../components/WidgetWrapper.tsx';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import pic1 from '../../assets/user.png';
import pic2 from '../../assets/protection.png';
import pic3 from '../../assets/personalized-support.png';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Flexbetween from '../components/Flexbetween.tsx';

const User = () => {
  const user = useSelector((st: RootState) => st.app.user);
  const token = useSelector((st: RootState) => st.app.token);
  const theme = useTheme();
  const [org, setOrg] = useState<Org | null>(null);
  const [childOrgs, setChildOrgs] = useState<[Org] | []>([]);
  const isSmallScreen = useMediaQuery('(max-width:1000px)');

  const getOrg = async () => {
    try {
      const id = user?.orgId;
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/organizations/${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      setOrg(res.organization);
      if (!res.parentOrgId) {
        fetchChildOrgs();
      }
    } catch (error: any) {
      console.error({ message: error.message });
      alert(error.message);
    }
  };

  const fetchChildOrgs = async () => {
    try {
      const id = user?.orgId;
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/organizations/child/${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      setChildOrgs(res.organizations);
    } catch (error: any) {
      console.error({ message: error.message });
      alert(error.message);
    }
  };

  useEffect(() => {
    getOrg();
  }, []);
  return (
    <WidgetWrapper
      maxWidth={isSmallScreen ? '90%' : '450px'}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap="1rem"
    >
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems="center"
        sx={{ borderRadius: '50%', overflow: 'hidden' }}
        height="80px"
        width="80px"
      >
        {user?.role === 'viewer' && (
          <img
            src={pic1}
            alt="profile-pic"
            style={{ height: '100%', width: '100%' }}
          ></img>
        )}
        {user?.role === 'admin' && (
          <img
            src={pic2}
            alt="profile-pic"
            style={{ height: '100%', width: '100%' }}
          ></img>
        )}
        {user?.role === 'owner' && (
          <img
            src={pic3}
            alt="profile-pic"
            style={{ height: '100%', width: '100%' }}
          ></img>
        )}
      </Box>
      <Typography
        sx={{ textTransform: 'capitalize' }}
        variant="h2"
        fontWeight="600"
      >
        {user?.role}
      </Typography>
      <Typography
        sx={{ textTransform: 'capitalize' }}
        variant="h4"
        color={theme.palette.secondary.main}
      >
        {`${user?.firstName} ${user?.lastName}`}
      </Typography>
      <Box
        alignSelf={'flex-start'}
        sx={{ textTransform: 'capitalize' }}
        display="flex"
        gap="0.5rem"
      >
        <Typography variant="h4" color={theme.palette.text.primary}>
          Email:
        </Typography>
        <Typography
          variant="h4"
          color={theme.palette.secondary.main}
          sx={{ wordBreak: 'break-word' }}
        >
          {user?.email}
        </Typography>
      </Box>
      <Box
        alignSelf={'flex-start'}
        sx={{ textTransform: 'capitalize' }}
        display="flex"
        gap="0.5rem"
      >
        <Typography variant="h4" color={theme.palette.text.primary}>
          Organization:
        </Typography>
        <Typography variant="h4" color={theme.palette.secondary.main}>
          {org ? org?.name : 'Loading...'}
        </Typography>
      </Box>
      {childOrgs.length > 0 && (
        <Box
          alignSelf={'flex-start'}
          sx={{ textTransform: 'capitalize' }}
          display="flex"
          gap="0.5rem"
          flexDirection="column"
        >
          <Typography variant="h4" color={theme.palette.text.primary}>
            Child Organizations:
          </Typography>
          <Box display="flex" gap="0.5rem" flexWrap={'wrap'}>
            {childOrgs.map((child) => (
              <Typography
                variant="h4"
                color={theme.palette.primary.main}
                key={child._id}
              >
                {child.name}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
      <Typography variant="h4" alignSelf={'flex-start'} fontWeight="600">
        Permissions:
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        gap="1rem"
        alignSelf={'flex-start'}
      >
        <Flexbetween>
          <Typography variant="h4" color={theme.palette.primary.dark}>
            view all tasks under your Organization
          </Typography>
          <CheckCircleOutlineOutlinedIcon
            sx={{ color: theme.palette.primary.dark }}
          />
        </Flexbetween>
        <Flexbetween>
          <Typography
            variant="h4"
            color={
              user?.role === 'owner' ? theme.palette.primary.dark : '#fb6a68ff'
            }
          >
            view all tasks under your Organization and related organizations
          </Typography>
          {user?.role === 'owner' ? (
            <CheckCircleOutlineOutlinedIcon
              sx={{ color: theme.palette.primary.dark }}
            />
          ) : (
            <CancelOutlinedIcon sx={{ color: '#fb6a68ff' }} />
          )}
        </Flexbetween>
        <Flexbetween>
          <Typography
            variant="h4"
            color={
              user?.role !== 'viewer' ? theme.palette.primary.dark : '#fb6a68ff'
            }
          >
            create a task
          </Typography>
          {user?.role !== 'viewer' ? (
            <CheckCircleOutlineOutlinedIcon
              sx={{ color: theme.palette.primary.dark }}
            />
          ) : (
            <CancelOutlinedIcon sx={{ color: '#fb6a68ff' }} />
          )}
        </Flexbetween>
        <Flexbetween>
          <Typography
            variant="h4"
            color={
              user?.role !== 'viewer' ? theme.palette.primary.dark : '#fb6a68ff'
            }
          >
            edit a task
          </Typography>
          {user?.role !== 'viewer' ? (
            <CheckCircleOutlineOutlinedIcon
              sx={{ color: theme.palette.primary.dark }}
            />
          ) : (
            <CancelOutlinedIcon sx={{ color: '#fb6a68ff' }} />
          )}
        </Flexbetween>
        <Flexbetween>
          <Typography
            variant="h4"
            color={
              user?.role !== 'viewer' ? theme.palette.primary.dark : '#fb6a68ff'
            }
          >
            delete a task
          </Typography>
          {user?.role !== 'viewer' ? (
            <CheckCircleOutlineOutlinedIcon
              sx={{ color: theme.palette.primary.dark }}
            />
          ) : (
            <CancelOutlinedIcon sx={{ color: '#fb6a68ff' }} />
          )}
        </Flexbetween>
      </Box>
    </WidgetWrapper>
  );
};

export default User;
