import firebase from "firebase";

async function getToken() {
    const user = firebase.auth().currentUser;
    const token = user && (await user.getIdToken());

    const payloadHeader = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }, 
    };

    return payloadHeader;
}

export default getToken;