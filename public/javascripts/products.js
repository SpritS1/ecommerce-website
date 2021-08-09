const addToCartButtons = document.querySelectorAll('.add-to-cart');
const productCards = document.querySelectorAll('.product-card img');

productCards.forEach(productCard => {
    productCard.addEventListener('click', async (e) => {
        e.preventDefault();

        const productId = productCard.dataset.productId;
        console.log(productId);

        location.assign(`/products/?productId=${productId}`);
    });
});

addToCartButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();

        const productId = button.dataset.productId;
        const quantity = 1;
        console.log(productId);

        try {
            const res = await fetch('/cart', {
                method: 'POST',
                body: JSON.stringify({ productId, quantity }),
                headers: { 'Content-Type': 'application/json' } 
            });

            const resData = await res.json();
            console.log(resData);

            if (!resData.isProductInCart) {
                cartItemsIncrease();
            }

        } catch (err) {
            console.log(err);
        }
    });
});
