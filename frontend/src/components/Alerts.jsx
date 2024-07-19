/* eslint-disable react/prop-types */
import{ useState, useEffect } from 'react';


const Alert = ({ type, message }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        isVisible && (
            <div className={`alert alert--${type}`}>
                <p className="alert__message">{message}</p>
            </div>
        )
    );
};


export default Alert;
