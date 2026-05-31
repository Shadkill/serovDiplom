import { Link, useNavigate } from 'react-router-dom';
import './style.css'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
const RegistrationPage = () => {
    const [email,setEmail]= useState('');
    const [password,setPassword]= useState('');
    const [repeatPassword,setRepeatpassword]= useState('');
    const [name,setName]= useState('');
    const [surname,setSurname]= useState('');
    const [login,setLogin]= useState('');
    const [category, setCategory] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
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
    const handleSubmit= async(e)=>{
        e.preventDefault();

        const payload = {
            name,
            surname,
            login,
            email,
            password,
            category:selectedCategories, 
            repeatPassword
        }

        try {
            const response =await fetch('http://localhost:5000/api/registerCode',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            if(!response.ok){
                const data = await response.json()
                toast.error(data.message);
                console.log(data.message);
                return;
            }
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            localStorage.setItem('name', name);
            localStorage.setItem('surname', surname);
            localStorage.setItem('login', login);
            localStorage.setItem('category', JSON.stringify(selectedCategories));
            
            const data = await response.json();
            toast.success(data.message);
            navigate('/registerCode')
                
        } catch (error) {
            console.log(error);
        }
    }
    const handleBack = ()=>{

        history.goBack();
    }
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
    })
    return (
        <div className="main_div">
            <div className="div_block_top">
                <img src="../src/assets/images/arrow.svg" alt="" className="arrow" onClick={handleBack}/>
            </div>

            <div className="block_center_register">
                <div className="title_form_top">
                <h2><Link to={'/'}>Авторизация</Link></h2>
                <h2>/</h2>
                <h2>Регистрация</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="div_input">

                    <input type="text" className='input_auth' placeholder='Имя' value={name} onChange={(e)=>setName(e.target.value)} required/>
                    <input type="text" className='input_auth' placeholder='Фамилия' value={surname} onChange={(e)=>setSurname(e.target.value)} required/>
                    <input type="text" className='input_auth' placeholder='Логин' value={login} onChange={(e)=>setLogin(e.target.value)} required/>
                    
                    <input type="email" className='input_auth' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                    <input type="password" className='input_auth' placeholder='Пароль' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                    <input type="password" className='input_auth' placeholder='Повторите пароль' value={repeatPassword} onChange={(e)=>setRepeatpassword(e.target.value)} required/>
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
                        <div  className='div_category'>
                                    <input
                                        type="checkbox"
                                        // Убедитесь, что вы используете уникальные идентификаторы
                                       
                                       
                                        required
                                    />
                                    <label >Согласен на обработку персональных данных</label> {/* Используйте cat.name для отображения */}
                                </div>
                    <button type="submit" className='btn_auth'>Войти</button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}

export default RegistrationPage;
