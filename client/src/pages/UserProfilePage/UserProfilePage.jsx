import React, { useState, useEffect, useRef } from 'react';
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal';
import defaultAvatarImage from '../../assets/images/default-avatar.png';
import defaultPostImage from '../../assets/images/default-post.png';
import EditIcon from '../../assets/icons/edit.svg';
import PlusIcon from '../../assets/icons/plus.svg';

// Импорт тестовых данных


import styles from './UserProfilePage.module.css';
import Home from '../Home/Home';
import Header from '../../components/Header/Header';
import toast from 'react-hot-toast';

const CreateChannelModal = ({ isOpen, onClose }) => {
  const [channelName, setChannelName] = useState('');
  const [channelUsername, setChannelUsername] = useState('');
  const [channelDesc, setChannelDesc] = useState('');
  const [channelAvatar, setChannelAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Загрузка категорий при открытии
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/category');
        if (response.ok) {
          const data = await response.json();
          setCategoriesList(data);
        }
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  // Drag and Drop для Аватара канала
  const handleDrag = e => { e.preventDefault(); e.stopPropagation(); setIsDragging(e.type === 'dragover' || e.type === 'dragenter'); };
  const handleDrop = e => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) { setChannelAvatar(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) { setChannelAvatar(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  const handleCategoryChange = (id) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', channelName);
    formData.append('username', channelUsername);
    formData.append('description', channelDesc);
    if (channelAvatar) formData.append('avatar', channelAvatar);
    selectedCategories.forEach(catId => formData.append('categories[]', catId));

    try {
      const response = await fetch('http://localhost:5000/api/channels', { // Твой эндпоинт создания канала
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || 'Ошибка создания канала');
        return;
      }

      toast.success('Канал успешно создан!');
      // Сброс полей
      setChannelName(''); setChannelUsername(''); setChannelDesc(''); setChannelAvatar(null); setAvatarPreview(null); setSelectedCategories([]);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Ошибка сервера');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Создать канал</h3>

        <form onSubmit={handleSubmit} className={styles.createPostForm}>
          {/* Загрузка аватара канала */}
          <div 
            className={`${styles.imageUploadArea} ${isDragging ? styles.dragging : ''} ${avatarPreview ? styles.hasImage : ''}`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDrag} onDragEnter={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
          >
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className={styles.hiddenFileInput} />
            {avatarPreview ? (
              <div className={styles.imagePreviewContainer}>
                <img src={avatarPreview} alt="Avatar Preview" className={styles.imagePreview} />
                <button type="button" onClick={(e) => { e.stopPropagation(); setChannelAvatar(null); setAvatarPreview(null); }} className={styles.removeImageButton}>✕</button>
              </div>
            ) : (
              <div className={styles.uploadPrompt}>
                <div className={styles.uploadIcon}>📢</div>
                <p>Загрузить аватар канала</p>
              </div>
            )}
          </div>

          {/* Название канала */}
          <input 
            type="text" placeholder="Название канала" required
            value={channelName} onChange={e => setChannelName(e.target.value)}
            className={styles.postTextArea} style={{ height: '40px', padding: '8px 12px' }}
          />

          {/* Ссылка / Юзернейм */}
          <input 
            type="text" placeholder="Ссылка (например: @my_channel)" required
            value={channelUsername} onChange={e => setChannelUsername(e.target.value)}
            className={styles.postTextArea} style={{ height: '40px', padding: '8px 12px', marginTop: '10px' }}
          />

          {/* Описание */}
          <textarea
            value={channelDesc} onChange={e => setChannelDesc(e.target.value)}
            placeholder="Описание канала..." className={styles.postTextArea} style={{ marginTop: '10px' }}
          />

          {/* Категории */}
          <div className={styles.categoriesDropdown} style={{ marginTop: '10px' }}>
            <h3>Выберите тематику канала:</h3>
            {categoriesList.map(cat => (
              <div key={cat._id} className="div_category">
                <input 
                  type="checkbox" id={`channel-cat-${cat._id}`}
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => handleCategoryChange(cat._id)}
                />
                <label htmlFor={`channel-cat-${cat._id}`}>{cat.name}</label>
              </div>
            ))}
          </div>

          {/* Кнопки */}
          <div className={styles.modalActions}>
            <button type="submit" className={styles.submitButton} disabled={!channelName.trim() || !channelUsername.trim()}>
              Создать
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// Модальное окно создания поста
const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  useEffect(()=>{
    const getCategory = async()=>{
        try {
            const response = await fetch('http://localhost:5000/api/category',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            
            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message);
            }
            const data = await response.json();
            setCategory(data);

        } catch (error) {
            console.error(error);
        }
    }
    getCategory();
},[])
  const handleRemoveImage = e => {
    e.stopPropagation();
    setPostImage(null);
    setImagePreview(null);
  };
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelectedCategories) => {
        if (prevSelectedCategories.includes(categoryId)) {
            // Удалить категорию из выбранных
            return prevSelectedCategories.filter(item => item !== categoryId);
        } else {
            // Добавить категорию в выбранные
            return [...prevSelectedCategories, categoryId];
        }
    });
};
  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', postText);
    formData.append('preview', postImage);
    selectedCategories.forEach(category => {
      formData.append('categories[]', category); // Используйте 'categories[]' чтобы отправить массив
  });
    try {
      const response = await fetch('http://localhost:5000/api/addPost',{
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message);
        return;
      }
      setPostText('');
      setPostImage(null);
      setImagePreview(null);
      setSelectedCategories([]);
      const data = await response.json();
      
      toast.success(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Создать пост</h3>

        <form onSubmit={handleSubmit} className={styles.createPostForm}>
          {/* Область для загрузки изображения */}
          <div
            className={`${styles.imageUploadArea} ${isDragging ? styles.dragging : ''} ${
              imagePreview ? styles.hasImage : ''
            }`}
            onClick={handleImageClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.hiddenFileInput}
            />

            {imagePreview ? (
              <div className={styles.imagePreviewContainer}>
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className={styles.removeImageButton}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className={styles.uploadPrompt}>
                <div className={styles.uploadIcon}>📷</div>
                <p>Перетащите изображение сюда или кликните для выбора</p>
              </div>
            )}
          </div>

          {/* Текстовое поле */}
          <textarea
            value={postText}
            onChange={e => setPostText(e.target.value)}
            placeholder="Что у вас нового?"
            className={styles.postTextArea}
          />

          {/* Выпадающий список категорий */}
          <div className={styles.categoriesDropdown}>
            
          <div className="categories">
                            <h3>Выберите категории:</h3>
                            {category.map((cat) => (
                                <div key={cat._id} className='div_category'>
                                    <input
                                        type="checkbox"
                                        id={cat._id} // Убедитесь, что вы используете уникальные идентификаторы
                                        value={cat.name}
                                        checked={selectedCategories.includes(cat._id)}
                                        onChange={() => handleCategoryChange(cat._id)}
                                    />
                                    <label htmlFor={cat._id}>{cat.name}</label> {/* Используйте cat.name для отображения */}
                                </div>
                            ))}
                        </div>
            
          </div>

          {/* Кнопки действий */}
          <div className={styles.modalActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!postText.trim() && !postImage}
            >
              Опубликовать
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserProfilePage = () => {
  const token = localStorage.getItem('token');
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
   // ID текущего пользователя
  // Определяем состояния
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]); // Добавлено состояние для постов
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState([]); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditProfile = updatedData => {
    // Здесь будет логика обновления данных пользователя
    console.log('Updated profile data:', updatedData);
  };
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
      setCategory(userData.category);
    } catch (error) {
      console.error(error);
    }
  }
  const getPostsByUserId = async()=>{
    try {
      const response = await fetch('http://localhost:5000/api/postByUser',{
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
    setUserPosts(postsData);

    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    // Получаем данные пользователя
    
    
    getUser();
    if (user) {
      getPostsByUserId();
  }
    // Получаем посты пользователя с информацией о лайках и сортируем их по дате (новые сверху)
   
  }, [token,user]);
  const handlePostCreated = (newPost) => {
    setUserPosts(prevPosts => [newPost, ...prevPosts]); // Добавляем новый пост в начало списка
};
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

  if (!user) return null;

  

  return (
    <>
    <Header/>
     <main className="home-container">
      <Home/>
    <div className="content-container">
    <div className={styles.profileContainer}>
      <div className={styles.leftSection}>
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
          <button className={styles.editProfileButton} onClick={() => setIsEditModalOpen(true)}>
            <img src={EditIcon} alt="Edit profile" />
          </button>

          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={user}
            onSave={handleEditProfile}
            availableCategories={category}
          />
        </div>

        {/* Кнопка создания поста */}
        <button className={styles.createPostButton} onClick={() => setIsModalOpen(true)}>
          <img src={PlusIcon} alt="Create post" />
          <span>Создать пост</span>
        </button>
            <button className={styles.createPostButton} onClick={()=>setIsChannelModalOpen(true)}>
              <img src={PlusIcon} alt="Create post" />
          <span>Создать канал</span>
            </button>
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
      <div className={styles.rightSection}>{/* Тут будут категории выбраные пользователем */}</div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
      <CreateChannelModal
  isOpen={isChannelModalOpen}
  onClose={() => setIsChannelModalOpen(false)}
/>
    </div>
    </div>
    </main>
    </>
  );
};

export default UserProfilePage;
