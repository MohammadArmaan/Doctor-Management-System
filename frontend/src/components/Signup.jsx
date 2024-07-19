import { useState } from "react";
import axios from "axios";
import Alert from "./Alerts";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [user, setUser] = useState("");
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const data = {
                name,
                email,
                password,
                passwordConfirm, // Fixed typo
            };
            if (user === 'doctors') {
                data.specialty = specialty;
            }

            const res = await axios.post(`/api/v1/${user}/signup`, data);

            console.log(res); 
            if (res.status === 201) {
                setAlertType('success');
                setAlertMessage('Account created successfully!');
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
        <main className="main__signup">
            {alertType && <Alert type={alertType} message={alertMessage} />}
            <div className="signup__form">
                <h2 className="heading__secondary">Create your account</h2>
                <form className="form form--signup" onSubmit={handleSignup}>
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
                        <label className="form__label" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="form__input"
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Mohammad Armaan"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
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
                    <div className="form__group">
                        <label className="form__label" htmlFor="password-confirm">
                            Password Confirm
                        </label>
                        <input
                            className="form__input"
                            id="password-confirm"
                            type="password"
                            name="password-confirm"
                            placeholder="••••••••"
                            minLength="8"
                            required
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </div>
                    {user === 'doctors' && ( // Conditionally render based on user type
                        <div className="form__group">
                            <label className="form__label" htmlFor="specialty">
                                Specialty
                            </label>
                            <input
                                className="form__input"
                                id="specialty"
                                type="text"
                                name="specialty"
                                placeholder="Your specialty"
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form__group">
                        <button className="btn form__btn" type="submit">
                            Sign UP
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Signup;
