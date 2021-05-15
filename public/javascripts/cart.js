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
                location.assign('/cart');    
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
    })
});

const qualityUpButtons = document.querySelectorAll('i.quality-up');
const qualityDownButtons = document.querySelectorAll('i.quality-down');

const itemQuantity = document.querySelectorAll('b.item-quantity');
console.log(`Item Quant: ${itemQuantity}`)

for (qualityUp of qualityUpButtons) {
    qualityUp.addEventListener('click', async (e) => {
        e.preventDefault();
    
        const productId = qualityUp.dataset.productId;
        console.log(productId);
        const quantity = 1;
    
        try {
            const res = await fetch('/cart', {
                method: 'POST',
                body: JSON.stringify({ productId, quantity }),
                headers: { 'Content-Type': 'application/json' } 
            });
    
            const resData = await res.json();    
    
            if (resData.status) {
                itemQuantity.textContent++;
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
};







