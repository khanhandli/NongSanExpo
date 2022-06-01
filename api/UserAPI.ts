import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { patchDataAPI, putDataAPI } from './FetchApi';

const UserAPI = (token, id, loading, setLoading) => {
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart, setCart] = useState([]);
    const [history, setHistory] = useState([]);
    const [userr, setUserr] = useState({});
    const [callback, setCallback] = useState(false);

    useEffect(() => {
        if (token) {
            setLoading(true);
            const getUser = async () => {
                try {
                    const res = await axios.get('https://nongsan-app.herokuapp.com/api/user_info/' + id, {
                        headers: { Authorization: token },
                    });

                    setIsLogged(true);
                    res.data.role === 'admin' ? setIsAdmin(true) : setIsAdmin(false);

                    setUserr(res.data);
                    setCart(res.data.cart);
                    setLoading(false);
                } catch (err) {
                    alert(err.response.data.msg);
                    setLoading(false);
                }
            };

            getUser();
        } else {
            setTimeout(() => {
                setLoading(false);
            }, 5000);
        }
    }, [token]);

    const addCart = async (product: any, quantity: any) => {
        if (!isLogged) return alert('Hãy đăng nhập trước khi mua sản phẩm.');

        const check = cart.every((item) => {
            return item._id !== product._id;
        });

        if (check) {
            setCart([...cart, { ...product, quantity }]);

            try {
                await axios.patch(
                    'https://nongsan-app.herokuapp.com/api/addcart',
                    { cart: [...cart, { ...product, quantity: quantity }] },
                    {
                        headers: { Authorization: token },
                    }
                );
            } catch (error) {
                console.log('🚀 ~ file: UserAPI.ts ~ line 66 ~ addCart ~ error', error.response);
            }
        } else {
            alert('Sản phẩm đã có trong giỏ hàng.');
        }
    };

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        addCart: addCart,
        history: [history, setHistory],
        userr: [userr, setUserr],
    };
};

export default UserAPI;
