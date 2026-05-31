// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import defaultAvatarImage from '../../assets/images/default-avatar.png';
// import styles from './ChatListPage.module.css';
// import Header from '../../components/Header/Header';
// import Home from '../Home/Home';
// import io from 'socket.io-client';
// const socket = io('http://localhost:5000');
// // Иконки статусов сообщений
// const MessageStatusIcon = ({ status }) => {
//     switch (status) {
//         case 'Отправлено':
//             return (
//                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                     <path d="M4 10L8 14L16 6" stroke="#BEBBBB" strokeWidth="2" />
//                     <path d="M2 10L6 14L14 6" stroke="#BEBBBB" strokeWidth="2" />
//                 </svg>
//             );
//         case 'Получено':
//             return (
//                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                     <path d="M4 10L8 14L16 6" stroke="#AEE1FF" strokeWidth="2" />
//                     <path d="M2 10L6 14L14 6" stroke="#AEE1FF" strokeWidth="2" />
//                 </svg>
//             );
//         case 'Новое сообщение':
//             return <div className={styles.newMessageIndicator}><span>!</span></div>;
//         case 'Прочитано':
//             return null;
//         default:
//             return null;
//     }
// };

// const SendIcon = () => (
//     <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
//         <path d="M27.5 2.5L13.75 16.25" stroke="#AEE1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M27.5 2.5L18.75 27.5L13.75 16.25L2.5 11.25L27.5 2.5Z" stroke="#AEE1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
// );

// const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
//     if (!isOpen) return null;

//     return (
//         <div className={styles.modalOverlay} onClick={onClose}>
//             <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
//                 <h4 className={styles.modalTitle}>Удалить сообщение?</h4>
//                 <div className={styles.modalActions}>
//                     <button className={`${styles.modalButton} ${styles.confirmButton}`} onClick={onConfirm}>
//                         Да
//                     </button>
//                     <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={onClose}>
//                         Отмена
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// function ChatListPage() {
//   const [processedChats, setProcessedChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [newMessage, setNewMessage] = useState('');
//   const [deleteModal, setDeleteModal] = useState({ isOpen: false, messageId: null });
//   const [messages, setMessages] = useState([]);
//   const { chatId } = useParams();
//   const [user, setUser] = useState([]);
//   const [newMessagesCount, setNewMessagesCount] = useState({});

//   const fetchChats = async () => {
//       const token = localStorage.getItem('token');
//       try {
//           const response = await fetch('http://localhost:5000/api/chats', {
//               method: 'GET',
//               headers: {
//                   'Authorization': `Bearer ${token}`
//               }
//           });
//           if (!response.ok) {
//               throw new Error(`Ошибка получения чатов: ${response.status}`);
//           }
//           const data = await response.json();
//           setProcessedChats(data);
//           if (chatId) {
//               const targetChat = data.find(chat => chat.id === parseInt(chatId));
//               if (targetChat) {
//                   setSelectedChat(targetChat);
//                   await fetchMessages(targetChat._id);
//               }
//           }
//       } catch (error) {
//           console.error(error);
//       }
//   };
//   useEffect(() => {
//     socket.connect();

//     return () => {
//         socket.disconnect();
//     };
// }, []);

// // Chat room management
// useEffect(() => {
//     if (selectedChat?._id) {
//         socket.emit('joinChat', selectedChat._id);
//         fetchMessages(selectedChat._id);
//     }

//     return () => {
//         if (selectedChat?._id) {
//             socket.emit('leaveChat', selectedChat._id);
//         }
//     };
// }, [selectedChat]);

// // Message listener
// useEffect(() => {
//   socket.on('receivedMessage', (message) => {
//       setMessages(prev => [...prev, message]);

//       // Увеличиваем счетчик новых сообщений для соответствующего чата
//       setNewMessagesCount(prev => ({
//           ...prev,
//           [message.chatId]: (prev[message.chatId] || 0) + 1
//       }));
//   });

//   return () => {
//       socket.off('receivedMessage');
//   };
// }, []);
//   const fetchMessages = async (chatId) => {
//       const token = localStorage.getItem('token');
//       try {
//           const response = await fetch(`http://localhost:5000/api/chatMessages/${chatId}`, {
//               method: 'GET',
//               headers: {
//                   'Authorization': `Bearer ${token}`
//               }
//           });
//           if (!response.ok) {
//               throw new Error(`Ошибка получения сообщений: ${response.status}`);
//           }
//           const data = await response.json();
//           setMessages(data);
//       } catch (error) {
//           console.error(error);
//       }
//   };

