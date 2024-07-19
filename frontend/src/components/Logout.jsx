/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/Logout.jsx

import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Alert from "./Alerts";

const Logout = ({ setUser }) => {
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const handleLogout = async () => {
        try {
            const apiUrl = 'https://doctor-management-system-backend.vercel.app';

            // const patientLogout = axios.get("/api/v1/patients/logout", {
            //     withCredentials: true,
            // });
            const patientLogout = axios.get(`${apiUrl}/api/v1/patients/logout`, {
                withCredentials: true,
            });
            // const doctorLogout = axios.get(`/api/v1/doctors/logout`, {
            //     withCredentials: true,
            // });
            const doctorLogout = axios.get(`${apiUrl}/api/v1/doctors/logout`, {
                withCredentials: true,
            });

            const results = await Promise.allSettled([
                patientLogout,
                doctorLogout,
            ]);

            const success = results.some(
                (result) => result.status === "fulfilled"
            );

            if (success) {
                setUser(null);
                setAlertType("success");
                setAlertMessage("Logged out successfully!");
                window.setTimeout(() => {
                    location.assign("/login");
                }, 1000);
            } else {
                setAlertType("error");
                setAlertMessage("Cannot logout at this moment!");
            }
        } catch (err) {
            setAlertType("error");
            setAlertMessage("An error occurred while logging out.");
            console.error("Logout error:", err);
        }
    };

    return (
        <>
            <Link
                className="nav__links logout__link"
                to="#"
                onClick={handleLogout}
            >
                Logout
            </Link>
            <main className="main">
                {alertType && <Alert type={alertType} message={alertMessage} />}
            </main>
        </>
    );
};

export default Logout;
