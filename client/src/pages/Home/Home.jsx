// import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
// import HomeIcon from '../../assets/icons/home.svg';
// import MessengerIcon from '../../assets/icons/messenger.svg';
// import FriendsIcon from '../../assets/icons/friends.svg';
// import AdminIcon from '../../assets/icons/admin.svg';
// import NewsPage from '../NewsPage/NewsPage';
// import ChatListPage from '../ChatListPage/ChatListPage';
// import FriendsListPage from '../FriendsListPage/FriendsListPage';

// import AdminPanel from '../admin/adminPanel';

// import './Home.css';
// import Channels from '../channels/Channels';

// const NAVIGATION_ITEMS = [
//     {
//         id: 'main',
//         title: 'Общий канал',
//         icon: HomeIcon,
//         path: '/news',
//         component: NewsPage
//     },
//     {
//         id: 'messenger',
//         title: 'Мессенджер',
//         icon: MessengerIcon,
//         path: '/messenger',
//         component: ChatListPage
//     },
//     {
//         id: 'friends',
//         title: 'Друзья',
//         icon: FriendsIcon,
//         path: '/friends',
//         component: FriendsListPage
//     },
//     {
//         id: 'Channels',
//         title: 'Мои каналы',
//         icon: FriendsIcon,
//         path: '/channels',
//         component: Channels
//     },

// ];
// const NAVIGATION_ITEMS1 = [
//     {
//         id: 'main',
//         title: 'Главная',
//         icon: HomeIcon,
//         path: '/news',
//         component: NewsPage
//     },
//     {
//         id: 'messenger',
//         title: 'Мессенджер',
//         icon: MessengerIcon,
//         path: '/messenger',
//         component: ChatListPage
//     },
//     {
//         id: 'friends',
//         title: 'Друзья',
//         icon: FriendsIcon,
//         path: '/friends',
//         component: FriendsListPage
//     },
     
//     {
//         id: 'panelAdmin',
//         title: 'Админ Панель',
//         icon: AdminIcon,
//         path: '/admin_panel',
//         component: AdminPanel
//     },
//     {
//         id: 'Channels',
//         title: 'Мои каналы',
//         icon: FriendsIcon,
//         path: '/channels',
//         component: Channels
//     },

// ];

// function Home() {
//     const role = localStorage.getItem('role');
//     const location = useLocation();

//     return (
//         role === 'admin'?
//             <div className="navigation-container">
//                 {NAVIGATION_ITEMS1.map(item => (
//                     <NavLink
//                         key={item.id}
//                         to={item.path}
//                         className={({ isActive }) =>
//                             `nav-item ${isActive ? 'active' : ''}`
//                         }
//                     >
//                         <img
//                             src={item.icon}
//                             alt={item.title}
//                             className="nav-icon"
//                         />
//                         <span className="nav-text">{item.title}</span>
//                     </NavLink>
//                 ))}
//             </div>
//             :
//             <div className="navigation-container">
//             {NAVIGATION_ITEMS.map(item => (
//                 <NavLink
//                     key={item.id}
//                     to={item.path}
//                     className={({ isActive }) =>
//                         `nav-item ${isActive ? 'active' : ''}`
//                     }
//                 >
//                     <img
//                         src={item.icon}
//                         alt={item.title}
//                         className="nav-icon"
//                     />
//                     <span className="nav-text">{item.title}</span>
//                 </NavLink>
//             ))}
//         </div>
        
//     );
// }

// export default Home;

import { NavLink } from 'react-router-dom';
import HomeIcon from '../../assets/icons/home.svg';
import MessengerIcon from '../../assets/icons/messenger.svg';
import FriendsIcon from '../../assets/icons/friends.svg';
import AdminIcon from '../../assets/icons/admin.svg';

import './Home.css';

function Home() {
    const role = localStorage.getItem('role');

    // Функция, чтобы не дублировать классы у ссылок
    const getLinkClass = ({ isActive }) => `nav-item ${isActive ? 'active' : ''}`;

    return (
        <div className="navigation-container">
            {/* Эти ссылки видят вообще все */}
            <NavLink to="/news" className={getLinkClass}>
                <img src={HomeIcon} alt="Общий канал" className="nav-icon" />
                <span className="nav-text">Общий канал</span>
            </NavLink>

            <NavLink to="/messenger" className={getLinkClass}>
                <img src={MessengerIcon} alt="Мессенджер" className="nav-icon" />
                <span className="nav-text">Мессенджер</span>
            </NavLink>

            <NavLink to="/friends" className={getLinkClass}>
                <img src={FriendsIcon} alt="Друзья" className="nav-icon" />
                <span className="nav-text">Друзья</span>
            </NavLink>

            <NavLink to="/channels" className={getLinkClass}>
                <img src={FriendsIcon} alt="Мои каналы" className="nav-icon" />
                <span className="nav-text">Мои каналы</span>
            </NavLink>

            {/* А эту ссылку рендерим только если юзер — админ */}
            {role === 'admin' && (
                <NavLink to="/admin_panel" className={getLinkClass}>
                    <img src={AdminIcon} alt="Админ Панель" className="nav-icon" />
                    <span className="nav-text">Админ Панель</span>
                </NavLink>
            )}
        </div>
    );
}

export default Home;