import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: { fontFamily: 'Public Sans' },
    },
  },
  components: {
    Button: {
      baseStyle: {
        border: '1px lightgrey solid',
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
