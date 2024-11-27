import React, { useState, useEffect } from 'react';

const DApp = () => {
    const [sampleDApps, setSampleDApps] = useState([]);
    const [selectedDApp, setSelectedDApp] = useState(null); // Used to track the selected DApp

    useEffect(() => {
        // Fetch or generate a list of sample DApps
        const fetchDApps = async () => {
            // Simulating API fetch
            const dApps = [
                { id: 1, name: 'DApp 1' },
                { id: 2, name: 'DApp 2' },
                { id: 3, name: 'DApp 3' },
            ];
            setSampleDApps(dApps);
        };

        fetchDApps();
    }, []); // Dependency array left empty because sampleDApps is set inside this effect

    const handleSelectDApp = (dApp) => {
        setSelectedDApp(dApp); // Store the selected DApp
    };

    return (
        <div>
            <h2>Available DApps</h2>
            <ul>
                {sampleDApps.map((dApp) => (
                    <li key={dApp.id} onClick={() => handleSelectDApp(dApp)}>
                        {dApp.name}
                    </li>
                ))}
            </ul>

            {selectedDApp && (
                <div>
                    <h3>Selected DApp</h3>
                    <p>ID: {selectedDApp.id}</p>
                    <p>Name: {selectedDApp.name}</p>
                </div>
            )}
        </div>
    );
};

export default DApp;
