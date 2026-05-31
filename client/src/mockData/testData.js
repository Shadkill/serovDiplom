// Базовые пользователи системы
export const users = [
    {
      id: 1,
      firstName: 'Александр',
      lastName: 'Иванов',
      avatar: '../assets/images/default-avatar.png',
      friends: [2, 3, 4], // ID друзей
      posts: [1, 3], // ID постов пользователя
    },
    {
      id: 2,
      firstName: 'Мария',
      lastName: 'Петрова',
      avatar: '../assets/images/default-avatar.png',
      friends: [1, 3, 5],
      posts: [2],
    },
    {
      id: 3,
      firstName: 'Дмитрий',
      lastName: 'Сидоров',
      avatar: '../assets/images/default-avatar.png',
      friends: [1, 2],
      posts: [4],
    },
    {
      id: 4,
      firstName: 'Екатерина',
      lastName: 'Козлова',
      avatar: '../assets/images/default-avatar.png',
      friends: [1, 5],
      posts: [5],
    },
    {
      id: 5,
      firstName: 'Андрей',
      lastName: 'Смирнов',
      avatar: '../assets/images/default-avatar.png',
      friends: [2, 4],
      posts: [],
    },
    {
        id: 6,
        firstName: 'Ольга',
        lastName: 'Морозова',
        avatar: '../assets/images/default-avatar.png',
        friends: [],
        posts: []
      },
      {
        id: 7,
        firstName: 'Павел',
        lastName: 'Волков',
        avatar: '../assets/images/default-avatar.png',
        friends: [],
        posts: []
      },
  ];
  
  // Посты пользователей
  export const posts = [
    {
      id: 1,
      authorId: 1, // ID автора из массива users
      text: 'Сегодня был замечательный день! Посетил новую художественную выставку в центре города.',
      image: '../assets/images/default-post.png',
      category: 'Искусство',
      createdAt: '2024-03-11T14:30:00',
      likedBy: [2, 3, 4], // ID пользователей, поставивших лайк
    },
    {
      id: 2,
      authorId: 2,
      text: 'Делюсь рецептом любимого десерта...',
      image: '../assets/images/default-post.png',
      category: 'Кулинария',
      createdAt: new Date().toISOString(),
      likedBy: [1, 3, 4, 5],
    },
    {
      id: 3,
      authorId: 1,
      text: 'Прекрасная погода для пробежки!',
      image: '../assets/images/default-post.png',
      category: 'Спорт',
      createdAt: '2024-03-10T09:15:00',
      likedBy: [2, 4],
    },
    {
      id: 4,
      authorId: 3,
      text: 'Новая книга оказалась потрясающей!',
      image: '../assets/images/default-post.png',
      category: 'Книги',
      createdAt: '2024-03-09T18:45:00',
      likedBy: [1, 2],
    },
    {
      id: 5,
      authorId: 4,
      text: 'Только что вернулась с концерта...',
      image: '../assets/images/default-post.png',
      category: 'Музыка',
      createdAt: '2024-03-08T22:30:00',
      likedBy: [1, 2, 3, 5],
    },
  ];
  
  // Категории для постов
  export const categories = [
    'Спорт',
    'Музыка',
    'Искусство',
    'Книги',
    'Кулинария',
    'Путешествия',
  ];
  
  // Чаты пользователей
  export const chats = [
    {
      id: 1,
      participants: [1, 2], // ID участников чата из массива users
      messages: [
        {
          id: 1,
          senderId: 1,
          text: 'Привет! Как дела?',
          timestamp: '2024-03-11T10:00:00',
          status: 'read', // read, unread, sent
        },
        {
          id: 2,
          senderId: 2,
          text: 'Привет! Все отлично, спасибо!',
          timestamp: '2024-03-11T10:05:00',
          status: 'read',
        },
      ],
    },
    {
      id: 2,
      participants: [1, 3],
      messages: [
        {
          id: 3,
          senderId: 3,
          text: 'Встретимся сегодня?',
          timestamp: '2024-03-11T11:30:00',
          status: 'unread',
        },
      ],
    },
    {
        id: 3,
        participants: [1, 4],
        messages: [
          {
            id: 4,
            senderId: 1,
            text: 'Каво?',
            timestamp: '2024-03-11T11:40:00',
            status: 'sent',
          },
        ],
      },
    // Добавьте больше чатов по необходимости
  ];

  // Данные о заявках в друзья
  export const friendRequests = [
    {
      id: 1,
      fromUserId: 6,
      toUserId: 1,
      status: 'pending' // pending, accepted, rejected
    },
    {
      id: 2,
      fromUserId: 7,
      toUserId: 1,
      status: 'pending'
    }
  ];
  
  // Вспомогательные функции для работы с данными
  export const getUserById = (id) => users.find(user => user.id === id);
  
  export const getPostsByUserId = (userId) => posts.filter(post => post.authorId === userId);
  
  // Вспомогательная функция для получения списка друзей пользователя
  export const getUserFriends = (userId) => {
    const user = getUserById(userId);
    return user ? user.friends.map(friendId => getUserById(friendId)) : [];
  };

  // Вспомогательная функция для получения заявок в друзья
  export const getUserFriendRequests = (userId) => {
    return friendRequests
      .filter(request => request.toUserId === userId && request.status === 'pending')
      .map(request => ({
        ...request,
        fromUser: getUserById(request.fromUserId)
      }));
  };
  
  export const getChatsByUserId = (userId) => {
    return chats.filter(chat => chat.participants.includes(userId));
  };
  
  export const getLastMessageFromChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    return chat?.messages[chat.messages.length - 1];
  };
  