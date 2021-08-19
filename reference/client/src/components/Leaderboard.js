import React, { useState, useEffect } from 'react';

import '../sass/DashboardUsers.scss';
// import '../sass/EventsContainer-media-queries.scss';

const Leaderboard = (props) => {
    // const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState(null);
    const [checkIns, setCheckIns] = useState(null);
    // const [isError, setIsError] = useState(false);
    const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

    async function fetchUsers() {

        try {
            const users = await fetch('/api/users', {
                headers: {
                    "Content-Type": "application/json",
                    "x-customrequired-header": headerToSend
                }
            });
            const resJson = await users.json();

            setUsers(resJson);
        } catch(error) {
            alert(error);
        }
    };

    async function fetchCheckIns() {
        try {
            const checkIns = await fetch('/api/checkins', {
                headers: {
                    "x-customrequired-header": headerToSend
                }
            });
            const checkInsJson = await checkIns.json();

            setCheckIns(checkInsJson);
        } catch (error) {
            console.log(error);
        }
    };

    function getLeaders(checkInsArray) {
        if (checkInsArray && checkInsArray !== null) {
            const tracker = {};


        };
    };

    useEffect(() => {
        fetchUsers();
        fetchCheckIns();

    }, []);

    return (
        <div className="flexcenter-container">
            <div className="dashboard-header">
                <p className="dashboard-header-text-large">Volunteer Leaderboard</p>

                {/* <form className="form-stats" autoComplete="off" onSubmit={e => e.preventDefault()}>
                    <div className="stats-form-row">
                        <div className="stats-form-input-text">
                            <div className="stat-select">
                                <label htmlFor="whichBrigade">Location:</label>
                                <select 
                                    name="whichBrigade"
                                    value={brigade}
                                    // aria-label="topic"
                                    onChange={handleBrigadeChange}
                                    required
                                >
                                {brigadeSelection.map((brigade, index) => {
                                    return <option key={index} value={brigade}>{brigade}</option>
                                })} 
                                </select>
                            </div>
                        </div>
                    </div>
                </form> */}
            </div>
            <div className="events-list">
                <ul>
                    {users !== null && users !== undefined && users.map((user, index) => {
                        return <li key={index}>
                            <div key={index} className="event">
                                <div className="user-name">
                                    <h5>{user.name.firstName} {user.name.lastName.slice(0, 1)}.</h5>
                                </div>
                                <div className="user-roles">
                                    <p>Current Role:</p>
                                    <p>Desired Role:</p>
                                </div>
                            </div>
                        </li>
                    })}
                </ul>
            </div>
        </div>
    )
};

export default Leaderboard;
    