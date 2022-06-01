import axios from 'axios';
import { useEffect, useState } from 'react';

function ProductsAPI() {
    const [products, setProducts] = useState([]);
    const [callback, setCallback] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(false);

    useEffect(() => {
        const getProducts = async () => {
            setLoadingProduct(true);
            const res = await axios.get(`https://nongsan-app.herokuapp.com/api/all_pro`);
            setProducts(res.data.products);
            setLoadingProduct(false);
        };
        console.log('first');

        getProducts();
    }, [callback]);

    return {
        products: [products, setProducts],
        callback: [callback, setCallback],
        loadingProduct: loadingProduct,
    };
}

export default ProductsAPI;
