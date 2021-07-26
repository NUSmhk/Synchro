const apiUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001/api/'
    : 'https://synchro-api.herokuapp.com/api/';

export default apiUrl;