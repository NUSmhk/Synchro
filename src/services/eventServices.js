import fire from "../helpers/db.js"
import axios from "axios";
import getToken from "../getToken";

const url = 'http://localhost:3001/api/events'

// Get event: handled with document population

// Change event info (get eventId with array index?)
export async function changeEventInfo(eventInfo, eventId) {
    const header = await getToken();

    try {
        const res = await axios.put(url + '/' + eventId, eventInfo, header);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

// TODO: Delete event