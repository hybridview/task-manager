import React, { Fragment } from 'react';

import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';
import Toast from './Toast';
import ProjectRoutes from './ProjectRoutes';
import styled from 'styled-components';

// We're importing .css because @font-face in styled-components causes font files
// to be constantly re-requested from the server (which causes screen flicker)
// https://github.com/styled-components/styled-components/issues/1593
import './fontStyles.css';

import { Box } from '@mui/material';


const AppWrapper = styled(Box)`
  xtext-align: center;
`;

const App = () => (
  <Fragment>
    <NormalizeStyles />
    <BaseStyles />
    <AppWrapper>
      <Toast />
      <ProjectRoutes />
    </AppWrapper>
  </Fragment>
);

export default App;
