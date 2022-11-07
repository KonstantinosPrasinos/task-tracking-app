import {useContext, useState} from "react";
import {AlertsContext} from "../context/AlertsContext";

export function useVerify() {
    const [isLoading, setIsLoading] = useState(false);
    const alertsContext = useContext(AlertsContext);

    const verifyPassword = () => {
        return true
    }

    const verifyEmail = async (email, code) => {
        setIsLoading(true);

        const response = await fetch('http://localhost:5000/api/verify/email', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, code}),
            credentials: 'include'
        });

        if (!response.ok) {
            const data = await response.json();
            alertsContext.dispatch({type: "ADD_ALERT", payload: {type: "error", message: data.message}});
            setIsLoading(false);
            return false;
        } else {
            alertsContext.dispatch({type: "ADD_ALERT", payload: {type: "success", message: "Account created successfully"}});
            setIsLoading(false);
            return true;
        }
    }

    return {verifyPassword, verifyEmail, isLoading}
}