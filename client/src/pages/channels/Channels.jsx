
// import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import defaultAvatarImage from '../../assets/images/default-avatar.png';
// import styles from '../ChatListPage/ChatListPage.module.css';
// import Header from '../../components/Header/Header';
// import Home from '../Home/Home';
// import io from 'socket.io-client';
// import toast from 'react-hot-toast';

// const socket = io('http://localhost:5000');

// const MessageStatusIcon = ({ status }) => {
//     switch (status) {
//         case 'Отправлено':
//             return <svg width="20" height="20" fill="none"><path d="M4 10L8 14L16 6" stroke="#BEBBBB" strokeWidth="2" /><path d="M2 10L6 14L14 6" stroke="#BEBBBB" strokeWidth="2" /></svg>;
//         case 'Получено':
//             return <svg width="20" height="20" fill="none"><path d="M4 10L8 14L16 6" stroke="#AEE1FF" strokeWidth="2" /><path d="M2 10L6 14L14 6" stroke="#AEE1FF" strokeWidth="2" /></svg>;
//         case 'Новое сообщение':
//             return <div className={styles.newMessageIndicator}><span>!</span></div>;
//         case 'Прочитано':
//             return null;
//         default:
//             return null;
//     }
// };

// const SendIcon = () => (
//     <svg width="30" height="30" fill="none"><path d="M27.5 2.5L13.75 16.25" stroke="#AEE1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M27.5 2.5L18.75 27.5L13.75 16.25L2.5 11.25L27.5 2.5Z" stroke="#AEE1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
// );

// const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
//     if (!isOpen) return null;

//     return (
//         <div className={styles.modalOverlay} onClick={onClose}>
//             <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//                 <h4 className={styles.modalTitle}>Удалить сообщение?</h4>
//                 <div className={styles.modalActions}>
//                     <button className={`${styles.modalButton} ${styles.confirmButton}`} onClick={onConfirm}>Да</button>
//                     <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={onClose}>Отмена</button>
//                 </div>
//             </div>
//         </div>
//     );
// };
// const Channels = () => {
//     const [processedChats, setProcessedChats] = useState([]);
//     const [selectedChat, setSelectedChat] = useState(null);
//     const [newMessage, setNewMessage] = useState('');
//     const [deleteModal, setDeleteModal] = useState({ isOpen: false, messageId: null });
//     const [messages, setMessages] = useState([]);
//     const { chatId } = useParams();
//     const [user, setUser] = useState([]);
//     const [newMessagesCount, setNewMessagesCount] = useState({});

//     const fetchChats = async () => {
//         const token = localStorage.getItem('token');

//         try {
//             const response = await fetch('http://localhost:5000/api/chats', {
//                 method: 'GET',
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });

//             if (!response.ok) {
//                 throw new Error(`Ошибка получения чатов: ${response.status}`);
//             }

//             const data = await response.json();
//             setProcessedChats(data);

//             if (chatId) {
//                 const targetChat = data.find(chat => chat.id === parseInt(chatId));
//                 if (targetChat) {
//                     setSelectedChat(targetChat);
//                     await fetchMessages(targetChat._id);
//                 }
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         socket.connect();
//         return () => socket.disconnect();
//     }, []);

//     useEffect(() => {
//         if (selectedChat?._id) {
//             socket.emit('joinChat', selectedChat._id);
//             fetchMessages(selectedChat._id);
//         }

//         return () => {
//             if (selectedChat?._id) {
//                 socket.emit('leaveChat', selectedChat._id);
//             }
//         };
//     }, [selectedChat]);

//     useEffect(() => {
//         socket.on('receivedMessage', (message) => {
//             setMessages(prev => [...prev, message]);

//             // Увеличиваем счетчик новых сообщений для соответствующего чата
//             setNewMessagesCount(prev => ({
//                 ...prev,
//                 [message.chatId]: (prev[message.chatId] || 0) + 1,
//             }));
            
