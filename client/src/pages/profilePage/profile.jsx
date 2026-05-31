
import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Home from '../Home/Home';
import './style.css'
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from '../UserProfilePage/UserProfilePage.module.css';
import defaultAvatarImage from '../../assets/images/default-avatar.png';
import defaultPostImage from '../../assets/images/default-post.png';
import CategoryIcon from '../../assets/icons/category.svg';
const Profile = () => {
    const [user,setUser] = useState([]);
    const [categories,setCategories] = useState([]);
    const [userToken,setUserToken] = useState([]);
    const {login} = useParams();
      const [userPosts, setUserPosts] = useState([]); // Добавлено состояние для постов
    const token = localStorage.getItem('token');
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
          setUserToken(userData);
          setCategories(userData.category);
        } catch (error) {
          console.error(error);
        }
      }
    useEffect(()=>{
        const getUserByLogin = async()=>{
            try {
                const response = await fetch(`http://localhost:5000/api/userLogin/${login}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if(!response.ok){
                    const data = await response.json();
                    toast.error(data.message);
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        }
        getUserByLogin();
        getUser();
        if(user){
            getPostsByUserLogin();
        }
            
    },[login]);
      const getPostsByUserLogin = async()=>{
        try {
          const response = await fetch(`http://localhost:5000/api/postByUser/${login}`,{
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
            isLiked: post.likedBy.includes(userToken._id),
        }));
        setUserPosts(postsData);
    
        } catch (error) {
          console.error(error);
        }
      }
      
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
                        isLiked: data.likedBy.includes(userToken._id),
                    };
                }
                return post;
            })
        );
      } catch (error) {
          console.error('Ошибка при обновлении лайка:', error);
      }
      };
    


    const addFriend = async(id)=>{    
        try {
            const response = await fetch(`http://localhost:5000/api/addFriend/${id}`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
            if(!response.ok){
                const data = await response.json();
                toast.error(data.message);
            }
            const data = await response.json();
            toast.success(data.message);
        } catch (error) {
            console.error(error);
        }
      } 
    const formatDate = dateString => {
        const date = new Date(dateString);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
    
        if (isToday) {
          return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          });
        }
    
        return date.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
        });
      };
    return (
        <>
            <Header/>
           <main className="home-container">
            <Home/>

            <div className="content-container">
            <div className={styles.profileContainer}>
      <div className={styles.leftSection}>1
        {/* Информация о пользователе */}
        <div className={styles.userInfo}>
          <img
            src={`http://localhost:5000/${user.avatar}` || defaultAvatarImage}
            alt="Profile"
            className={styles.userAvatar}
            onError={e => {
              e.target.src = defaultAvatarImage;
            }}
          />
          <div className={styles.userName}>
            <span>{user.name}</span>
            <span>{user.surname}</span>
          </div>
          <button className={styles.editProfileButton}  onClick={()=>addFriend(user._id)}>
           {userToken._id === user._id ? <div></div>:<img src={'/src/assets/icons/friend_add.svg'} alt="Edit profile" />}
            
          </button>

        </div>


        {/* Посты пользователя */}
        <div className={styles.postsContainer}>
          {userPosts.map(post => (
            <article key={post.id} className={styles.post}>
              <div className={styles.postHeader}>
                <img
                  src={`http://localhost:5000/${user.avatar}` || defaultAvatarImage}
                  alt="Avatar"
                  className={styles.authorAvatar}
                  onError={e => {
                    e.target.src = defaultAvatarImage;
                  }}
                />
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>
                    <span>{user.name}</span>
                    <span>{user.surname}</span>
                  </div>
                  <div className={styles.postDate}>{formatDate(post.createdAt)}</div>
                </div>
              </div>

              {post.content && <p className={styles.postText}>{post.content}</p>}

              {post.preview && (
                <div className={styles.postContent}>
                  <img
                    src={`http://localhost:5000/${post.preview}` || defaultPostImage}
                    alt="Post content"
                    className={styles.postImage}
                    onError={e => {
                      e.target.src = defaultPostImage;
                    }}
                  />
                  <div className={styles.postActions}>
                    <button
                      className={`${styles.likeButton} ${post.likedBy.includes(token.id) ? styles.liked : ''}`}
                      onClick={() => handleLike(post._id)}
                    >
                     {post.isLiked ? '❤️' : '🤍'}  {post.likeCount}
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      {/* Правая секция (будет реализована позже) */}
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

export default Profile;
