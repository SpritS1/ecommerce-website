const cartItems = document.querySelector('.cart-quantity') as HTMLDivElement;
let cartQuantity: number;

const cartItemsIncrease = () => {
    cartQuantity = parseInt(cartItems.textContent);
    cartItems.textContent = (cartQuantity++).toString();
};

const cartItemsDecrese = () => {
    cartQuantity = parseInt(cartItems.textContent);
    cartItems.textContent = (cartQuantity--).toString();
};