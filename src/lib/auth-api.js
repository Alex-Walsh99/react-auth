const API_KEY = 'AIzaSyCsOOtGhI8G1lcxQLirnF6cshm9ZbsDn60';

export async function signUpOrLoginWithEmailAndPassword(requestData) {
    let url;
    if (requestData.signUp)
        url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
    if (!requestData.signUp)
        url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="

    url = url + API_KEY;

    const response = await fetch(url,
        {
            method: "POST",
            body: JSON.stringify({
                email: requestData.email,
                password: requestData.password,
                returnSecureToken: true
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
    const data = await response.json();
    try {
        if (!response.ok)
            throw new Error(data.error.message || 'Could not process request.');
        return {
            idToken: data.idToken,
            expiresIn: data.expiresIn
        };
    } catch (err) {
        alert(err);
    }
}

export const changePassword = async (requestData) => {
    let url = "https://identitytoolkit.googleapis.com/v1/accounts:update?key="
    url = url + API_KEY;
    const response = await fetch(url,
        {
            method: "POST",
            body: JSON.stringify({
                idToken: requestData.idToken,
                password: requestData.password,
                returnSecureToken: false
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
    const data = await response.json();
    try {
        if (!response.ok)
            throw new Error(data.error.message || 'Could not process request.');
        return data.idToken;
    } catch (err) {
        alert(err);
    }

}