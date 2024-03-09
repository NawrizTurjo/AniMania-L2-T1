import React, { useEffect } from 'react';
import './signUpCom.css'; // Import the CSS file for SignUp

export default function SignUpComponent() {
    useEffect(() => {
        // Add class to body when component mounts
        document.body.classList.add('sign-up-page');
        return () => {
            // Remove class from body when component unmounts
            document.body.classList.remove('sign-up-page');
        };
    }, []);

    return (
        <div className="sign-up-container">
            <div className="wrapper sign-up-body">
                <form action="">
                    <h1>Sign Up</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required />
                        <i className='bx bxs-user'></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required />
                        <i className='bx bxs-lock-alt'></i>
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder="Email" required />
                        <i className='bx bxs-envelope'></i>
                    </div>
                    <button type="submit" className="btn">Sign Up</button>
                    <div className="login-link">
                        <p>Already have an account? <a href="#">Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};