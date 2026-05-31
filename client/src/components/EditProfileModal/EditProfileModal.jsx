
import React, { useState, useRef, useEffect } from 'react';
import styles from './EditProfileModal.module.css';
import toast from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, user, onSave, availableCategories }) => {
    const [profileImage, setProfileImage] = useState(user.avatar);
    const [imagePreview, setImagePreview] = useState(user.avatar);
    const [firstName, setFirstName] = useState(user.name);
    const [lastName, setLastName] = useState(user.surname);
    const [login, setLogin] = useState(user.login);
    const [password, setPassword] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(availableCategories.map(cat => cat._id) || []); // Здесь предполагается, что user.category это массив объектов категорий
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddCategory = (categoryId) => {
        if (categoryId && !selectedCategories.includes(categoryId)) {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    const handleRemoveCategory = (categoryToRemove) => {
        setSelectedCategories(selectedCategories.filter(category => category !== categoryToRemove));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('avatar', profileImage);
        formData.append('name', firstName);
        formData.append('surname', lastName);
        formData.append('login', login);
       
        formData.append('category', selectedCategories);
     
      
       try {
        const response = await fetch('http://localhost:5000/api/updateProfile',{
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        if (!response.ok) {
          const data = await response.json();
          toast.error(data.message);
          return;
        }
        const updatedUser = await response.json();
        toast.success(updatedUser.message);
       } catch (error) {
        console.error(error);
       }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.imageSection}>
                    <div
                        className={`${styles.imageUpload} ${isDragging ? styles.dragging : ''}`}
                        onClick={() => fileInputRef.current.click()}
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
                            className={styles.hiddenInput}
                        />
                        <img
                            src={imagePreview}
                            alt="Profile"
                            className={styles.profileImage}
                        />
                    </div>
                    <span className={styles.changePhotoText}>Изменить фотографию</span>
                </div>

                <div className={styles.formContainer}>
                    <div className={styles.personalData}>
                        <h3 className={styles.sectionTitle}>Личные данные</h3>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Имя"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Фамилия"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Логин"
                            className={styles.input}
                        />
                       
                    </div>

                    <div className={styles.categories}>
                        <h3 className={styles.sectionTitle}>Категории</h3>
                        <select
                            className={styles.categorySelect}
                            onChange={(e) => handleAddCategory(e.target.value)}
                            value=""
                        >
                            <option value="" disabled>Выбрать категории</option>
                            {availableCategories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <div className={styles.selectedCategories}>
                            {selectedCategories.map(categoryId => {
                                const category = availableCategories.find(cat => cat._id === categoryId);
                                return (
                                    <div key={categoryId} className={styles.categoryTag}>
                                        {category ? category.name : 'Unknown'}
                                        <button
                                            onClick={() => handleRemoveCategory(categoryId)}
                                            className={styles.removeCategory}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <button onClick={handleSubmit} className={styles.saveButton}>
                    Сохранить
                </button>
            </div>
        </div>
    );
};

export default EditProfileModal;