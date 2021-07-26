import axios from "axios";
import getToken from "./getToken";
import apiUrl from "../helpers/axiosConfig.js";

const url = apiUrl + 'projects';

// Given the project _id, get project users
export async function getProjectUsers(projectId) {
    const header = await getToken();

    try {
        const res = await axios.get(url + '/' + projectId + '/users', header);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

// Given the project _id, get project event info and merged user event info for all project users
export async function getProjectEvents(projectId) {
    const header = await getToken();

    try {
        const res = await axios.get(url + '/' + projectId + '/events', header);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}


// Change project's basic info (name, endDate)
export async function changeProjectInfo(projectId, projectInfo) {
    const header = await getToken();

    try {
        const res = await axios.put(url + '/' + projectId, projectInfo, header);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

// Adds the user with the given email to the given project and updates the user's project list
export async function addUserToProject(email, projectId) {
    const header = await getToken();
    const payload = {
        email: email
    }

    await axios.put(url + '/' + projectId + '/users', payload, header)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            throw new Error(err.response.data);
        })
}

// Removes the user with the given userId from the given project and updates the user's project list
export async function removeUserFromProject(userId, projectId) {
    const header = await getToken();

    try {
        const res = axios.delete(url + '/' + projectId + '/users/' + userId, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Creates an event using the given eventInfo (title, start, end) and adds it to the project's list of events
 */
 export async function addNewEventToProject(eventInfo, projectId) {
    const header = await getToken();

    try {
        const res = axios.post(url + '/' + projectId + '/events', eventInfo, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Modifies an event using the given eventInfo (title, start, end)
 */
 export async function modifyProjectEvent(eventInfo, projectId, eventId) {
    const header = await getToken();

    try {
        const res = axios.put(url + '/' + projectId + '/events/' + eventId, eventInfo, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Deletes an event
 */
 export async function deleteProjectEvent(projectId, eventId) {
    const header = await getToken();

    try {
        const res = axios.delete(url + '/' + projectId + '/events/' + eventId, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}


// Delete project
export async function deleteProject(projectId) {
    const header = await getToken();

    try { 
        const res = axios.delete(url + '/' + projectId, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}