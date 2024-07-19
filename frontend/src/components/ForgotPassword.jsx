import { useState } from "react";
import axios from "axios";
import Alert from "./Alerts";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [user, setUser] = useState("");
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            console.log("User selected:", user);
            const res = await axios({
                method: "POST",
                url: `/api/v1/${user}/forgotPassword`,
                data: {
                    email,
                },
            });
            if (res.status === 200) {
                setAlertType('success');
                setAlertMessage('Email Sent!');
                window.setTimeout(() => {
                    location.reload();
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
            <div className="forgetPassword__form">
                <h2 className="heading__secondary">Forgot your password?</h2>
                <form className="form form--forgotPassword" onSubmit={handleForgotPassword}>
                    <div className="form__group">
                        <p className="forgotPassword__text">
                        Forgot your password? If you have forgot your password then plase
                         mention your email id we will help you reset your password
                        </p>
                    </div>
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
                        <button className="btn form__btn" type="submit">
                            Send Email
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ForgotPassword;
