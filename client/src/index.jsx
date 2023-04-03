import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { ThemeProvider } from 'styled-components';
import React from 'react';
import styled from 'styled-components';
import App from 'App';
import { BrowserRouter } from 'react-router-dom';

import { createRoot } from 'react-dom/client';

// This is the theme we have just created.
import theme from "./theme/materialTheme";

const MyThemeComponent = styled('div')(({ theme }) => ({
  //color: theme.palette.primary.contrastText,
  //backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <MyThemeComponent>
        <App />
      </MyThemeComponent>
    </ThemeProvider>
  </BrowserRouter>,
);
