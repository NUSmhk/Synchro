import fire from "../helpers/db.js"
import axios from "axios";
import getToken from "../getToken";

const url = 'http://localhost:3001/api/users';

// Create user 
async function createUser(displayName) {
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
        const res = axios.post(url, payload, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

// Get current user
async function getCurrentUser() {
    const header = await getToken();

    try {
        const res = axios.get(url, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }

}

// TODO: Function to change other user info

/**
 * Adds the given projectId to the user's list of projects
 */
async function addProjectToUser(projectId) {
    const header = await getToken();
    const payload = {
        id: projectId
    }

    try {
        const res = axios.put(url, payload, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

// Get from user object from getCurrentUser?
// /**
//  * Gets an array of projectIds of projects associated with the current user.
//  */
//  async function getProjectIdList() {
//     const header = await getToken()

//     try {
//         const res = await axios.get(url, header);
//         return res.data;
//     } catch (err) {
//         console.log(err);
//     }

// }

// // Gets array of events associated with the current user.
// async function getEvents() { 
    
// }

export default createUser;
export default getCurrentUser;