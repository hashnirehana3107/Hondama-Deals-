import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { user, login, loginWithGoogle, loginWithFacebook, sendLoginOTP, verifyLoginOTP, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [logMessage, setLogMessage] = useState(null);

    // Redirect if already logged in
    React.useEffect(() => {
        if (!loading && user) {
            const r = user.role?.toLowerCase() || '';
            if (r === 'admin') navigate('/admin/dashboard');
            else if (['seller', 'client', 'business account', 'partner'].includes(r)) navigate('/client/dashboard');
            else navigate('/');
        }
    }, [user, loading, navigate]);
    
    // OTP State
    const [loginType, setLoginType] = useState('password'); // 'password' or 'otp'
    const [otpCode, setOtpCode] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    // Countdown logic
    React.useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown(c => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleGoogleClick = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setLogMessage(null);
            try {
                const user = await loginWithGoogle({ access_token: tokenResponse.access_token });
                setIsLoading(false);
                setLogMessage({ type: 'success', text: 'Google Login successful!' });

                setTimeout(() => {
                    const r = user.role?.toLowerCase() || '';
                    if (r === 'seller' || r === 'client' || r === 'business account' || r === 'partner') navigate('/client/dashboard');
                    else if (r === 'admin') navigate('/admin/dashboard');
                    else navigate('/');
                }, 1000);
            } catch (error) {
                setIsLoading(false);
                setLogMessage({ type: 'error', text: error.message });
            }
        },
        onError: () => {
            setLogMessage({ type: 'error', text: 'Google setup window closed or failed.' });
        }
    });

    const handleFacebookResponse = async (response) => {
        if (!response.accessToken) return;
        
        setIsLoading(true);
        setLogMessage(null);
        try {
            const user = await loginWithFacebook({ accessToken: response.accessToken });
            setIsLoading(false);
            setLogMessage({ type: 'success', text: 'Facebook Login successful!' });

            setTimeout(() => {
                const r = user.role?.toLowerCase() || '';
                if (r === 'seller' || r === 'client' || r === 'business account' || r === 'partner') navigate('/client/dashboard');
                else if (r === 'admin') navigate('/admin/dashboard');
                else navigate('/');
            }, 1000);
        } catch (error) {
            setIsLoading(false);
            setLogMessage({ type: 'error', text: error.message });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLogMessage(null);

        try {
            if (loginType === 'password') {
                const user = await login(email, password);
                setIsLoading(false);
                setLogMessage({ type: 'success', text: 'Login successful!' });
                
                setTimeout(() => {
                    const r = user.role?.toLowerCase() || '';
                    if (r === 'seller' || r === 'client' || r === 'business account' || r === 'partner') navigate('/client/dashboard');
                    else if (r === 'admin') navigate('/admin/dashboard');
                    else navigate('/');
                }, 1000);
            } else {
                if (!isOtpSent) {
                    await sendLoginOTP(email);
                    setIsOtpSent(true);
                    setCooldown(60);
                    setIsLoading(false);
                    setLogMessage({ type: 'success', text: 'Login code sent to your email. It might take a minute.' });
                } else {
                    if (!otpCode) {
                        setLogMessage({ type: 'error', text: 'Please enter the OTP.' });
                        setIsLoading(false);
                        return;
                    }
                    const user = await verifyLoginOTP(email, otpCode);
                    setIsLoading(false);
                    setLogMessage({ type: 'success', text: 'Logged in successfully via OTP!' });

                    setTimeout(() => {
                        const r = user.role?.toLowerCase() || '';
                        if (r === 'seller' || r === 'client' || r === 'business account' || r === 'partner') navigate('/client/dashboard');
                        else if (r === 'admin') navigate('/admin/dashboard');
                        else navigate('/');
                    }, 1000);
                }
            }
        } catch (error) {
            setIsLoading(false);
            setLogMessage({ type: 'error', text: error.message });
        }
    };

    const handleResendOTP = async () => {
        if (cooldown > 0) return;
        setIsLoading(true);
        setLogMessage(null);
        try {
            await sendLoginOTP(email);
            setCooldown(60);
            setLogMessage({ type: 'success', text: 'New login code sent!' });
        } catch (error) {
            setLogMessage({ type: 'error', text: error.message });
        }
        setIsLoading(false);
    };

    return (
        <div className="login-page-wrapper">
            <div className="hd-login-card">
                <div className="hd-login-content">
                    
                    <div className="hd-login-header">
                        <h1>Welcome Back!</h1>
                        <p>Sign in to your Hodama Deals account.</p>
                    </div>

                    {logMessage && (
                        <div className={`message-banner ${logMessage.type}`} style={{ 
                            padding: '15px', 
                            borderRadius: '8px', 
                            marginBottom: '30px',
                            backgroundColor: logMessage.type === 'error' ? '#FFF5F5' : '#F0FFF4',
                            color: logMessage.type === 'error' ? '#C53030' : '#2F855A',
                            textAlign: 'center',
                            border: `1px solid ${logMessage.type === 'error' ? '#FEB2B2' : '#9AE6B4'}`,
                            fontWeight: '600'
                        }}>
                            {logMessage.text}
                        </div>
                    )}

                    <form className="hd-login-form" onSubmit={handleLogin}>
                        {/* Toggle Buttons */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <button
                                type="button"
                                onClick={() => { setLoginType('password'); setIsOtpSent(false); }}
                                style={{
                                    flex: 1, padding: '10px', border: '1px solid #e2e8f0',
                                    borderRadius: '6px', background: loginType === 'password' ? '#F4F7FE' : '#fff',
                                    color: loginType === 'password' ? '#1D3182' : '#718096',
                                    fontWeight: loginType === 'password' ? '700' : '500', cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Password
                            </button>
                            <button
                                type="button"
                                onClick={() => { setLoginType('otp'); }}
                                style={{
                                    flex: 1, padding: '10px', border: '1px solid #e2e8f0',
                                    borderRadius: '6px', background: loginType === 'otp' ? '#F4F7FE' : '#fff',
                                    color: loginType === 'otp' ? '#1D3182' : '#718096',
                                    fontWeight: loginType === 'otp' ? '700' : '500', cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Magic Link / OTP
                            </button>
                        </div>

                        <div className="hd-input-group">
                            <label className="hd-label">Email Address</label>
                            <div className="hd-input-wrapper">
                                <input
                                    type="email"
                                    className="hd-login-input"
                                    placeholder="e.g. kamal@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading || (loginType === 'otp' && isOtpSent)}
                                />
                            </div>
                        </div>

                        {loginType === 'password' ? (
                            <>
                                <div className="hd-input-group">
                                    <label className="hd-label">Password</label>
                                    <div className="hd-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="hd-login-input"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <div className="hd-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                        </div>
                                    </div>
                                    <p className="forgot-password-link">
                                        <Link to="/forgot-password" style={{ color: '#1D3182', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
                                            Forgot Password?
                                        </Link>
                                    </p>
                                </div>

                                <div className="hd-login-options">
                                    <label className="hd-remember-me">
                                        <input type="checkbox" disabled={isLoading} />
                                        Remember Me
                                    </label>
                                    <Link to="/forgot-password" className="hd-forgot-password">Forgot Password?</Link>
                                </div>
                            </>
                        ) : (
                            isOtpSent && (
                                <div className="hd-input-group" style={{ marginTop: '20px' }}>
                                    <label className="hd-label" style={{ color: '#2F855A', fontWeight: 'bold' }}>Enter 6-Digit Code</label>
                                    <div className="hd-input-wrapper">
                                        <input
                                            type="text"
                                            className="hd-login-input"
                                            placeholder="000000"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value)}
                                            maxLength={6}
                                            required
                                            disabled={isLoading}
                                            style={{ fontSize: '20px', letterSpacing: '8px', textAlign: 'center', fontWeight: '600' }}
                                        />
                                    </div>
                                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                        <button 
                                            type="button" 
                                            onClick={handleResendOTP} 
                                            disabled={cooldown > 0 || isLoading}
                                            style={{ background: 'none', border: 'none', color: cooldown > 0 ? '#A0AEC0' : '#1D3182', cursor: cooldown > 0 ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px' }}
                                        >
                                            {cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Code'}
                                        </button>
                                    </div>
                                </div>
                            )
                        )}

                        <button
                            type="submit"
                            className="hd-login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : (
                                loginType === 'password' ? 'LOG IN TO MY ACCOUNT' : 
                                (isOtpSent ? 'VERIFY CODE & LOGIN' : 'SEND LOGIN CODE')
                            )}
                        </button>
                        
                        {loginType === 'otp' && (
                            <p style={{ textAlign: 'center', fontSize: '13px', color: '#718096', marginTop: '15px', lineHeight: '1.4' }}>
                                We'll send a 6-digit secure code to your email. <br/>If you don't have an account, it will be automatically created!
                            </p>
                        )}
                    </form>

                    <div className="hd-social-divider">
                        <div className="hd-divider-line"></div>
                        <span className="hd-divider-text">or Sign in with</span>
                        <div className="hd-divider-line"></div>
                    </div>

                    <div className="hd-social-icons">
                        {/* Google Icon */}
                        <div className="hd-social-icon" onClick={() => handleGoogleClick()} style={{ cursor: 'pointer', opacity: isLoading ? 0.5 : 1 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="45px" height="45px">
                                <path fill="#FFC107" d="M43.611 20.083c.35 1.571.556 3.222.556 4.917 0 11.046-8.954 20-20 20S4.167 36.046 4.167 25c0-11.046 8.954-20 20-20 5.418 0 10.323 2.146 13.911 5.617L31.812 16.89C29.673 14.881 26.83 13.667 23.667 13.667c-6.262 0-11.333 5.071-11.333 11.333s5.071 11.333 11.333 11.333c4.156 0 7.788-2.235 9.803-5.583l-9.803-.001v-10.666h20.144z"/>
                                <path fill="#FF3D00" d="M6.306 14.691L13.842 20.35C15.684 16.393 19.782 13.667 24.5 13.667c3.161 0 6.002 1.213 8.139 3.223l6.545-6.545C34.823 6.146 29.917 4 24.5 4c-7.901 0-14.717 4.354-18.194 10.691z"/>
                                <path fill="#4CAF50" d="M24.5 44c5.166 0 9.86-1.977 13.414-5.195l-6.422-6.422C29.679 34.346 27.214 35.333 24.5 35.333c-5.264 0-9.814-3.411-11.411-8.125l-7.771 5.959C8.784 39.537 16.113 44 24.5 44z"/>
                                <path fill="#1976D2" d="M43.611 20.083H24.5v10.667h10.315c-.808 2.044-2.221 3.751-4 4.883l6.422 6.422C41.366 38.648 44 32.148 44 25c0-1.695-.206-3.346-.556-4.917z"/>
                            </svg>
                        </div>

                        {/* Facebook Icon */}
                        <FacebookLogin
                            appId={import.meta.env.VITE_FACEBOOK_APP_ID || "2821689264667104"} // dummy fallback to avoid crash
                            onSuccess={handleFacebookResponse}
                            onFail={(error) => {
                                console.error('Facebook Login Failed!', error);
                                setLogMessage({ type: 'error', text: 'Facebook Login failed or cancelled.' });
                            }}
                            render={({ onClick }) => (
                                <div className="hd-social-icon" onClick={onClick} style={{ cursor: 'pointer', opacity: isLoading ? 0.5 : 1 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="45px" height="45px">
                                        <circle cx="24" cy="24" r="23" fill="#1877F2"/>
                                        <path fill="#fff" d="M30 16h-3c-1.3 0-2 .6-2 1.8V21h5l-.6 5H25v13h-5V26h-3v-5h3v-3.7c0-3 1.9-4.3 4.8-4.3 1.4 0 2.6.1 3 .1V16z"/>
                                    </svg>
                                </div>
                            )}
                        />
                    </div>

                    <div className="hd-login-footer">
                        New to Hodama Deals?
                        <Link to="/register">Create an Account</Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;

