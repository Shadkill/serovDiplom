import { useEffect, useState } from 'react';

import PlusIcon from '../../assets/icons/plus.svg';
import CategoryIcon from '../../assets/icons/category.svg';
import defaultPostImage from '../../assets/images/default-post.png';
import defaultAvatarImage from '../../assets/images/default-avatar.png';

// Импорт тестовых данных


import './NewsPage.css';
import Header from '../../components/Header/Header';
import Home from '../Home/Home';
import { posts } from '../../mockData/testData';
import { Link } from 'react-router-dom';


function NewsPage() {
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);
    const [userPosts,setUserPosts] = useState([]);
    const [categories,setCategories] = useState([]);
    const [author,setAuthor] = useState([]);
    // Инициализируем состояние постов, объединяя данные постов с данными их авторов
const getUser = async()=>{  
    try {
      const response = await fetch('http://localhost:5000/api/getUser',{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setUser(userData);
      setCategories(userData.category);
    } catch (error) {
      console.error(error);
    }
  }
  const getPostsByUserCategory = async()=>{
    try {
      const response = await fetch('http://localhost:5000/api/posts',{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const postsData = data.map(post => ({
        ...post,
        isLiked: post.likedBy.includes(user._id),
    }));
    setAuthor(data.author);
    setUserPosts(postsData);

    } catch (error) {
      console.error(error);
    }
  }



  useEffect(() => {
    // Получаем данные пользователя
    getUser();
}, []);
  useEffect(() => {
    // Получаем данные пользователя
    
    
  
    
    if (user) {
        getPostsByUserCategory();
    }
  
    // Получаем посты пользователя с информацией о лайках и сортируем их по дате (новые сверху)
   
  },[user]);

    // Форматирование даты поста
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        // Если пост создан сегодня, показываем только время
        if (isToday) {
            return date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Иначе показываем дату
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long'
        });
    };

    // Обработчик лайков
   const handleLike = async id => {
    try {
      
      const response = await fetch(`http://localhost:5000/api/likePost/${id}`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
      });

      const data = await response.json();

      if (!response.ok) {
          console.error(data.message);
          return;
      }
      
     
      setUserPosts(prevPosts =>
        prevPosts.map(post => {
            if (post._id === id) { // Обновляем по _id
                return {
                    ...post,
                    likedBy: data.likedBy,
                    likeCount: data.likes,
                    isLiked: data.likedBy.includes(user._id),
                };
            }
            return post;
        })
    );
  } catch (error) {
      console.error('Ошибка при обновлении лайка:', error);
  }
  };

    return (
        <>
        
        <Header/>
        <main className="home-container">

        <Home/>
        <div className="content-container">
                
            
        <div className="news-page">
            <div className="news-page-main-content">
                {/* Кнопка создания поста */}
               
                {/* Контейнер с постами */}
                <div className="posts-container">
                    {userPosts.map(post => (
                        <article key={post._id} className="post">
                            {/* Шапка поста с информацией об авторе */}
                            <div className="post-header">
                                <Link to={`/${post.author.login}`}>
                                <img
                                    src={`http://localhost:5000/${post.author.avatar}` || defaultAvatarImage}
                                    alt="Avatar"
                                    className="author-avatar"
                                    onError={(e) => {
                                        e.target.src = defaultAvatarImage;
                                    }}
                                /></Link>
                                <div className="author-info">
                                    <div className="author-name">
                                        <span>{post.author.name}</span>
                                        <span>{post.author.surname}</span>
                                    </div>
                                    <div className="post-date">
                                        {formatDate(post.createdAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Текст поста */}
                            {post.content && (
                                <p className="post-text">{post.content}</p>
                            )}

                            {/* Изображение поста и кнопка лайка */}
                            {post.preview && (
                                <div className="post-content">
                                    <img
                                        src={`http://localhost:5000/${post.preview}` || defaultPostImage}
                                        alt="Post content"
                                        className="post-image"
                                        onError={(e) => {
                                            e.target.src = defaultPostImage;
                                        }}
                                    />
                                    <div className="post-actions">
                                        <button
                                            className={`like-button ${post.isLiked ? 'liked' : ''}`}
                                            onClick={() => handleLike(post._id)}
                                        >
                                            {post.isLiked ? '❤️' : '🤍'} {post.likeCount}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </div>

            {/* Боковая панель с категориями */}
            <div className="categories-sidebar">
                <div className="categories-header">
                    <img
                        src={CategoryIcon}
                        alt="Categories"
                        className="category-icon"
                    />
                    <h2>Категории</h2>
                </div>
                <div className="categories-list">
                    {categories.map(category => (
                        <div key={category._id} className="category-item">
                            {category.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
        </main>
        </>
    );
}

export default NewsPage;