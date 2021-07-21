import fire from "../helpers/db.js"
import axios from "axios";
import getToken from "../getToken";

const url = 'http://localhost:3001/api/projects';

// Creates a project initialized with the specified name and end date, with the creator's uid in the first index of the user array 
async function createProject(projectName, endDate) {
    
    const user = fire.auth().currentUser;
    const uid = user.uid;

    const header = await getToken();
    const payload = {
        name: projectName,
        endDate: endDate,
        users: [uid]
    }

    try {
        const res = await axios.post(url, payload, header);
        return res.data;
    } catch (err) {
        console.log(err);
    }

}

export default createProject;