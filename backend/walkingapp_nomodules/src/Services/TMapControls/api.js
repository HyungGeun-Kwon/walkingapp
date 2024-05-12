import axios from 'axios';

export const getTMapSearchResults = (searchKey) => {
    const uri = "https://apis.openapi.sk.com/tmap/pois?version=1&count=10&searchKeyword=" + searchKey + "&radius=0&appKey=pjLe1laNc23fdHAXTYHmS7XPMag2TXl31pRK5Ykl";
    return axios.get(uri);
};