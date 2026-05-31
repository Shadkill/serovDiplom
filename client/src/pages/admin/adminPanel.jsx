import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Home from '../Home/Home';
import './style.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const [name, setName] = useState('');
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [bannedEmails, setBannedEmails] = useState(new Set());

    // Получаем категории из API и пользователей
    useEffect(() => {
        const getCategory = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/category', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    const data = await response.json();
                    toast.error(data.message);
                    return;
                }

                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error(error);
                toast.error('Ошибка при загрузке категорий');
            }
        };

        const getUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getUsers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    const data = await response.json();
                    toast.error(data.message);
                    return;
                }

                const data = await response.json();
                setUsers(data);

                // Получаем заблокированные email-адреса
                const bannedResponse = await fetch('http://localhost:5000/api/getBannedEmails', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                const bannedData = await bannedResponse.json();
                setBannedEmails(new Set(bannedData.map(email => email.email))); // Преобразуем массив в Set для удобства проверки
            } catch (error) {
                console.error(error);
                toast.error('Ошибка при загрузке пользователей');
            }
        };

        getUsers();
        getCategory();
    }, [token]);

    // Проверка авторизации пользователя
    useEffect(() => {
        if (!token) {
            toast.error('Вы не авторизованы!');
            navigate('/news');
            return;
        }
        if (role === 'user') {
            toast.error('Доступ запрещён!');
            navigate('/news');
            return;
        }
    }, [token, role, navigate]);

    // Функция для добавления новой категории
    const addCategory = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/createCategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message);
                return;
            }

            const data = await response.json();
            toast.success(data.message);
            setCategories((prev) => [...prev, { _id: data.category._id, name }]); // Добавляем новую категорию в состояние
            setName(''); // Сбрасываем поле ввода
        } catch (error) {
            console.error(error);
            toast.error('Ошибка при добавлении категории');
        }
    };

    // Функция для редактирования категории
    const handleEdit = (category) => {
        setEditId(category._id);
        setEditName(category.name);
    };

    // Функция для сохранения редактированной категории
    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/updateCategory/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: editName })
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message);
                return;
            }

            const updatedCategories = categories.map(category =>
                category._id === editId ? { ...category, name: editName } : category
            );
            setCategories(updatedCategories);
            setEditId(null);
            setEditName('');
            toast.success('Категория успешно обновлена');
        } catch (error) {
            console.error(error);
            toast.error('Ошибка при обновлении категории');
        }
    };

    // Функция для блокировки пользователя
    const handleBan = async (email) => {
        try {
            const response = await fetch('http://localhost:5000/api/banUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message);
                return;
            }

            setBannedEmails(prev => new Set(prev.add(email))); // Добавляем email в набор заблокированных
            toast.success('Пользователь заблокирован');
        } catch (error) {
            console.error(error);
            toast.error('Ошибка при блокировке пользователя');
        }
    };

    // Функция для разблокировки пользователя
    const handleUnban = async (email) => {
        try {
            const response = await fetch('http://localhost:5000/api/unbanUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message);
                return;
            }

            setBannedEmails(prev => {
                const newSet = new Set(prev);
                newSet.delete(email); // Удаляем email из набора заблокированных
                return newSet;
            });
            toast.success('Пользователь разблокирован');
        } catch (error) {
            console.error(error);
            toast.error('Ошибка при разблокировке пользователя');
        }
    };

    return (
        <>
            <Header />
            <main className="home-container">
                <Home />
                <div className="content-container">
                    <h1 className='title_admin'>Панель администрации</h1>
                    <div className="div_category_admin">
                        <h2 className='title_admin' style={{ marginTop: '2vw' }}>Категории</h2>
                        <form onSubmit={addCategory}>
                            <div className="category_add">
                                <label htmlFor="">Создать новую категорию</label>
                                <input
                                    type="text"
                                    placeholder='Название'
                                    className='input_auth1'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <button type="submit" className='btn_auth1'>Добавить</button>
                            </div>
                        </form>
                        <div className='div_table'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>Категории</th>
                                        <th>Управление</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category, index) => (
                                        <tr key={category._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {editId === category._id ? (
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className='inpt'
                                                    />
                                                ) : (
                                                    category.name
                                                )}
                                            </td>
                                            <td>
                                                {editId === category._id ? (
                                                    <>
                                                        <button onClick={handleSave} className='btn'>Сохранить</button>
                                                        <button onClick={() => setEditId(null)} className='btn'>Отмена</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleEdit(category)} className='btn'>Редактировать</button>
                                                        <button onClick={() => handleDelete(category._id)} className='btn'>Удалить</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='div_table'>
                        <h2 className='title_admin' style={{ paddingBottom: '2vw' }}>Пользователи</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Пользователи</th>
                                    <th>Управление</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <p>{user.name}</p>
                                            <p>{user.surname}</p>
                                        </td>
                                        <td>
                                            {bannedEmails.has(user.email) ? (
                                                <button onClick={() => handleUnban(user.email)} className='btn'>Разбанить</button>
                                            ) : (
                                                <button onClick={() => handleBan(user.email)} className='btn'>Забанить</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AdminPanel;