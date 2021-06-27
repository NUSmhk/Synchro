import firebase from "firebase";

// Best way? Check firebase docs?
async function getToken() {
    const user = firebase.auth().currentUser;
    const token = user && (await user.getIdToken());

    // Bearer - refers to token-based authentication
    const payloadHeader = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }, 
    };

    return payloadHeader;
}

export default getToken;