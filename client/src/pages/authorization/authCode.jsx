import { Link,useNavigate } from 'react-router-dom';
import './style.css'
import { useState } from 'react';
import toast from 'react-hot-toast';
const AuthCode = () => {
    const [code, setCode] = useState('');
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    const navigate = useNavigate();
    const handleSubmit= async(e)=>{
        e.preventDefault();

        const payload = {
            email,
            password,
            code
        }

        try {
            const response =await fetch('http://localhost:5000/api/login',{
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

export default AuthCode;
