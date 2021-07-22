import fire from "../helpers/db.js"
import axios from "axios";
import getToken from "../getToken";

const url = 'http://localhost:3001/api/projects';

// Creates a project initialized with the specified name and end date
export async function createProject(projectName, endDate) {
    const header = await getToken();

    const payload = {
        name: projectName,
        endDate: endDate,
    }

    try {
        const res = await axios.post(url, payload, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

// Get project information given the project id
export async function getProject(projectId) {
    const header = await getToken();

    try {
        const res = await axios.get(url + '/' + projectId, header);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

// Adds the user with the given email to the given project
export async function addUserToProject(email, projectId) {

    const header = await getToken();
    const payload = {
        email: email
    }

    try {
        const res = axios.put(url + '/' + projectId + '/users', payload, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}