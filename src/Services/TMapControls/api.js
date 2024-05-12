import axios from 'axios';

export const getTMapSearchResults = (searchKey) => {
    const uri = "https://apis.openapi.sk.com/tmap/pois?version=1&count=10&searchKeyword=" + searchKey + "&radius=0&appKey=rkJVjhvJH39Z6fV9vg7fK3RY7633ROTQ8aZAB0M0";
    return axios.get(uri);
};