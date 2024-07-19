/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import Alert from "./Alerts";

const DoctorPatientLink = ({ user }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const handleDoctorPatientLink = async (e) => {
        e.preventDefault();
        try {
        const apiUrl = 'https://doctor-management-system-backend.vercel.app';
        
            const res = await axios({
                method: "POST",
                // url: `/api/v1/doctorPatient`,
                url: `${apiUrl}/api/v1/doctorPatient`,
                data: {
                    name,
                    email,
                },
            });
            if (res.status === 201) {
                setAlertType('success');
                setAlertMessage('Patient Linked successfully!');
                window.setTimeout(() => {
                    location.reload();
                }, 1500);
            }
        } catch (err) {
            setAlertType('error');
            setAlertMessage(err.message);
        }
        if (!user || user.id.role !== "doctor") {
            return( 
              <main className='main'>
                <section className='section'>
                  <p className='login__warning'>You must be logged in as a doctor to upload files!</p>
                  <a href='/login' className='warning__link login__link'>Login/Signup as Doctor</a>
                </section>
              </main>
              );
          }
    };

    return (
        <main className="main">
            {alertType && <Alert type={alertType} message={alertMessage} />}
            <div className="login__form">
                <h2 className="heading__secondary">Link Patient</h2>
                <form className="form form--login" onSubmit={handleDoctorPatientLink}>
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
                        <button className="btn form__btn" type="submit">
                            Link Patient
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default DoctorPatientLink;
