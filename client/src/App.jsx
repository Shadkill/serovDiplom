import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthorizationPage from './pages/authorization/AuthorizationPage';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import NewsPage from './pages/NewsPage/NewsPage';
import ChatListPage from './pages/ChatListPage/ChatListPage';
import FriendsListPage from './pages/FriendsListPage/FriendsListPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import './App.css'
import AuthCode from './pages/authorization/authCode';
import { Toaster } from 'react-hot-toast';
import RegistrationPage from './pages/authorization/RegistrationPage';
import RegisterCode from './pages/authorization/registerCode';
import Profile from './pages/profilePage/profile';
import AdminPanel from './pages/admin/adminPanel';
import Channels from './pages/channels/Channels';

function App() {
    return (
        <>
        <BrowserRouter>
       
            <div className="app">
                <Routes>
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/messenger" element={<ChatListPage />} />
                    <Route path="/messenger/:chatId" element={<ChatListPage />} />
                    <Route path="/friends" element={<FriendsListPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/" element={<AuthorizationPage/>} />
                    <Route path="/authCode" element={<AuthCode/>} />
                    <Route path="/register" element={<RegistrationPage/>} />
                    <Route path="/registerCode" element={<RegisterCode/>} />
                    <Route path="/:login" element={<Profile/>} />
                    <Route path="/admin_panel" element={<AdminPanel/>} />
                    <Route path="/channels" element={<Channels/>} />

                </Routes>
            
            </div>
            
        </BrowserRouter>
<Toaster/>
        </>
    );
}

export default App;