//   const getUser = async () => {
//       try {
//           const response = await fetch('http://localhost:5000/api/getUser', {
//               method: 'GET',
//               headers: {
//                   'Authorization': `Bearer ${localStorage.getItem('token')}`
//               }
//           });
//           if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`);
//           }
//           const userData = await response.json();
//           setUser(userData);
//       } catch (error) {
//           console.error(error);
//       }
//   };

//   useEffect(() => {
//       getUser();
//       fetchChats();
//   }, []);
//   useEffect(() => {
//     if (selectedChat) {
//         socket.emit('joinChat', selectedChat.id);
//     }

//     return () => {
//         if (selectedChat) {
//             socket.off(selectedChat.id);
//         }
//     };
// }, [selectedChat]);

// useEffect(() => {
//     if (!selectedChat) return; // Добавлено условие проверки на null
//     socket.emit('joinChat', selectedChat.id); // Присоединяемся к чату при его выборе

//     return () => {
//         socket.off(selectedChat.id); // Оставляем чат, когда компонент размонтируется
//     };
// }, [selectedChat]);

// useEffect(() => {
//   socket.on('receivedMessage', (message) => {
//       // Проверка, если сообщение уже существует
//       if (!messages.find(msg => msg._id === message._id)) {
//           setMessages(prev => [...prev, message]);
//       }
//   });

//   return () => {
//       socket.off('receivedMessage');
//   };
// }, [messages]);

// const handleSendMessage = (e) => {
//   e.preventDefault();
//   if (!newMessage.trim() || !selectedChat) return;

//   const messageData = {
//       chatId: selectedChat._id,
//       senderId: user._id,
//       content: newMessage.trim(),
//       timestamp: new Date().toLocaleString('ru-RU', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         hour12: false // 24-часовой формат
//     }),
//       isOwn: true,
//       isRead: false
//   };

//   // Отправляем сообщение на сервер
//   socket.emit('sendMessage', messageData);

//   // Добавляем сообщение в локальное состояние
//   setMessages(prevMessages => [...prevMessages, messageData]);

//   setNewMessage('');
// };
//     const handleDeleteMessage = messageId => {
//         setDeleteModal({ isOpen: true, messageId });
//     };

//     const confirmDelete = () => {
//         if (!selectedChat || !deleteModal.messageId) return;

//         setProcessedChats(prevChats => {
//             return prevChats.map(chat => {
//                 if (chat._id === selectedChat._id) {
//                     const updatedMessages = chat.messages.filter(msg => msg.id !== deleteModal.messageId);
//                     return {
//                         ...chat,
//                         messages: updatedMessages
//                     };
//                 }
//                 return chat;
//             });
//         });

//         setMessages(prevMessages => prevMessages.filter(msg => msg.id !== deleteModal.messageId)); // Удаляем сообщение из списка
//         setDeleteModal({ isOpen: false, messageId: null });
//     };

