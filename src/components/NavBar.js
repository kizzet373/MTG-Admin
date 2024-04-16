//Libraries
import React, { useEffect } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga'; 

//Components
import DonateButton from "../components/DonateButton";

//Contexts
import { useTheme } from '../contexts/theme-context';

function NavBar() {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    useEffect(() => {
        ReactGA.pageview(location.pathname + location.search);
    }, [location]); 

    return (
            <Navbar className={theme} bg={theme === "dark-theme" ? "dark" : "light"} data-bs-theme={theme === "dark-theme" ? "dark" : "light"} expand="lg">
                <Navbar.Brand  className={theme} as={Link} to="/">MTG Admin</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav  className="flex-grow-1">
                        <NavDropdown title="Standard" className={theme+" basic-nav-dropdown"}>
                            
                        </NavDropdown>
                        <NavDropdown title="Pioneer" className={theme+" basic-nav-dropdown"}>
                            
                        </NavDropdown>
                        <NavDropdown title="Modern" className={theme+" basic-nav-dropdown"}>
                            
                        </NavDropdown>
                        <NavDropdown title="Legacy" className={theme+" basic-nav-dropdown"}>
                            
                        </NavDropdown>
                        <NavDropdown title="Vintage" className={theme+" basic-nav-dropdown"}>
                            
                        </NavDropdown>
                        <NavDropdown title="cEDH" className={theme+" basic-nav-dropdown"}>
                            <NavDropdown.Item className={theme} as={Link} to="/tournament-stats">Tournament Stats</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className='ml-auto'>
                        <DonateButton></DonateButton>
                        {/* <button id="dark-mode-btn" onClick={toggleTheme} className="btn btn-outline-secondary ml-auto">
                            {theme === 'dark-theme' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        </button> */}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
    );
}

export default NavBar;