import {fire} from "../helpers/db.js"
import axios from "axios";
import getToken from "./getToken";

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

// Get user information (displayName, email) given their uid
export async function getUserInfo(uid) {
    const header = await getToken();

    try {
        const res = await axios.get(url + '/' + uid, header);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

// Get current user project information (_id, name, endDate)
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
 * Change current user info
 */
 export async function changeCurrentUserInfo(userInfo) {
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();

    try {
        const res = await axios.put(url + '/' + uid, userInfo, header);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

/**
 * Creates a project using the given projectInfo and adds it to the current user's list of projects
 */
export async function addNewProjectToCurrentUser(projectInfo) {
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();

    try {
        const res = axios.put(url + '/' + uid + '/projects', projectInfo, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Creates an event using the given eventInfo and adds it to the current user's list of events
 */
 export async function addNewEventToCurrentUser(eventInfo) {
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();

    try {
        const res = axios.put(url + '/' + uid + '/events', eventInfo, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}