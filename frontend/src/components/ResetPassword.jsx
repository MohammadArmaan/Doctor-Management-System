import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Alert from "./Alerts";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const { user, token } = useParams();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            console.log("User selected:", user);
            const res = await axios({
                method: "PATCH",
                url: `/api/v1/${user}/resetPassword/${token}`,
                data: {
                    password,
                    passwordConfirm
                },
            });
            if (res.status === 200) {
                setAlertType('success');
                setAlertMessage('Pasword Changed Successfully');
                setTimeout(() => {
                    window.location.assign("/login");
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
                <h2 className="heading__secondary">Reset your Password</h2>
                <form className="form form--resetPassword" onSubmit={handleResetPassword}>
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
                            Password
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
                    <input type="hidden" id="reset-token" value={token}></input>
                    <div className="form__group">
                        <button className="btn form__btn" type="submit">
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ResetPassword;
