import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import HomeIcon from '../../assets/icons/home.svg';
import MessengerIcon from '../../assets/icons/messenger.svg';
import FriendsIcon from '../../assets/icons/friends.svg';
import AdminIcon from '../../assets/icons/admin.svg';
import NewsPage from '../NewsPage/NewsPage';
import ChatListPage from '../ChatListPage/ChatListPage';
import FriendsListPage from '../FriendsListPage/FriendsListPage';

import AdminPanel from '../admin/adminPanel';

import './Home.css';

const NAVIGATION_ITEMS = [
    {
        id: 'main',
        title: 'Общий канал',
        icon: HomeIcon,
        path: '/news',
        component: NewsPage
    },
    {
        id: 'messenger',
        title: 'Мессенджер',
        icon: MessengerIcon,
        path: '/messenger',
        component: ChatListPage
    },
    {
        id: 'friends',
        title: 'Друзья',
        icon: FriendsIcon,
        path: '/friends',
        component: FriendsListPage
    },
    {
        id: 'Channels',
        title: 'Мои каналы',
        icon: FriendsIcon,
        path: '/channels',
        component: FriendsListPage
    },

];
const NAVIGATION_ITEMS1 = [
    {
        id: 'main',
        title: 'Главная',
        icon: HomeIcon,
        path: '/news',
        component: NewsPage
    },
    {
        id: 'messenger',
        title: 'Мессенджер',
        icon: MessengerIcon,
        path: '/messenger',
        component: ChatListPage
    },
    {
        id: 'friends',
        title: 'Друзья',
        icon: FriendsIcon,
        path: '/friends',
        component: FriendsListPage
    },
     
    {
        id: 'panelAdmin',
        title: 'Админ Панель',
        icon: AdminIcon,
        path: '/admin_panel',
        component: AdminPanel
    },
    {
        id: 'Channels',
        title: 'Мои каналы',
        icon: FriendsIcon,
        path: '/channels',
        component: FriendsListPage
    },

];

function Home() {
    const role = localStorage.getItem('role');
    const location = useLocation();

    return (
        role === 'admin'?
            <div className="navigation-container">
                {NAVIGATION_ITEMS1.map(item => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <img
                            src={item.icon}
                            alt={item.title}
                            className="nav-icon"
                        />
                        <span className="nav-text">{item.title}</span>
                    </NavLink>
                ))}
            </div>
            :
            <div className="navigation-container">
            {NAVIGATION_ITEMS.map(item => (
                <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <img
                        src={item.icon}
                        alt={item.title}
                        className="nav-icon"
                    />
                    <span className="nav-text">{item.title}</span>
                </NavLink>
            ))}
        </div>
        
    );
}

export default Home;
