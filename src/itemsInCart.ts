const cartItems = document.querySelector('.cart-quantity') as HTMLDivElement;

const cartItemsIncrease = () => {
    let cartQuantity: number = Number(cartItems.textContent);
    cartItems.textContent = String(cartQuantity + 1);
};

// const cartItemsDecrese = () => {
//     cartQuantity = parseInt(cartItems.textContent);
//     cartItems.textContent = (cartQuantity--).toString();
// };