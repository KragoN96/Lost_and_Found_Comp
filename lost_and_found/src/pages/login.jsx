import {useState} from 'react';
import{Link, useNavigate} from 'react-router-dom';
import '../styles/CSS/login.css';

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        //Add login logic here
        console.log('Login attempted:', {email, password});
        //Navigate to home page on successful login
        navigate('/home-page');
    };
    
    return(
        <main className="login-page">
            <section className="login-container">
                <div className="login-welcome-message">
                    <h3> City Universities </h3>
                    <h2> Lost &amp; Found </h2>
                    <h3> Login </h3>
                </div>

                <form className="credentials-input" onSubmit={handleSubmit} noValidate>
                    <label htmlFor="email"> Email Address </label>
                    <input 
                        type="email" 
                        id="email"
                        className="email-input" 
                        name="email"
                        autoComplete="email"
                        placeholder="your@university.edu" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />

                    <label htmlFor="passworrd"> Password </label>
                    <input
                        type="password"
                        id="password"
                        className="password-input"
                        name="password"
                        autoComplete="current-password"
                        placeholder="........."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="forgot-password-link">
                        <Link to="/forgot-password"> Forgot Password? </Link>
                    </div>
                    
                    <div className="register-link">
                        <Link to="/register"> Don't have an account?</Link>
                    </div>
                </form>

                <div className="loginbt">
                <button className="login-submit-button" onClick={handleSubmit}>
                    Login
                </button>
                </div>
            </section>
        </main>
    );
}

export default Login;