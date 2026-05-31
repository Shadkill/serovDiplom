import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import defaultAvatarImage from '../../assets/images/default-avatar.png';
import SearchIcon from '../../assets/icons/search.svg';
import MessengerIcon from '../../assets/icons/messenger.svg';
import DeleteIcon from '../../assets/icons/delete.svg';
import AcceptIcon from '../../assets/icons/accept.svg';
import RejectIcon from '../../assets/icons/cross.svg';

// Импорт тестовых данных
import { getUserFriends, chats, getUserFriendRequests, } from '../../mockData/testData';

import styles from './FriendsListPage.module.css';
import Home from '../Home/Home';
import Header from '../../components/Header/Header';
import toast from 'react-hot-toast';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
   
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h4 className={styles.modalTitle}>Удалить из друзей?</h4>
                <div className={styles.modalActions}>
                    <button
                        className={`${styles.modalButton} ${styles.confirmButton}`}
                        onClick={onConfirm}
                    >
                        Да
                    </button>
                    <button
                        className={`${styles.modalButton} ${styles.cancelButton}`}
                        onClick={onClose}
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

const FriendsListPage = () => {
    const navigate = useNavigate();
    const [chats,setChats] = useState([]);
    const [user, setUser] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const getUser = async()=>{  
        try {
          const response = await fetch('http://localhost:5000/api/getUser',{
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const userData = await response.json();
          setUser(userData);
          
        } catch (error) {
          console.error(error);
        }
      }
    useEffect(()=>{
        const getChat = async()=>{
            const token = localStorage.getItem('token');
            console.log(token);
            try {
                const response = await fetch('http://localhost:5000/api/chats', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setChats(data);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        }
        getChat();
        getUser();
    },[]);
    

    const [activeTab, setActiveTab] = useState('friends');

    // Обработчик для перехода к чату
    const handleMessageClick = (friendId) => {
        // Находим существующий чат между текущим пользователем и другом
        const existingChat = chats.find(chat =>
            chat.participants.some(participant => participant._id.toString() === user._id.toString()) &&
            chat.participants.some(participant => participant._id.toString() === friendId.toString())
        );
        
        if (existingChat) {
            // Если чат существует, переходим к нему
            navigate(`/messenger/${existingChat._id}`);
        } else {
            // Если чат не найден, выводим сообщение или обрабатываем ситуации
            toast.error("Чат не найден. Пожалуйста, проверьте друзей.");
        }
    };

    // Получаем друзей из тестовых данных
    const [friends, setFriends] = useState([]);

    useEffect(()=>{
    
       
        userFriends();
    },[])
    const userFriends = async(searchQuery)=>{
            try {
                setIsSearching(true);
                const response = await fetch(`http://localhost:5000/api/friends${searchQuery ? `?search=${searchQuery}` : ''}`,{
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setFriends(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsSearching(false);
            }
        }
    
    const filteredFriends = friends.filter(friend =>
        `${friend.name} ${friend.surname}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    // Состояние для модального окна
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        friendId: null
    });

    // Обработчик удаления
    const handleDeleteFriend = (id) => {
        setDeleteModal({ isOpen: true, friendId: id });
    };

    // Обработчик подтверждения удаления
    const confirmDelete = async() => {
        
        try {
            const response = await fetch(`http://localhost:5000/api/deleteFriend/${deleteModal.friendId}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }

            })
            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message);
                return;
            }
            const data = await response.json();
            
            toast.success(data.message);
            setDeleteModal({ isOpen: false, friendId: null });
        } catch (error) {
            console.error(error);
        }
        
    };

    const renderFriendsList = () => {
        if (friends.length === 0) {
            return (
                <div className={styles.emptyState}>
                    У вас пока нет друзей
                </div>
            );
        }

        if (filteredFriends.length === 0) {
            return (
                <div className={styles.emptyState}>
                    По вашему запросу ничего не найдено
                </div>
            );
        }

        return (
            <> 
            
            
           
          
                {filteredFriends.map((friend) => (
                    <div key={friend._id} className={styles.friendItem}>
                        <div className={styles.friendInfo}>
                        <Link to={`/${friend.login}`}>
                            <img
                                src={`http://localhost:5000/${friend.avatar}`}
                                alt="Profile"
                                className={styles.friendAvatar}
                                onError={(e) => {
                                    e.target.src = defaultAvatarImage;
                                }}
                            />
                            </Link>
                            <div className={styles.friendDetails}>
                                <div className={styles.friendName}>
                                    <span>{friend.name}</span>
                                    <span>{friend.surname}</span>
                                </div>
                                {/* Обновляем div для перехода к чату */}
                                <div
                                    className={styles.messageLink}
                                    onClick={() => handleMessageClick(friend._id)}
                                >
                                    <img
                                        src={MessengerIcon}
                                        alt="Message"
                                        className={styles.messageIcon}
                                    />
                                    <span>Написать сообщение</span>
                                </div>
                            </div>
                        </div>
                        <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteFriend(friend._id)}
                        >
                            <img
                                src={DeleteIcon}
                                alt="Delete"
                                className={styles.deleteIcon}
                            />
                        </button>
                    </div>
                ))}
            </>
        );
    };

    // Добавляем состояние для заявок в друзья
    const [friendRequests, setFriendRequests] = useState([]);
    useEffect(()=>{
        const getFriendRequests = async()=>{
            try {
                const response = await fetch('http://localhost:5000/api/usersRequests',{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ localStorage.getItem('token')}`
                    }
                })
                if (!response.ok) {
                    throw new Error('Error fetching friend requests');
                }
                const data = await response.json();
                setFriendRequests(data);
            } catch (error) {
                console.error(error);
            }
        }
        getFriendRequests();
    },[])

    // ... существующий код для фильтрации друзей и обработки сообщений ...

    // Обработчики для заявок в друзья
    const handleAcceptRequest = async(id) => {
       try {
        const response = await fetch(`http://localhost:5000/api/addFriendUser/${id}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            const data = await response.json();
            toast.error(data.message);
            return;
        }
        const data = await response.json();
        setFriends(prev => [...prev, data]);
        setFriendRequests(prev => prev.filter(req => req._id !== id));
        toast.success(data.message);
       } catch (error) {
        console.error(error);
       }
        
    };

    const handleRejectRequest = async(requestId) => {
        try {
            const response =await fetch(`http://localhost:5000/api/refusalFriend/${requestId}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message);
                return;
            }
            const data = await response.json();
            toast.success(data.message);
            setFriendRequests(prev => prev.filter(req => req._id!== requestId));
        } catch (error) {
            console.error(error);
        }
        
    };

    const renderFriendRequests = () => {
        if (friendRequests.length === 0) {
            return (
                <div className={styles.emptyState}>
                    У вас нет заявок в друзья
                </div>
            );
        }
    
        return (
            <>
            
            <div className={styles.friendsList}>
                {friendRequests.map((request) => (
                    <div key={request._id} className={styles.friendItem}>
                        <div className={styles.friendInfo}>
                            <img
                                src={`http://localhost:5000/${request.avatar}` || defaultAvatarImage}
                                alt="Profile"
                                className={styles.friendAvatar}
                                onError={(e) => {
                                    e.target.src = defaultAvatarImage;
                                }}
                            />
                            <div className={styles.friendDetails}>
                                <div className={styles.friendName}>
                                    <span>{request.name}</span>
                                    <span>{request.surname}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.requestActions}>
                            <button
                                className={`${styles.actionButton} ${styles.acceptButton}`}
                                onClick={() => handleAcceptRequest(request._id)}
                            >
                                <img
                                    src={AcceptIcon}
                                    alt="Accept"
                                    className={styles.actionIcon}
                                />
                            </button>
                            <button
                                className={`${styles.actionButton} ${styles.rejectButton}`}
                                onClick={() => handleRejectRequest(request._id)}
                            >
                                <img
                                    src={RejectIcon}
                                    alt="Reject"
                                    className={styles.actionIcon}
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div> 
            </>
        );
    };

    return (
        <>
        <Header/>
        <main className="home-container">
                <Home/>
                <div className="content-container">
        <div className={styles.friendsPageContainer}>
            <div className={styles.tabsContainer}>
                <button
                    className={`${styles.tab} ${activeTab === 'friends' ? styles.active : ''}`}
                    onClick={() => setActiveTab('friends')}
                >
                    Друзья
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'requests' ? styles.active : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Заявки
                </button>
            </div>

            {activeTab === 'friends' ? (
                <>
                    <div className={styles.searchContainer}>
                        <div className={styles.searchInputWrapper}>
                            <input
                                type="text"
                                placeholder="Поиск друзей"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                            <img
                                src={SearchIcon}
                                alt="Search"
                                className={styles.searchIcon}
                            />
                        </div>
                    </div>
                    <div className={styles.friendsList}>
                        {renderFriendsList()}
                    </div>
                </>
            ) : (
                renderFriendRequests()
            )}

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, friendId: null })}
                onConfirm={confirmDelete}
            />
        </div>
        </div>
        </main>
        </>
    );
};

export default FriendsListPage;