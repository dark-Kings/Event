import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import posterImage from './banner.jpg';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        navigate('/home', { state: { username } });
    };

    return (
        <div className="container-fluid vh-100 p-0">
            <div className="row h-100 m-0">
                <div className="col-md-12 p-0">
                    <div
                        className="h-100 d-flex align-items-center justify-content-start"
                        style={{
                            backgroundImage: `url(${posterImage})`,
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            position: 'relative',
                        }}
                    >
                        <div className="w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                            <div className="w-100 h-100 d-flex align-items-center justify-content-start">
                                <form onSubmit={handleLogin} className="p-5 bg-white rounded shadow" style={{ marginLeft: '1rem' }}>
                                    <h2 className="mb-4">Login</h2>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">User Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary position-absolute  end-0 translate-middle-y"
                                            style={{ top: "50px" }}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? '༗' : '👁'}
                                        </button>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Login</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
