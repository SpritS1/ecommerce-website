"use strict";
const cartItems = document.querySelector('.cart-quantity');
const cartItemsIncrease = () => {
    let cartQuantity = Number(cartItems.textContent);
    cartItems.textContent = String(cartQuantity + 1);
};
// const cartItemsDecrese = () => {
//     cartQuantity = parseInt(cartItems.textContent);
//     cartItems.textContent = (cartQuantity--).toString();
// };
