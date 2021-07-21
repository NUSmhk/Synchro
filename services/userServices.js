import fire from "../helpers/db.js"
import axios from "axios";
import getToken from "../getToken";

const url = 'http://localhost:3001/api/users';

// Create user 
export async function createUser(displayName) {
    const user = fire.auth().currentUser;
    const uid = user.uid;
    const email = user.email;

    const header = await getToken();
    const payload = {
        uid: uid, 
        displayName: displayName,
        email: email
    }

    try {
        const res = await axios.post(url, payload, header);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

// Get user information given their uid: displayName, email, uid
export async function getUserInfo(uid) {
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();

    try {
        const res = await axios.get(url + '/' + uid, header);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

// Get current user projects
export async function getCurrentUserProjects() {
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();

    try {
        const res = await axios.get(url + '/' + uid + '/projects', header);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

// Get current user events
export async function getCurrentUserEvents() {
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();

    try {
        const res = await axios.get(url + '/' + uid + '/events', header);
        return res.data;
    } catch (err) {
        console.error(err);
    }

}

/**
 * Change user info. Set payload.email and/or payload.displayName
 */
 export async function changeCurrentUserInfo(payload) {
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();

    try {
        const res = await axios.post(url + '/' + uid, payload, header);
        return res.data;
    } catch (err) {
        console.error(err);
    }

}

/**
 * Adds the given projectId to the user's list of projects
 */
export async function addProjectToUser(projectId) {
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();
    const payload = {
        projectId: projectId
    }

    try {
        const res = axios.put(url + '/' + uid + '/projects', payload, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Adds the given event to the user's list of events
 */
 export async function addEventToUser(event) {
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();
    const payload = {
        event: event
    }

    try {
        const res = axios.put(url + '/' + uid + '/events', payload, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}