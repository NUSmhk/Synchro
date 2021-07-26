import {fire} from "../helpers/db.js"
import axios from "axios";
import getToken from "./getToken";
import apiUrl from "../helpers/axiosConfig.js";

const url = apiUrl + 'users';

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

// Get user information (displayName, email) given their uid // TODO: Current info instead?
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
 * Change current user's basic info (email, displayName)
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
        const res = axios.post(url + '/' + uid + '/projects', projectInfo, header);
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
        const res = axios.post(url + '/' + uid + '/events', eventInfo, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Modifies the current user's event using the given eventInfo (title, start, end)
 */
export async function modifyUserEvent(eventInfo, eventId) {
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();

    try {
        const res = axios.put(url + '/' + uid + '/events/' + eventId, eventInfo, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Deletes the current user's event
 */
 export async function deleteUserEvent(eventId) {
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();

    try {
        const res = axios.delete(url + '/' + uid + '/events/' + eventId, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}