//             // Обновляем статус чата на "Новое сообщение"
//             setProcessedChats(prevChats => 
//                 prevChats.map(chat => 
//                     chat._id === message.chatId 
//                     ? { ...chat, messageStatus: 'Новое сообщение' } 
//                     : chat
//                 )
//             );
//         });

//         return () => {
//             socket.off('receivedMessage');
//         };
//     }, []);

//     const fetchMessages = async (chatId) => {
//         const token = localStorage.getItem('token');

//         try {
//             const response = await fetch(`http://localhost:5000/api/chatMessages/${chatId}`, {
//                 method: 'GET',
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });

//             if (!response.ok) {
//                 throw new Error(`Ошибка получения сообщений: ${response.status}`);
//             }

//             const data = await response.json();
//             setMessages(data);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const getUser = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/api/getUser', {
//                 method: 'GET',
//                 headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//             });

//             if (!response.ok) {
//                 throw new Error(`Ошибка! статус: ${response.status}`);
//             }

//             const userData = await response.json();
//             setUser(userData);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         getUser();
//         fetchChats();
//     }, []);

//     const handleSendMessage = (e) => {
//         e.preventDefault();
//         if (!newMessage.trim() || !selectedChat) return;

//         const messageData = {
//             chatId: selectedChat._id,
//             senderId: user._id,
//             content: newMessage.trim(),
//             timestamp: new Date().toLocaleString('ru-RU', {
//                 day: '2-digit',
//                 month: '2-digit',
//                 year: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 second: '2-digit',
//                 hour12: false // 24-часовой формат
//             }),
//             isOwn: true,
//             isRead: false
//         };

//         // Отправляем сообщение на сервер
//         socket.emit('sendMessage', messageData);

//         // Добавляем сообщение в локальное состояние
//         setMessages(prevMessages => [...prevMessages, messageData]);
//         setNewMessage('');
//     };

//     const handleDeleteMessage = (messageId) => {
//         setDeleteModal({ isOpen: true, messageId });
//     };

//     const confirmDelete = async() => {
//         try {
//           const messageId = deleteModal.messageId;
//         // Emit socket event for message deletion
//         socket.emit('deleteMessage', {
//             messageId,
//             chatId: selectedChat._id
//         });
        
//         // Remove message from local state
//         setMessages(prevMessages => 
//             prevMessages.filter(message => message._id !== messageId)
//         );
//     } catch (error) {
//         console.error('Error deleting message:', error);
//     }

       

//         setMessages(prevMessages => prevMessages.filter(msg => msg.id !== deleteModal.messageId));
//         setDeleteModal({ isOpen: false, messageId: null });
//     };
//     useEffect(() => {
//       // Existing socket listeners...
  
//       socket.on('messageDeleted', ({ messageId }) => {
//           setMessages(prevMessages => 
//               prevMessages.filter(message => message._id !== messageId)
//           );
//       });
  
//       return () => {
//           socket.off('messageDeleted');
//           // Other socket.off cleanup...
//       };
//   }, []);
//     const markAsRead = () => {
//         if (selectedChat) {
//             socket.emit('readMessages', { chatId: selectedChat._id, userId: user._id });

//             // Изменяем статус прочтения у сообщений в локальном состоянии
//             setMessages(prevMessages =>
//                 prevMessages.map(msg => ({
//                     ...msg,
//                     isRead: true
//                 }))
//             );

//             setNewMessagesCount(prev => ({
//                 ...prev,
//                 [selectedChat._id]: 0 // Сбрасываем счетчик новых сообщений
//             }));

//             // Обновляем статус чата на "Прочитано"
//             setProcessedChats(prevChats =>
//                 prevChats.map(chat =>
//                     chat._id === selectedChat._id
//                         ? { ...chat, messageStatus: 'Прочитано' }
//                         : chat
//                 )
//             );
//         }
//     };