//     return (
//         <>
//             <Header />
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
//                                         onClick={() => setSelectedChat(chat)} // Установите выбранный чат
//                                     >
//                                         <div className={styles.chatAvatar}>
//                                             <img
//                                                 src={chat.participants[0]._id === user._id ? `http://localhost:5000/${chat.participants[1].avatar}` : `http://localhost:5000/${chat.participants[0].avatar}`}
//                                                 alt="Avatar"
//                                                 onError={(e) => {
//                                                     e.target.src = defaultAvatarImage;
//                                                 }}
//                                             />
//                                         </div>
//                                         <div className={styles.chatInfo}>
//                                             <div className={styles.chatName}>
//                                                 <span>{chat.participants[0]._id === user._id ? chat.participants[1].name : chat.participants[0].name} {chat.participants[0]._id === user._id ? chat.participants[1].surname : chat.participants[0].surname}</span>
//                                             </div>
//                                             <div className={styles.messageStatusText}>
//                                                 {chat.messageStatus}
//                                             </div>
//                                         </div>
//                                         <div className={styles.messageStatusIcon}>
//                                             <MessageStatusIcon status={chat.messageStatus} />
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Детали чата */}
//                         <div className={styles.chatDetails}>
//                             {selectedChat ? (
//                                 <>
//                                     <div className={styles.chatHeader}>
//                                         <img
//                                             src={selectedChat.participants[0]._id === user._id ? `http://localhost:5000/${selectedChat.participants[1].avatar}` : `http://localhost:5000/${selectedChat.participants[0].avatar}`}
//                                             alt="Profile"
//                                             className={styles.chatProfileImage}
//                                             onError={(e) => {
//                                                 e.target.src = defaultAvatarImage;
//                                             }}
//                                         />
//                                         <div className={styles.chatProfileName}>
//                                             <span>{selectedChat.participants[0]._id === user._id ? selectedChat.participants[1].name : selectedChat.participants[0].name}</span>
//                                             <span>{selectedChat.participants[0]._id === user._id ? selectedChat.participants[1].surname : selectedChat.participants[0].surname}</span>
//                                         </div>
//                                     </div>

//                                     <div className={styles.chatMessagesContainer}>
//                                         <div className={styles.messagesList}>
//                                             {/* Отображение сообщений для выбранного чата */}
//                                             {Array.isArray(messages) && messages.map(message => (
//     <div
//         key={message._id}
//         className={`${styles.message} ${message.senderId === user._id ? styles.own : styles.other}`} // Используем senderId для определения владельца сообщения
//     >
//         <div className={styles.messageContent}>
//             <p>{message.content}</p>
//             <div className={styles.messageInfo}>
//                 <span className={styles.messageTime}>{message.timestamp}</span>
//                 {message.senderId === user._id && ( // Проверяем, если сообщение от текущего пользователя
//                     <>
//                         <span className={styles.messageStatus}>
//                             {message.isRead ? 'Прочитано' : 'Отправлено'}
//                         </span>
//                         <button
//                             className={styles.deleteMessage}
//                             onClick={() => handleDeleteMessage(message._id)} // Используем _id для удаления
//                         >
//                             ×
//                         </button>
//                     </>
//                 )}
//             </div>
//         </div>
//     </div>
// ))}
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

//                         <DeleteConfirmModal
//                             isOpen={deleteModal.isOpen}
//                             onClose={() => setDeleteModal({ isOpen: false, messageId: null })}
//                             onConfirm={confirmDelete}
//                         />
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }

// export default ChatListPage;


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import defaultAvatarImage from '../../assets/images/default-avatar.png';
// import styles from './ChatListPage.module.css';
// import Header from '../../components/Header/Header';
// import Home from '../Home/Home';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

// // Иконка статуса сообщения
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
//             <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
//                 <h4 className={styles.modalTitle}>Удалить сообщение?</h4>
//                 <div className={styles.modalActions}>
//                     <button className={`${styles.modalButton} ${styles.confirmButton}`} onClick={onConfirm}>Да</button>
//                     <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={onClose}>Отмена</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// function ChatListPage() {
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
//                 [message.chatId]: (prev[message.chatId] || 0) + 1
//             }));
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

//     const handleDeleteMessage = messageId => {
//         setDeleteModal({ isOpen: true, messageId });
//     };

//     const confirmDelete = () => {
//         if (!selectedChat || !deleteModal.messageId) return;

//         setProcessedChats(prevChats => {
//             return prevChats.map(chat => {
//                 if (chat._id === selectedChat._id) {
//                     const updatedMessages = chat.messages.filter(msg => msg.id !== deleteModal.messageId);
//                     return {
//                         ...chat,
//                         messages: updatedMessages
//                     };
//                 }
//                 return chat;
//             });
//         });

//         setMessages(prevMessages => prevMessages.filter(msg => msg.id !== deleteModal.messageId));
//         setDeleteModal({ isOpen: false, messageId: null });
//     };

//     const markAsRead = () => {
//         // Отправляем событие, что сообщения были прочитаны
//         if (selectedChat) {
//             socket.emit('readMessages', { chatId: selectedChat._id, userId: user._id });
//             setNewMessagesCount(prev => ({
//                 ...prev,
//                 [selectedChat._id]: 0 // Сбрасываем счетчик новых сообщений
//             }));
//         }
//     };

