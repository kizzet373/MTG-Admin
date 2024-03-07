import React from 'react';
import Iframe from 'react-iframe';

function CEDHTournamentStats() {

    return (
        <div className="iframe-container">
            <Iframe url="https://app.powerbi.com/view?r=eyJrIjoiZDg4M2YwYzAtOGE1MC00ZGVkLWEwMGYtZmU5OGM1Y2Q4YmNhIiwidCI6IjRjOGMzOTIyLTIzNTAtNDM0Zi1iZTlmLTkxMDBmODNkMzljYSIsImMiOjF9"
              className=" fullPageIframe"
              display="initial"
              position="relative"
              allowFullScreen/>
        </div>
    );
}

export default CEDHTournamentStats;