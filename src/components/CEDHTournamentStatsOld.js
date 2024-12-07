import React from 'react';
import Iframe from 'react-iframe';

function CEDHTournamentStatsOld() {
    const isMobile = window.innerWidth <= 800;

    const mobileReportUrl = "https://app.powerbi.com/view?r=eyJrIjoiOGY3ZDA4YTEtMTY3Ny00NjMwLTk4ZTctYTU3ZDU2ZjcxN2EwIiwidCI6IjRjOGMzOTIyLTIzNTAtNDM0Zi1iZTlmLTkxMDBmODNkMzljYSIsImMiOjF9";
    const desktopReportUrl = "https://app.powerbi.com/view?r=eyJrIjoiZDg4M2YwYzAtOGE1MC00ZGVkLWEwMGYtZmU5OGM1Y2Q4YmNhIiwidCI6IjRjOGMzOTIyLTIzNTAtNDM0Zi1iZTlmLTkxMDBmODNkMzljYSIsImMiOjF9";

    return (
        <div className="iframe-container">
            <Iframe url={isMobile ? mobileReportUrl : desktopReportUrl}
                className="fullPageIframe"
                display="initial"
                position="relative"
                allowFullScreen />
        </div>
    );
}

export default CEDHTournamentStatsOld;