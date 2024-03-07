//Libraries
import React from 'react';

//Components
import NavBar from "./components/NavBar";

//Contexts
import { ThemeProvider, useTheme } from './contexts/theme-context';

//Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <ThemeProvider>
        <MainContent />
    </ThemeProvider>
  );
}


const MainContent = () => {
  const { theme } = useTheme();

  return (
    <div id="main" className={theme}>
      <NavBar />
    </div>
  );
}

export default App;