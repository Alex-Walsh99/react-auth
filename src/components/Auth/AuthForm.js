import {useRef, useState, useContext, useEffect} from 'react';

import classes from './AuthForm.module.css';
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import {signUpOrLoginWithEmailAndPassword} from "../../lib/auth-api";

const AuthForm = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const [isLogin, setIsLogin] = useState(true);
    const authCtx = useRef(useContext(AuthContext));
    const {sendRequest, status, data} = useHttp(signUpOrLoginWithEmailAndPassword)
    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    useEffect(() => {
        console.log("test")
        if (status === 'completed') {
            const expirationTime = new  Date((new Date().getTime() + (+data.expiresIn * 1000)));
            console.log("set")
            authCtx.current.login(data.idToken, expirationTime.toISOString());
        }
    }, [authCtx, status, data])

    const submitHandler = (event) => {
        event.preventDefault();
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        sendRequest({email: enteredEmail, password: enteredPassword, signUp: !isLogin})
    }
    return (<section className={classes.auth}>
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={submitHandler}>
            <div className={classes.control}>
                <label htmlFor='email'>Your Email</label>
                <input type='email' id='email' ref={emailInputRef} required/>
            </div>
            <div className={classes.control}>
                <label htmlFor='password'>Your Password</label>
                <input type='password' id='password' ref={passwordInputRef} required/>
            </div>
            <div className={classes.actions}>
                {!(status === 'pending') && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
                {(status === 'pending') && <p>{'Sending request...'}</p>}
                <button
                    type='button'
                    className={classes.toggle}
                    onClick={switchAuthModeHandler}
                >
                    {isLogin ? 'Create new account' : 'Login with existing account'}
                </button>
            </div>
        </form>
    </section>);
};

export default AuthForm;
