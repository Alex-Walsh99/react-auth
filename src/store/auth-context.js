import React, {useCallback, useEffect, useState} from "react";
import {cleanup} from "@testing-library/react";

let logoutTimer;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {
    },
    logout: () => {
    }
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjExpirationTime - currentTime;

    return remainingDuration;
}

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expiration-time');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if(remainingTime <= 0) {
        localStorage.removeItem('key');
        localStorage.removeItem('expiration-time')
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime
    };
}

export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();

    let initToken;
    if(tokenData)
        initToken = tokenData.token

    const [token, setToken] = useState(initToken);

    const userIsLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        if(logoutTimer){
            clearTimeout(logoutTimer);
        }
    },[]);

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expiration-time', expirationTime)

        //log user out after auth token time expires
        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime)
    };

    useEffect(()=>{
        if(tokenData){
            logoutTimer = setTimeout(logoutHandler, tokenData.duration)
        }
    },[logoutHandler, tokenData])

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>;
}

export default AuthContext;