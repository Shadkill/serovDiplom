
import { Link, useNavigate } from 'react-router-dom';
import './style.css'
import { useState } from 'react';
import toast from 'react-hot-toast';
const AuthorizationPage = () => {
    const [email,setEmail]= useState('');
    const [password,setPassword]= useState('');
    const navigate = useNavigate();
    const handleSubmit= async(e)=>{
        e.preventDefault();

        const payload = {
            email,
            password
        }

        try {
            const response =await fetch('http://localhost:5000/api/loginCode',{
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
            const data = await response.json();
            toast.success(data.message);
            navigate('/authCode')
                
        } catch (error) {
            console.log(error);
        }
    }
    const handleBack = ()=>{

        history.goBack();
    }
    return (
        <div className="main_div">
            <div className="div_block_top">
                <img src="../src/assets/images/arrow.svg" alt="" className="arrow" onClick={handleBack}/>
            </div>

            <div className="block_center_register">
                <div className="title_form_top">
                <h2>Авторизация</h2>
                <h2>/</h2>
                <h2><Link to={'/register'}>Регистрация</Link></h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="div_input">

                    
                    <input type="email" className='input_auth' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <input type="password" className='input_auth' placeholder='Пароль' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <button type="submit" className='btn_auth'>Войти</button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}

export default AuthorizationPage;
