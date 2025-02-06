import './App.css';

import Analyze from './watcher/Analyze';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/layout/Navbar';
import Watcher from './watcher/Watcher';
import theme from './theme';
import { Box } from '@mui/material';
import PrivateRoute from './components/layout/PrivateRouts';

import { useContext, createContext } from 'react';

const hardcodedUser = {
  id: 2,
  email: 'professor@jbnu.ac.kr',
  password: 'password123',
  name: '이교수',
  employeeId: 'P12345',
  role: 'PROFESSOR'
};

const AuthContext = createContext(hardcodedUser);

export function useAuth() {
  // return useContext(AuthContext);
  return {user: hardcodedUser};
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={hardcodedUser}>
        <Router>
          <Navbar />
          <Box sx={{ pt: 10 }}>
            <Routes>
              {/* <Route path="/" element={<Analyze />} /> */}
              <Route 
                path="/*" 
                element={
                  <PrivateRoute roles={['PROFESSOR', 'ASSISTANT', 'ADMIN']}>
                    <Watcher />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Box>
          </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