//     return (
//         <>
//             <Header/>
//             <main className="home-container">
//                 <Home />
//                 <div className="content-container">
//                     <div className={styles.chatListPage}>
//                         <div className={styles.chatListContainer}>
//                             <div className={styles.chatListHeader}>Чаты</div>
//                             <div className={styles.chatList}>
//                                 {Array.isArray(processedChats) && processedChats.map(chat => (
//                                     <div
//                                         key={chat._id}
//                                         className={`${styles.chatItem} ${selectedChat?._id === chat._id ? styles.selected : ''}`}
//                                         onClick={() => {
//                                             setSelectedChat(chat);
//                                             markAsRead(); // Отметить сообщения как прочитанные при выборе чата
//                                         }}
//                                     >
//                                         <div className={styles.chatAvatar}>
//                                             <img
//                                                 src={chat.participants[0]._id === user._id ? `http://localhost:5000/${chat.participants[1].avatar}` : `http://localhost:5000/${chat.participants[0].avatar}`}
//                                                 alt="Avatar"
//                                                 onError={(e) => { e.target.src = defaultAvatarImage; }}
//                                             />
//                                         </div>
//                                         <div className={styles.chatInfo}>
//                                             <div className={styles.chatName}>
//                                                 <span>{chat.participants[0]._id === user._id ? `${chat.participants[1].name} ${chat.participants[1].surname}` : `${chat.participants[0].name} ${chat.participants[0].surname}`}</span>
//                                             </div>
//                                             <div className={styles.messageStatusText}>
//                                                 {newMessagesCount[chat._id] ? `${newMessagesCount[chat._id]} новых сообщений` : chat.messageStatus}
//                                             </div>
//                                         </div>
//                                         <div className={styles.messageStatusIcon}>
//                                             <MessageStatusIcon status={chat.messageStatus} />
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Подробности чата */}
//                         <div className={styles.chatDetails}>
//                             {selectedChat ? (
//                                 <>
//                                     <div className={styles.chatHeader}>
//                                       <Link to={selectedChat.participants[0]._id === user._id ? `/${selectedChat.participants[1].login}`:`/${selectedChat.participants[0].login}`}>
//                                         <img
//                                             src={selectedChat.participants[0]._id === user._id ? `http://localhost:5000/${selectedChat.participants[1].avatar}` : `http://localhost:5000/${selectedChat.participants[0].avatar}`}
//                                             alt="Profile"
//                                             className={styles.chatProfileImage}
//                                             onError={(e) => { e.target.src = defaultAvatarImage; }}
//                                         />
//                                         </Link>
//                                         <div className={styles.chatProfileName}>
//                                             <span>{selectedChat.participants[0]._id === user._id ? selectedChat.participants[1].name : selectedChat.participants[0].name}</span>
//                                             <span>{selectedChat.participants[0]._id === user._id ? selectedChat.participants[1].surname : selectedChat.participants[0].surname}</span>
//                                         </div>
//                                     </div>

//                                     <div className={styles.chatMessagesContainer}>
//                                         <div className={styles.messagesList}>
//                                             {Array.isArray(messages) && messages.map(message => (
//                                                 <div
//                                                     key={message._id}
//                                                     className={`${styles.message} ${message.senderId === user._id ? styles.own : styles.other}`}
//                                                 >
//                                                     <div className={styles.messageContent}>
//                                                         <p>{message.content}</p>
//                                                         <div className={styles.messageInfo}>
//                                                             <span className={styles.messageTime}>{new Date(message.timestamp).toLocaleString('ru-RU', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   })}</span>
//                                                             {message.senderId === user._id && (
//                                                                 <>
//                                                                     <span className={styles.messageStatus}>
//                                                                         {message.isRead ? 'Прочитано' : 'Отправлено'}
//                                                                     </span>
//                                                                     <button
//                                                                         className={styles.deleteMessage}
//                                                                         onClick={() => handleDeleteMessage(message._id)}
//                                                                     >
//                                                                         ×
//                                                                     </button>
//                                                                 </>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                         <form onSubmit={handleSendMessage} className={styles.messageInputContainer}>
//                                             <input
//                                                 type="text"
//                                                 value={newMessage}
//                                                 onChange={e => setNewMessage(e.target.value)}
//                                                 placeholder="Введите сообщение..."
//                                                 className={styles.messageInput}
//                                             />
//                                             <button type="submit" className={styles.sendButton}>
//                                                 <SendIcon />
//                                             </button>
//                                         </form>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <div className={styles.noChatSelected}>Выберите чат для просмотра</div>
//                             )}
//                         </div>

                        
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }

