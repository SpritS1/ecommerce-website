const registerForm = document.querySelector('form.register');
const loginForm = document.querySelector('form.login');
const submit = document.querySelector('.btn-submit');
const warnings = document.querySelectorAll('span.warning');

if (loginForm) {
    submit.addEventListener('click', async (e) => {
        e.preventDefault();

        
        const email = loginForm.mail.value;
        const password = loginForm.password.value;

        try {
            const res = await fetch('/account/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json'}
            });

            const data = await res.json();

            if (data.client) {
                console.log('login');
                location.assign('/');
            } else if (data.errors) {
                warnings.forEach(warning => {
                    if (warning.dataset.warningType === 'mail') {
                        warning.textContent = data.errors.email;
                    }
                    if (warning.dataset.warningType === 'password') {
                        warning.textContent = data.errors.password;
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }

    });
} else if (registerForm) {
    submit.addEventListener('click', async (e) => {
        e.preventDefault();

        const email = registerForm.mail.value;
        const password = registerForm.password.value;
        const firstname = registerForm.firstname.value;
        const surname = registerForm.surname.value;
        const phone = registerForm.phone.value;
        const city = registerForm.address.value;
        
        try {
            const res = await fetch('/account/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, firstname, surname, phone, city }),
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await res.json();

            if (data.errors) {            
                warnings.forEach(warning => {
                    if (warning.dataset.warningType === 'mail') {
                        warning.textContent = data.errors.email;
                    }
                    if (warning.dataset.warningType === 'password') {
                        warning.textContent = data.errors.password;
                    }
                    if (warning.dataset.warningType === 'firstname') {
                        warning.textContent = data.errors.firstname;
                    }
                    if (warning.dataset.warningType === 'surname') {
                        warning.textContent = data.errors.surname;
                    }
                    if (warning.dataset.warningType === 'phone') {
                        warning.textContent = data.errors.phone;
                    }
                    if (warning.dataset.warningType === 'address') {
                        warning.textContent = data.errors.city; 
                    }
                });
            } else if(data.client) {
                location.assign('/');
            }
    
        }catch(error) {
            console.log(error);
        }
    });
}
