// Header.jsx
import React, { useEffect, useState } from 'react';
import SearchIcon from '../../assets/icons/search.svg';
import { Link } from 'react-router-dom';
import defaultAvatarImage from '../../assets/images/default-avatar.png';

import './Header.css';

function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async()=>{
            try {
                const response = await fetch('http://localhost:5000/api/getUser',{
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    const data = await response.json();
                    console.error(data.message);
                }
                const data = await response.json();
                setUser(data);

            } catch (error) {
                console.error(error);
            }
        }
        
        getUser();
    }, []);

    return (
        <header className="header">
            <div className="header-content">
                <div className="left-section">
                    <Link to="/" className="logo">Loop</Link>
                    <div className="search-container">
                        <span className="search-icon">
                            <img
                                src={SearchIcon}
                                alt="SearchIcon"
                                className="w-[50px] h-[40px]"
                            />
                        </span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Поиск"
                        />
                    </div>
                </div>
                <Link to="/profile" className="profile-icon">
                    <img
                        src={`http://localhost:5000/${user?.avatar}` || defaultAvatarImage}
                        alt="Profile"
                        onError={(e) => {
                            e.target.src = defaultAvatarImage;
                        }}
                    />
                </Link>
            </div>
        </header>
    );
}

export default Header;
