import { useState } from "react";
import axios from "axios";
import Alert from "./Alerts";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState("");
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        const apiUrl = 'https://doctor-management-system-backend.vercel.app';
        
            const res = await axios({
                method: "POST",
                // url: `/api/v1/${user}/login`,
                url: `${apiUrl}/api/v1/${user}/login`,
                data: {
                    email,
                    password,
                },
            });
            if (res.status === 200) {
                setAlertType('success');
                setAlertMessage('Logged in successfully!');
                setTimeout(() => {
                    window.location.assign("/");
                }, 1500);
            }
        } catch (err) {
            setAlertType('error');
            setAlertMessage(err.message);
        }
    };

    return (
        <main className="main">
            {alertType && <Alert type={alertType} message={alertMessage} />}
            <div className="login__form">
                <h2 className="heading__secondary">Log into your account</h2>
                <form className="form form--login" onSubmit={handleLogin}>
                    <div className="form__group">
                        <label className="form__label" htmlFor="users">
                            User
                        </label>
                        <select
                            className="form__select"
                            name="user"
                            id="users"
                            defaultValue={''}
                            onChange={(e) => setUser(e.target.value)}
                        >
                            <option value="" disabled >
                                Select user type
                            </option>
                            <option value="doctors">Doctor</option>
                            <option value="patients">Patient</option>
                        </select>
                    </div>
                    <div className="form__group">
                        <label className="form__label" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="form__input"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="form__input"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            minLength="8"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form__group form__links">
                        <a className="form__link signup" href="/signup">
                            New member, then Sign up!
                        </a>
                        <a
                            className="form__link forgot-password"
                            href="/forgotPassword"
                        >
                            Forgot Password?
                        </a>
                    </div>
                    <div className="form__group">
                        <button className="btn form__btn" type="submit">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;
