const removeItemButtons = document.querySelectorAll('.remove-item');

removeItemButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();

        const itemId = button.dataset.itemId;
        console.log(itemId);

        try {
            const res = await fetch('/cart', {
                method: 'DELETE',
                body: JSON.stringify({ itemId }),
                headers: { 'Content-Type': 'application/json' } 
            });

            const resData = await res.json();

            if (resData.status) {
                // location.assign('/cart');    
                location.reload();
            } else if (!resData.status) {
                if (resData.message) {
                    console.log(resData.message);
                } else if (resData.error) {
                    console.log(resData.error);
                }
            }

        } catch (err) {
            console.log(err);
        }
    });
});

const productCards = document.querySelectorAll('.cart-item img');

productCards.forEach(productCard => {
    productCard.addEventListener('click', async (e) => {
        e.preventDefault();

        const productId = productCard.dataset.productId;
        console.log(productId);

        location.assign(`/products/?productId=${productId}`);
    });
});

const quantityUpButtons = document.querySelectorAll('i.quantity-up');
const quantityDownButtons = document.querySelectorAll('i.quantity-down');

const quantityUpButtonsArray = Array.from(quantityUpButtons);
const quantityDownButtonsArray = Array.from(quantityDownButtons);

const itemQuantity = document.querySelectorAll('b.item-quantity');

const subTotal = document.querySelector('.subtotal b');
const total = document.querySelector('.total b');
 

quantityUpButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const productId = button.dataset.productId;
        console.log(productId);
        const quantity = 1;
    
        try {
            const res = await fetch('/cart', {
                method: 'POST',
                body: JSON.stringify({ productId, quantity }),
                headers: { 'Content-Type': 'application/json' } 
            });
    
            const resData = await res.json();    

            const itemQuantityParsedInt = parseInt(itemQuantity[quantityUpButtonsArray.indexOf(button)].textContent);
            
            if (itemQuantityParsedInt >= 1) {
                quantityDownButtons[quantityUpButtonsArray.indexOf(button)].style.pointerEvents = "auto";
            } 

            if (resData.cart) {
                itemQuantity[quantityUpButtonsArray.indexOf(button)].textContent++;
                subTotal.textContent = `${resData.cart.subTotal.toFixed(2)} PLN`;
                total.textContent = `${(resData.cart.subTotal + 20).toFixed(2)} PLN`;

            } else if (!resData.cart) {
                if (resData.message) {
                    console.log(resData.message);
                } else if (resData.error) {
                    console.log(resData.error);
                }
            }
        } catch (err) {
            console.log(err);
        }
    });
});

quantityDownButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const productId = button.dataset.productId;
        const quantity = -1;
    
        try {
            const res = await fetch('/cart', {
                method: 'POST',
                body: JSON.stringify({ productId, quantity }),
                headers: { 'Content-Type': 'application/json' } 
            });
    
            const resData = await res.json();   
            
            const itemQuantityParsedInt = parseInt(itemQuantity[quantityDownButtonsArray.indexOf(button)].textContent);

            
            if (resData.cart) {
                if (itemQuantityParsedInt > 1) {
                    itemQuantity[quantityDownButtonsArray.indexOf(button)].textContent--;
                }
                console.log(itemQuantityParsedInt);
                if (itemQuantityParsedInt <= 2) {
                    button.style.pointerEvents = "none";
                }
                subTotal.textContent = `${resData.cart.subTotal.toFixed(2)} PLN`;
                total.textContent = `${(resData.cart.subTotal + 20).toFixed(2)} PLN`;
            } else if (!resData.cart) {
                if (resData.message) {
                    console.log(resData.message);
                } else if (resData.error) {
                    console.log(resData.error);
                }
            }
        } catch (err) {
            console.log(err);
        }
    });
});







