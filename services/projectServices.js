import fire from "../helpers/db.js"
import axios from "axios";
import getToken from "../getToken";

const url = 'http://localhost:3001/api/projects';

// Creates a project initialized with the specified name and with the creator in its list of collaborators
async function createProject(projectName) {
    
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();
    const payload = {
        name: projectName,
        users: [uid]
    }

    try {
        const res = await axios.post(url, payload, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

async function getProject(projectId) {
    const header = await getToken();
    const 
}

async function addUserToProject(uid) {
    const header = await getToken();
    const 
}

export default createProject;