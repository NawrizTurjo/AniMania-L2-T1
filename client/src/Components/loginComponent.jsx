import React, { useEffect } from 'react';
import './loginCom.css';

export default function LoginComponent() {
    useEffect(() => {
        // Add class to body when component mounts
        document.body.classList.add('login-page');
        return () => {
            // Remove class from body when component unmounts
            document.body.classList.remove('login-page');
        };
    }, []);

    return (
        <div className="login-container">
            <div className="wrapper login-body">
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required />
                        <i className='bx bxs-user'></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required />
                        <i className='bx bxs-lock-alt'></i>
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox" />Remember Me</label>
                        <a href="#">Forgot Password</a>
                    </div>
                    <button type="submit" className="btn">Login</button>
                    <div className="register-link">
                        <p>Dont have an account? <a href="#">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};
