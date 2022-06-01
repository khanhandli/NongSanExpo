import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
// import io from 'socket.io-client';
import CategoriesAPI from './api/CategoriesAPI';
import ProductsAPI from './api/ProductsAPI';
import UserAPI from './api/UserAPI';
import { getDataAPI } from './api/FetchApi';

export const GlobalState = createContext<any>(null);

export const DataProvider = ({ children }: any) => {
    const [token, setToken] = useState<any>('');
    const [socket, setSocket] = useState<any>('');
    const [loading, setLoading] = useState<any>(true);
    const [hiddenTabBar, setHiddenTaBbar] = useState<any>(false);
    const [noti, setNoti] = React.useState<any>([]);

    const [callback, setCallback] = React.useState(false);

    useEffect(() => {
        const callLogin = async () => {
            const check = await AsyncStorage.getItem('firstLogin');
            if (check) {
                const res = await getDataAPI('refresh_token');
                if (res.status === 200) {
                    setToken({ token: res.data.access_token, user: res.data.user._id });
                }
            }
        };

        // const socket = io();
        // setSocket(socket);
        // if (firstLogin) {
        //     const refreshToken = async () => {
        //         const res = await axios.get('/user/refresh_token');

        //         setToken(res.data.accesstoken);

        //         setTimeout(() => {
        //             refreshToken();
        //         }, 10 * 60 * 1000);
        //     };
        //     refreshToken();
        // }

        // return () => socket.close();
        callLogin();
    }, []);

    React.useEffect(() => {
        (async () => {
            const res = await getDataAPI('noti');
            setNoti(res.data.notifications);
        })();
    }, [callback]);

    const state = {
        token: [token, setToken],
        productsAPI: ProductsAPI(),
        categoriesAPI: CategoriesAPI(),
        loading: loading,
        userAPI: UserAPI(token?.token, token?.user, loading, setLoading),
        hiddenTabBar: [hiddenTabBar, setHiddenTaBbar],
        notifications: [noti, setNoti],
        callback: [callback, setCallback],
        // socket,
    };
    return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
