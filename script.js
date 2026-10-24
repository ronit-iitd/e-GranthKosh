document.addEventListener('DOMContentLoaded',()=>{

// 1. update the footer year

 const year=document.getElementById('year');

 if(year)year.textContent=new Date().getFullYear();


// 2. Mobile navigation menu

 const nav = document.getElementById('mainNav');
const menu = document.getElementById('menu');

if (menu && nav) {
    menu.addEventListener('click', () => {
        const open = nav.classList.toggle('show');
        menu.setAttribute('aria-expanded', String(open));
    });
}

// (More compact version of the mobile navigation menu)
 // const nav=document.getElementById('mainNav'),menu=document.getElementById('menu');
 // if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('show');menu.setAttribute('aria-expanded',String(open));});


// 3. Page navigation

    function showPage(id, scroll = true) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.toggle('active', page.id === id);
        });

        if (nav) {
            nav.classList.remove('show');

            if (menu) {
                menu.setAttribute('aria-expanded', 'false');
            }
        }

        if (scroll) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }


// Handle links that switch pages

document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();

        const id = link.dataset.page;

        history.replaceState(null, '', '#' + id);
        showPage(id);
    });
});

 // Match the displayed page to the URL

function sync() {
    const id = location.hash.slice(1);

    showPage(
        ['login', 'register'].includes(id) ? id : 'home',
        false
    );
}

window.addEventListener('hashchange', sync);
sync();

// 4. Google and GitHub sign-in placeholders

document.querySelectorAll('[data-provider]').forEach(button => {
    button.addEventListener('click', () => {
        alert(
            button.dataset.provider +
            ' sign-in will be connected after Firebase setup. It is not active yet.'
        );
    });
});

    // 5. Show or hide password fields


 document.querySelectorAll('[data-toggle]').forEach(button => {
    button.addEventListener('click', () => {
        const input = document.getElementById(button.dataset.toggle);

        if (input) {
            input.type =
                input.type === 'password' ? 'text' : 'password';

            button.textContent =
                input.type === 'password' ? 'Show' : 'Hide';
        }
    });
});


 // 6. Login form validation

 const login = document.getElementById('loginForm');

if (login) {
    login.addEventListener('submit', event => {
        event.preventDefault();

        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const message = document.getElementById('loginMessage');

        if (!email.validity.valid) {
            message.textContent =
                'Please enter a valid email address.';
            return;
        }

        if (password.value.length < 8) {
            message.textContent =
                'Password must contain at least 8 characters.';
            return;
        }

        message.textContent =
            'The form works, but sign-in is not active. Do not use a real password.';
    });
}


 // Registration form validation
const reg = document.getElementById('registerForm');

if (reg) {
    reg.addEventListener('submit', event => {
        event.preventDefault();

        const password = document.getElementById('regPassword');
        const confirm = document.getElementById('confirm');
        const message = document.getElementById('registerMessage');

        // Check password length
        if (password.value.length < 8) {
            message.textContent =
                'Password must contain at least 8 characters.';
            return;
        }

        // Check whether both passwords match
        if (password.value !== confirm.value) {
            message.textContent =
                'The passwords do not match.';
            return;
        }

        // Check whether the prototype notice is accepted
        if (!document.getElementById('terms').checked) {
            message.textContent =
                'Please confirm the prototype notice.';
            return;
        }

        // Display a message; no account is created yet
        message.textContent =
            'Form validation works! No account has been created or stored. Firebase will be connected later.';
    });
}


 // 8. Forgot-password placeholder
const forgot = document.getElementById('forgot');

if (forgot) {
    forgot.addEventListener('click', event => {
        event.preventDefault();

        document.getElementById('loginMessage').textContent =
            'Password recovery will be available after Firebase setup.';
    });
}

 // 9. Search form placeholder
const searchForm = document.getElementById('searchForm');

if (searchForm) {
    searchForm.addEventListener('submit', event => {
        event.preventDefault();

        const query = document.getElementById('query').value.trim();
        const message = document.getElementById('searchMessage');

        message.textContent = query
            ? 'You searched for “' + query +
              '”. Live Wikisource search will be connected later.'
            : 'Enter a title, author, or subject to try the search field.';
    });
}

});