//     return (
//         <>
//             <Header />
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
//                                         <img
//                                             src={selectedChat.participants[0]._id === user._id ? `http://localhost:5000/${selectedChat.participants[1].avatar}` : `http://localhost:5000/${selectedChat.participants[0].avatar}`}
//                                             alt="Profile"
//                                             className={styles.chatProfileImage}
//                                             onError={(e) => { e.target.src = defaultAvatarImage; }}
//                                         />
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
//                                                             <span className={styles.messageTime}>{message.timestamp}</span>
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

//                         <DeleteConfirmModal
//                             isOpen={deleteModal.isOpen}
//                             onClose={() => setDeleteModal({ isOpen: false, messageId: null })}
//                             onConfirm={confirmDelete}
//                         />
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }

// export default ChatListPage;



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import defaultAvatarImage from '../../assets/images/default-avatar.png';
// import styles from './ChatListPage.module.css';
// import Header from '../../components/Header/Header';
// import Home from '../Home/Home';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

// // Иконка статуса сообщения
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

// function ChatListPage() {
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
//                 [message.chatId]: (prev[message.chatId] || 0) + 1
//             }));
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

//     const confirmDelete = () => {
//         if (!selectedChat || !deleteModal.messageId) return;

//         setProcessedChats(prevChats => {
//             return prevChats.map(chat => {
//                 if (chat._id === selectedChat._id) {
//                     const updatedMessages = chat.messages.filter(msg => msg.id !== deleteModal.messageId);
//                     return {
//                         ...chat,
//                         messages: updatedMessages
//                     };
//                 }
//                 return chat;
//             });
//         });

//         setMessages(prevMessages => prevMessages.filter(msg => msg.id !== deleteModal.messageId));
//         setDeleteModal({ isOpen: false, messageId: null });
//     };

//     const markAsRead = () => {
//         // Отправляем событие, что сообщения были прочитаны
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
//         }
//     };

//     return (
//         <>
//             <Header />
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
//                                         <img
//                                             src={selectedChat.participants[0]._id === user._id ? `http://localhost:5000/${selectedChat.participants[1].avatar}` : `http://localhost:5000/${selectedChat.participants[0].avatar}`}
//                                             alt="Profile"
//                                             className={styles.chatProfileImage}
//                                             onError={(e) => { e.target.src = defaultAvatarImage; }}
//                                         />
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
//                                                             <span className={styles.messageTime}>{message.timestamp}</span>
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

//                         <DeleteConfirmModal
//                             isOpen={deleteModal.isOpen}
//                             onClose={() => setDeleteModal({ isOpen: false, messageId: null })}
//                             onConfirm={confirmDelete}
//                         />
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }

// export default ChatListPage;

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import defaultAvatarImage from '../../assets/images/default-avatar.png';
import styles from './ChatListPage.module.css';
import Header from '../../components/Header/Header';
import Home from '../Home/Home';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io('http://localhost:5000');

const MessageStatusIcon = ({ status }) => {
    switch (status) {
        case 'Отправлено':
            return <svg width="20" height="20" fill="none"><path d="M4 10L8 14L16 6" stroke="#BEBBBB" strokeWidth="2" /><path d="M2 10L6 14L14 6" stroke="#BEBBBB" strokeWidth="2" /></svg>;
        case 'Получено':
            return <svg width="20" height="20" fill="none"><path d="M4 10L8 14L16 6" stroke="#AEE1FF" strokeWidth="2" /><path d="M2 10L6 14L14 6" stroke="#AEE1FF" strokeWidth="2" /></svg>;
        case 'Новое сообщение':
            return <div className={styles.newMessageIndicator}><span>!</span></div>;
        case 'Прочитано':
            return null;
        default:
            return null;
    }
};

