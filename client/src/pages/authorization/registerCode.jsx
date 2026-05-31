import { Link,useNavigate } from 'react-router-dom';
import './style.css'
import { useState } from 'react';
import toast from 'react-hot-toast';
const RegisterCode = () => {
    const [code, setCode] = useState('');
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    const surname = localStorage.getItem('surname');
    const name = localStorage.getItem('name');
    const category = JSON.parse(localStorage.getItem('category'));
    const login = localStorage.getItem('login');
    const navigate = useNavigate();
    const handleSubmit= async(e)=>{
        e.preventDefault();

        const payload = {
            email,
            password,
            code,
            surname,
            name,
            category,
            login
        }

        try {
            const response =await fetch('http://localhost:5000/api/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            if(!response.ok){
                const data = await response.json()
                toast.error(data.message);
                return;
            }
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            localStorage.removeItem('name');
            localStorage.removeItem('surname');
            localStorage.removeItem('login');
            localStorage.removeItem('category');
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            toast.success(data.message);
            navigate('/news')
                
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="main_div">
            <div className="div_block_top">
                <img src="../src/assets/images/arrow.svg" alt="" className="arrow" />
            </div>

            <div className="block_center_register">
                <form onSubmit={handleSubmit}>
                    <div className="div_input">

                    
                    <input type="text" className='input_auth' placeholder='Код с почты' value={code} onChange={(e)=>setCode(e.target.value)}/>
                    <button type="submit" className='btn_auth'>Войти</button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}

export default RegisterCode;
