import axios from 'axios';
const URL = 'https://nongsan-app.herokuapp.com';
axios.defaults.withCredentials = true;

export const getDataAPI = async (url: string, token: any = '') => {
    const res = await axios.get(URL + '/api/' + url, {
        headers: {
            Authorization: token,
        },
    });
    return res;
};

export const postDataAPI = async (url: string, data: any, token: any = '') => {
    const res = await axios.post(URL + '/api/' + url, data, {
        headers: {
            Authorization: token,
        },
    });
    return res;
};

export const putDataAPI = async (url: string, data: any, token: any = '') => {
    const res = await axios.put(URL + '/api/' + url, data, {
        headers: {
            Authorization: token,
        },
    });
    return res;
};

export const patchDataAPI = async (url: string, data: any, token: any = '') => {
    const res = await axios.patch(URL + '/api/' + url, data, {
        headers: {
            Authorization: token,
        },
    });
    return res;
};

export const deleteDataAPI = async (url: string, token: any = '') => {
    const res = await axios.delete(URL + '/api/' + url, {
        headers: {
            Authorization: token,
        },
    });
    return res;
};
