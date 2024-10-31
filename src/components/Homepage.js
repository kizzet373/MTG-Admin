//Libraries
import React from 'react';
import { Link } from 'react-router-dom';

//Contexts
import { useTheme } from '../contexts/theme-context';

function Homepage() {
    const { theme } = useTheme();

    return (
        <div 
            className={theme+" homepage-message col-sm-5"}
            style={{
                border: '1px solid black',
                padding: '20px',
                margin: '20px',
                textAlign: 'center',
                borderRadius: '10px'
            }}>
            <h1>Welcome to MTG Admin!</h1> 
                <br />
            <h1>Try the <Link to="/tournament-stats">cEDH Tournament Stats Tool</Link></h1>
        </div>
    );
}

export default Homepage;