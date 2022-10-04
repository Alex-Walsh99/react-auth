import classes from './ProfileForm.module.css';
import {useRef, useContext, useEffect} from "react";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import {changePassword} from "../../lib/auth-api";
import {useHistory} from "react-router-dom";


const ProfileForm = () => {
    const newPasswordInputRef = useRef();
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    const {sendRequest, status} = useHttp(changePassword)


    useEffect(() => {
        if (status === 'completed') {
            history.replace('/');
        }
    }, [status, history])

    const submitHandler = (event) => {
        event.preventDefault()
        const enteredPassword = newPasswordInputRef.current.value;
        sendRequest({idToken: authCtx.token, password:enteredPassword})
    }

    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.control}>
                <label htmlFor='new-password'>New Password</label>
                <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef}/>
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
}

export default ProfileForm;
