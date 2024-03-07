//Libraries
import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

//Components
import CEDHTournamentStats from './CEDHTournamentStats';
import Homepage from './Homepage';

//Contexts
import { useTheme } from '../contexts/theme-context';

function NavBar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Router>
            <Navbar className={theme} expand="lg">
                <Navbar.Brand  className={theme} as={Link} to="/">MTG Admin</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title="Standard" class="basic-nav-dropdown" className={theme}>
                            
                        </NavDropdown>
                        <NavDropdown title="Pioneer" class="basic-nav-dropdown" className={theme}>
                            
                        </NavDropdown>
                        <NavDropdown title="Modern" class="basic-nav-dropdown" className={theme}>
                            
                        </NavDropdown>
                        <NavDropdown title="Legacy" class="basic-nav-dropdown" className={theme}>
                            
                        </NavDropdown>
                        <NavDropdown title="Vintage" class="basic-nav-dropdown" className={theme}>
                            
                        </NavDropdown>
                        <NavDropdown title="cEDH" class="basic-nav-dropdown" className={theme}>
                            <NavDropdown.Item as={Link} to="/tournament-stats">Tournament Stats</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <button id="dark-mode-btn" onClick={toggleTheme} className="btn btn-outline-secondary ml-auto">
                            {theme === 'dark-theme' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        </button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Routes>
                <Route path="/tournament-stats" element={<CEDHTournamentStats />} />
                <Route path="/" element={<Homepage />} />
            </Routes>
        </Router>
    );
}

export default NavBar;