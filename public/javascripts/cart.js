const removeItemButtons = document.querySelectorAll('.remove-item');

removeItemButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();

        const productId = button.dataset.productId;
        console.log(productId);

        try {
            const res = await fetch('/cart', {
                method: 'DELETE',
                body: JSON.stringify({ productId }),
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
})