const SendIcon = () => (
    <svg width="30" height="30" fill="none"><path d="M27.5 2.5L13.75 16.25" stroke="#AEE1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M27.5 2.5L18.75 27.5L13.75 16.25L2.5 11.25L27.5 2.5Z" stroke="#AEE1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h4 className={styles.modalTitle}>Удалить сообщение?</h4>
                <div className={styles.modalActions}>
                    <button className={`${styles.modalButton} ${styles.confirmButton}`} onClick={onConfirm}>Да</button>
                    <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

function ChatListPage() {
    const [processedChats, setProcessedChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, messageId: null });
    const [messages, setMessages] = useState([]);
    const { chatId } = useParams();
    const [user, setUser] = useState([]);
    const [newMessagesCount, setNewMessagesCount] = useState({});

    const fetchChats = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/chats', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`Ошибка получения чатов: ${response.status}`);
            }

            const data = await response.json();
            setProcessedChats(data);

            if (chatId) {
                const targetChat = data.find(chat => chat.id === parseInt(chatId));
                if (targetChat) {
                    setSelectedChat(targetChat);
                    await fetchMessages(targetChat._id);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        socket.connect();
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (selectedChat?._id) {
            socket.emit('joinChat', selectedChat._id);
            fetchMessages(selectedChat._id);
        }

        return () => {
            if (selectedChat?._id) {
                socket.emit('leaveChat', selectedChat._id);
            }
        };
    }, [selectedChat]);

    useEffect(() => {
        socket.on('receivedMessage', (message) => {
            setMessages(prev => [...prev, message]);

            // Увеличиваем счетчик новых сообщений для соответствующего чата
            setNewMessagesCount(prev => ({
                ...prev,
                [message.chatId]: (prev[message.chatId] || 0) + 1,
            }));
            
            // Обновляем статус чата на "Новое сообщение"
            setProcessedChats(prevChats => 
                prevChats.map(chat => 
                    chat._id === message.chatId 
                    ? { ...chat, messageStatus: 'Новое сообщение' } 
                    : chat
                )
            );
        });

        return () => {
            socket.off('receivedMessage');
        };
    }, []);

    const fetchMessages = async (chatId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:5000/api/chatMessages/${chatId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`Ошибка получения сообщений: ${response.status}`);
            }

            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    };

    const getUser = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/getUser', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (!response.ok) {
                throw new Error(`Ошибка! статус: ${response.status}`);
            }

            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUser();
        fetchChats();
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const messageData = {
            chatId: selectedChat._id,
            senderId: user._id,
            content: newMessage.trim(),
            timestamp: new Date().toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // 24-часовой формат
            }),
            isOwn: true,
            isRead: false
        };

        // Отправляем сообщение на сервер
        socket.emit('sendMessage', messageData);

        // Добавляем сообщение в локальное состояние
        setMessages(prevMessages => [...prevMessages, messageData]);
        setNewMessage('');
    };

    const handleDeleteMessage = (messageId) => {
        setDeleteModal({ isOpen: true, messageId });
    };

    const confirmDelete = async() => {
        try {
          const messageId = deleteModal.messageId;
        // Emit socket event for message deletion
        socket.emit('deleteMessage', {
            messageId,
            chatId: selectedChat._id
        });
        
        // Remove message from local state
        setMessages(prevMessages => 
            prevMessages.filter(message => message._id !== messageId)
        );
    } catch (error) {
        console.error('Error deleting message:', error);
    }

       

        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== deleteModal.messageId));
        setDeleteModal({ isOpen: false, messageId: null });
    };
    useEffect(() => {
      // Existing socket listeners...
  
      socket.on('messageDeleted', ({ messageId }) => {
          setMessages(prevMessages => 
              prevMessages.filter(message => message._id !== messageId)
          );
      });
  
      return () => {
          socket.off('messageDeleted');
          // Other socket.off cleanup...
      };
  }, []);
    const markAsRead = () => {
        if (selectedChat) {
            socket.emit('readMessages', { chatId: selectedChat._id, userId: user._id });

            // Изменяем статус прочтения у сообщений в локальном состоянии
            setMessages(prevMessages =>
                prevMessages.map(msg => ({
                    ...msg,
                    isRead: true
                }))
            );

            setNewMessagesCount(prev => ({
                ...prev,
                [selectedChat._id]: 0 // Сбрасываем счетчик новых сообщений
            }));

            // Обновляем статус чата на "Прочитано"
            setProcessedChats(prevChats =>
                prevChats.map(chat =>
                    chat._id === selectedChat._id
                        ? { ...chat, messageStatus: 'Прочитано' }
                        : chat
                )
            );
        }
    };

    return (
        <>
            <Header />
            <main className="home-container">
                <Home />
                <div className="content-container">
                    <div className={styles.chatListPage}>
                        <div className={styles.chatListContainer}>
                            <div className={styles.chatListHeader}>Чаты</div>
                            <div className={styles.chatList}>
                                {Array.isArray(processedChats) && processedChats.map(chat => (
                                    <div
                                        key={chat._id}
                                        className={`${styles.chatItem} ${selectedChat?._id === chat._id ? styles.selected : ''}`}
                                        onClick={() => {
                                            setSelectedChat(chat);
                                            markAsRead(); // Отметить сообщения как прочитанные при выборе чата
                                        }}
                                    >
                                        <div className={styles.chatAvatar}>
                                            <img
                                                src={chat.participants[0]._id === user._id ? `http://localhost:5000/${chat.participants[1].avatar}` : `http://localhost:5000/${chat.participants[0].avatar}`}
                                                alt="Avatar"
                                                onError={(e) => { e.target.src = defaultAvatarImage; }}
                                            />
                                        </div>
                                        <div className={styles.chatInfo}>
                                            <div className={styles.chatName}>
                                                <span>{chat.participants[0]._id === user._id ? `${chat.participants[1].name} ${chat.participants[1].surname}` : `${chat.participants[0].name} ${chat.participants[0].surname}`}</span>
                                            </div>
                                            <div className={styles.messageStatusText}>
                                                {newMessagesCount[chat._id] ? `${newMessagesCount[chat._id]} новых сообщений` : chat.messageStatus}
                                            </div>
                                        </div>
                                        <div className={styles.messageStatusIcon}>
                                            <MessageStatusIcon status={chat.messageStatus} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Подробности чата */}
                        <div className={styles.chatDetails}>
                            {selectedChat ? (
                                <>
                                    <div className={styles.chatHeader}>
                                      <Link to={selectedChat.participants[0]._id === user._id ? `/${selectedChat.participants[1].login}`:`/${selectedChat.participants[0].login}`}>
                                        <img
                                            src={selectedChat.participants[0]._id === user._id ? `http://localhost:5000/${selectedChat.participants[1].avatar}` : `http://localhost:5000/${selectedChat.participants[0].avatar}`}
                                            alt="Profile"
                                            className={styles.chatProfileImage}
                                            onError={(e) => { e.target.src = defaultAvatarImage; }}
                                        />
                                        </Link>
                                        <div className={styles.chatProfileName}>
                                            <span>{selectedChat.participants[0]._id === user._id ? selectedChat.participants[1].name : selectedChat.participants[0].name}</span>
                                            <span>{selectedChat.participants[0]._id === user._id ? selectedChat.participants[1].surname : selectedChat.participants[0].surname}</span>
                                        </div>
                                    </div>

                                    <div className={styles.chatMessagesContainer}>
                                        <div className={styles.messagesList}>
                                            {Array.isArray(messages) && messages.map(message => (
                                                <div
                                                    key={message._id}
                                                    className={`${styles.message} ${message.senderId === user._id ? styles.own : styles.other}`}
                                                >
                                                    <div className={styles.messageContent}>
                                                        <p>{message.content}</p>
                                                        <div className={styles.messageInfo}>
                                                            <span className={styles.messageTime}>{new Date(message.timestamp).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}</span>
                                                            {message.senderId === user._id && (
                                                                <>
                                                                    <span className={styles.messageStatus}>
                                                                        {message.isRead ? 'Прочитано' : 'Отправлено'}
                                                                    </span>
                                                                    <button
                                                                        className={styles.deleteMessage}
                                                                        onClick={() => handleDeleteMessage(message._id)}
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <form onSubmit={handleSendMessage} className={styles.messageInputContainer}>
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={e => setNewMessage(e.target.value)}
                                                placeholder="Введите сообщение..."
                                                className={styles.messageInput}
                                            />
                                            <button type="submit" className={styles.sendButton}>
                                                <SendIcon />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.noChatSelected}>Выберите чат для просмотра</div>
                            )}
                        </div>

                        <DeleteConfirmModal
                            isOpen={deleteModal.isOpen}
                            onClose={() => setDeleteModal({ isOpen: false, messageId: null })}
                            onConfirm={confirmDelete}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}

export default ChatListPage;