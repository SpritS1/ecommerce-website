const addToCartButtons = document.querySelectorAll('.add-to-cart');

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

        } catch (err) {
            console.log(err);
        }
    })
});
