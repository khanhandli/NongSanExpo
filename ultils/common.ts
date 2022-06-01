export const numberWithCommas = (number: any) => {
    if (number && typeof number === 'number') {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
        return 0;
    }
};