// export default Channels;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import defaultAvatarImage from '../../assets/images/default-avatar.png';
import styles from '../ChatListPage/ChatListPage.module.css';
import Header from '../../components/Header/Header';
import Home from '../Home/Home';

// Простая иконка отправки поста
const SendIcon = () => (
    <svg width="30" height="30" fill="none">
        <path d="M27.5 2.5L13.75 16.25" stroke="#AEE1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M27.5 2.5L18.75 27.5L13.75 16.25L2.5 11.25L27.5 2.5Z" stroke="#AEE1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Channels = () => {
    // Храним разделенные каналы напрямую в стейтах
    const [ownedChannels, setOwnedChannels] = useState([]);  // Каналы, где юзер — админ
    const [joinedChannels, setJoinedChannels] = useState([]); // Каналы, где юзер — подписчик
    
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    
    const token = localStorage.getItem('token');

    // 1. Получаем текущего юзера
    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/getUser', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                return userData; // Возвращаем, чтобы сразу отфильтровать при первой загрузке
            }
        } catch (error) {
            console.error('Ошибка получения юзера:', error);
        }
        return null;
    };

    // 2. Получаем все каналы и делим их на "Мои" и "Подписки"
    const fetchChannels = async (currentUser) => {
        const activeUser = currentUser || user;
        if (!activeUser) return;

        try {
            const response = await fetch('http://localhost:5000/api/channels', { 
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Ошибка получения каналов');
            
            const allChannels = await response.json();

            // Фильтруем без лишних объектов на лету
            const owned = allChannels.filter(channel => channel.ownerId === activeUser._id);
            const joined = allChannels.filter(channel => channel.ownerId !== activeUser._id);

            setOwnedChannels(owned);
            setJoinedChannels(joined);

            // Обновляем состояние текущего выбранного канала, если он открыт
            if (selectedChannel) {
                const updated = allChannels.find(c => c._id === selectedChannel._id);
                if (updated) setSelectedChannel(updated);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 3. Получаем посты/сообщения канала
    const fetchMessages = async (channelId) => {
        if (!channelId) return;
        try {
            const response = await fetch(`http://localhost:5000/api/channelMessages/${channelId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Первичный запуск
    useEffect(() => {
        const init = async () => {
            const loggedInUser = await fetchUser();
            if (loggedInUser) {
                await fetchChannels(loggedInUser);
            }
        };
        init();
    }, []);

    // Работа по таймеру: раз в 10 секунд запрашиваем обновления
    useEffect(() => {
        const interval = setInterval(() => {
            fetchChannels();
            if (selectedChannel?._id) {
                fetchMessages(selectedChannel._id);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [selectedChannel, user]);

    // Выбор канала и сброс уведомлений
    const handleSelectChannel = async (channel) => {
        setSelectedChannel(channel);
        fetchMessages(channel._id);

        try {
            await fetch(`http://localhost:5000/api/markChannelAsRead/${channel._id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchChannels();
        } catch (error) {
            console.error(error);
        }
    };

    // Создание нового поста в канал
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChannel || !user) return;

        try {
            const response = await fetch('http://localhost:5000/api/sendPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    channelId: selectedChannel._id,
                    senderId: user._id,
                    content: newMessage.trim(),
                })
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages(selectedChannel._id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Header />
            <main className="home-container">
                <Home />
                <div className="content-container">
                    <div className={styles.chatListPage}>
                        
                        {/* ЛЕВАЯ ПАНЕЛЬ: СПИСКИ КАНАЛОВ */}
                        <div className={styles.chatListContainer}>
                            
                            {/* СЕКЦИЯ 1: Я ВЛАДЕЛЕЦ */}
                            <div className={styles.chatListHeader} style={{ fontSize: '14px', color: '#AEE1FF' }}>
                                Моё управление ({ownedChannels.length})
                            </div>
                            <div className={styles.chatList} style={{ marginBottom: '20px', maxHeight: '40%' }}>
                                {ownedChannels.map(channel => (
                                    <div
                                        key={channel._id}
                                        className={`${styles.chatItem} ${selectedChannel?._id === channel._id ? styles.selected : ''}`}
                                        onClick={() => handleSelectChannel(channel)}
                                    >
                                        <div className={styles.chatAvatar}>
                                            <img src={channel.avatar ? `http://localhost:5000/${channel.avatar}` : defaultAvatarImage} alt="💡" />
                                        </div>
                                        <div className={styles.chatInfo}>
                                            <div className={styles.chatName}><span>{channel.name}</span></div>
                                            <div className={styles.messageStatusText}>Вы владелец</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* СЕКЦИЯ 2: Я ПОДПИСЧИК */}
                            <div className={styles.chatListHeader} style={{ fontSize: '14px', color: '#BEBBBB' }}>
                                Мои подписки ({joinedChannels.length})
                            </div>
                            <div className={styles.chatList} style={{ maxHeight: '50%' }}>
                                {joinedChannels.map(channel => (
                                    <div
                                        key={channel._id}
                                        className={`${styles.chatItem} ${selectedChannel?._id === channel._id ? styles.selected : ''}`}
                                        onClick={() => handleSelectChannel(channel)}
                                    >
                                        <div className={styles.chatAvatar}>
                                            <img src={channel.avatar ? `http://localhost:5000/${channel.avatar}` : defaultAvatarImage} alt="📢" />
                                        </div>
                                        <div className={styles.chatInfo}>
                                            <div className={styles.chatName}><span>{channel.name}</span></div>
                                            <div className={styles.messageStatusText}>
                                                {channel.unreadCount > 0 ? `${channel.unreadCount} новых постов` : 'Нет новых постов'}
                                            </div>
                                        </div>
                                        {channel.unreadCount > 0 && (
                                            <div className={styles.newMessageIndicator}><span>!</span></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* ПРАВАЯ ПАНЕЛЬ: ПОСТЫ В ВЫБРАННОМ КАНАЛЕ */}
                        <div className={styles.chatDetails}>
                            {selectedChannel ? (
                                <>
                                    <div className={styles.chatHeader}>
                                        <div className={styles.chatProfileName}>
                                            <span style={{ fontWeight: 'bold' }}>{selectedChannel.name}</span>
                                            <span style={{ fontSize: '12px', opacity: 0.6, marginLeft: '10px' }}>
                                                {selectedChannel.ownerId === user?._id ? 'Администрирование' : 'Режим чтения'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.chatMessagesContainer}>
                                        <div className={styles.messagesList}>
                                            {messages.map(message => (
                                                <div key={message._id} className={`${styles.message} ${styles.other}`}>
                                                    <div className={styles.messageContent}>
                                                        <p>{message.content}</p>
                                                        <div className={styles.messageInfo}>
                                                            <span className={styles.messageTime}>
                                                                {new Date(message.timestamp).toLocaleString('ru-RU', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Писать в канал может ТОЛЬКО его владелец */}
                                        {selectedChannel.ownerId === user?._id ? (
                                            <form onSubmit={handleSendMessage} className={styles.messageInputContainer}>
                                                <input
                                                    type="text"
                                                    value={newMessage}
                                                    onChange={e => setNewMessage(e.target.value)}
                                                    placeholder="Опубликовать новый пост в канал..."
                                                    className={styles.messageInput}
                                                />
                                                <button type="submit" className={styles.sendButton}>
                                                    <SendIcon />
                                                </button>
                                            </form>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '15px', color: '#666' }}>
                                                У вас включен режим чтения. Только автор может оставлять посты.
                                            </div>
                                        )}
                                    </div>
                                </>
                             ) : (
                                <div className={styles.noChatSelected}>Выберите канал из списка слева</div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
};

export default Channels;