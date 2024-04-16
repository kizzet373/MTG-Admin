//Libraries
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga'; 

//Components
import NavBar from "./components/NavBar";
import CEDHTournamentStats from './components/CEDHTournamentStats';
import Homepage from './components/Homepage';

//Contexts
import { ThemeProvider, useTheme } from './contexts/theme-context';

//Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

ReactGA.initialize("G-LRJREVWERX");

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
      <Router>
      <NavBar />
      <Routes>
        <Route path="/tournament-stats" element={<CEDHTournamentStats />} />
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;