import styled from '@emotion/styled';
import { Box, useTheme } from '@mui/material';
import React from 'react';

const WidgetWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '10px',
  boxShadow: `1px 1px 5px 0.8px ${
    theme.palette.mode === 'light' ? '#dfdfdf' : '#C8C8C81A'
  }`,
  margin: '2rem',
  padding: '2rem',
}));
export default WidgetWrapper;
