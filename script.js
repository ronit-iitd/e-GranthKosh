import { initializeApp } from
    "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getAuth,
    signOut,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCu4Vd-V9iET_vD6YlpVOUgoqSm-sb1pdU",
  authDomain: "e-granthakosh.firebaseapp.com",
  projectId: "e-granthakosh",
  storageBucket: "e-granthakosh.firebasestorage.app",
  messagingSenderId: "422433044175",
  appId: "1:422433044175:web:527db982771cf79503a9ba",
  measurementId: "G-RBFVBLRYEV"
};


// connects your website to your Firebase project.

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
        window.location.hash = '#' + id;
    });
});
 // Match the displayed page to the URL

let currentUser = null;
let authReady = false;

function sync() {

    if (!authReady) return;

    const id = location.hash.slice(1) || 'home';

    let targetPage = id;

   if (currentUser) {

    // Allow the email verification success page
    if (id === 'emailVerified') {
        targetPage = 'emailVerified';
    } else if (id !== 'dashboard') {
        targetPage = 'dashboard';
    }

}
    else {

        // Visitors cannot access the dashboard
        if (id === 'dashboard') {
            targetPage = 'login';
        }

        // Allow only public pages for logged-out visitors
        if (!['home', 'login', 'register', 'emailVerified'].includes(targetPage)) {
            targetPage = 'home';
        }
    }

    if (!document.getElementById(targetPage)) {
        targetPage = currentUser ? 'dashboard' : 'home';
    }

    if (location.hash !== '#' + targetPage) {
        history.replaceState(null, '', '#' + targetPage);
    }

    showPage(targetPage, false);
}


window.addEventListener('hashchange', sync);
sync();




document.querySelectorAll('[data-provider]').forEach(button => {
    button.addEventListener('click', async () => {
        const providerName = button.dataset.provider;

        let provider;

        if (providerName === 'Google') {
            provider = new GoogleAuthProvider();
        } else if (providerName === 'GitHub') {
            provider = new GithubAuthProvider();
        } else {
            return;
        }

        try {
            await signInWithPopup(auth, provider);
            window.location.hash = '#dashboard';
        } catch (error) {
            console.error(error);
            alert('Sign-in failed: ' + error.message);
        }
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




 // 6. Email and password login

const login = document.getElementById('loginForm');

if (login) {
    login.addEventListener('submit', async event => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const message = document.getElementById('loginMessage');

        message.textContent = 'Logging in...';

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

          await userCredential.user.reload();

if (!userCredential.user.emailVerified) {
    await signOut(auth);

    message.textContent =
        'Please verify your email before logging in. Check your inbox.';

    return;
}
            message.textContent = 'Login successful!';
            window.location.hash = '#dashboard';

        } catch (error) {
            console.error('Login failed:', error);

            if (error.code === 'auth/invalid-credential') {
                message.textContent =
                    'Incorrect email or password. Please try again.';
            } else {
                message.textContent =
                    'Login failed: ' + error.message;
            }
        }
    });
}


 // Registration form validation
const reg = document.getElementById('registerForm');

if (reg) {
    reg.addEventListener('submit', async event => {
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

       



        // Create a Firebase account
const email = document.getElementById('regEmail').value.trim();
const name = document.getElementById('name').value.trim();

message.textContent = 'Creating your account...';

try {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password.value
    );

    
await updateProfile(userCredential.user, {
    displayName: name
});


const actionCodeSettings = {
    url: window.location.hostname === 'localhost'
        ? 'http://localhost:8000/#emailVerified'
        : 'https://ronit-iitd.github.io/e-GranthaKosh/#emailVerified',
    handleCodeInApp: false
};

await sendEmailVerification(
    userCredential.user,
    actionCodeSettings
);

await signOut(auth);



message.textContent =
    'Account created! Please check your email and click the verification link before logging in.';


} catch (error) {
    message.textContent = error.message;
}
    });
}

/// Check the current authentication status
onAuthStateChanged(auth, async (user) => {

    // Refresh email verification status
    if (user) {
        await user.reload();
        user = auth.currentUser;
    }

    // Only verified email users and social-login users
    // can access the Dashboard
    const isVerifiedUser = user && (
        user.emailVerified ||
        user.providerData.some(item =>
            item.providerId === 'google.com' ||
            item.providerId === 'github.com'
        )
    );

    currentUser = isVerifiedUser ? user : null;
    authReady = true;

    const homeLink = document.getElementById('homeLink');
    const dashboardLink = document.getElementById('dashboardLink');

    const loginLink = document.querySelector(
        '#mainNav [data-page="login"]'
    );

    const registerLink = document.querySelector(
        '#mainNav [data-page="register"]'
    );

    const nav = document.getElementById('mainNav');

    // Update navigation
    if (homeLink) homeLink.style.display = currentUser ? 'none' : '';
    if (dashboardLink) dashboardLink.style.display = currentUser ? '' : 'none';
    if (loginLink) loginLink.style.display = currentUser ? 'none' : '';
    if (registerLink) registerLink.style.display = currentUser ? 'none' : '';

    // Remove existing account controls
    document.getElementById('accountNav')?.remove();
    document.getElementById('logoutButton')?.remove();

    if (currentUser && nav) {

        const account = document.createElement('span');
        account.id = 'accountNav';
        account.textContent =
            'Hello, ' + (currentUser.displayName || currentUser.email);

        const logout = document.createElement('button');
        logout.id = 'logoutButton';
        logout.type = 'button';
        logout.textContent = 'Log out';

        logout.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.hash = '#home';

            } catch (error) {
                console.error('Logout failed:', error);
            }
        });

        nav.append(account, logout);
    }

    // Decide which page the user should see
    sync();

});

 // 8. Password recovery

const forgot = document.getElementById('forgot');

if (forgot) {
    forgot.addEventListener('click', async event => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('loginMessage');

        if (!email) {
            message.textContent =
                'Please enter your email address first.';
            document.getElementById('email').focus();
            return;
        }

        message.textContent = 'Sending password-reset email...';

        try {
            await sendPasswordResetEmail(auth, email);

            message.textContent =
                'Password-reset email sent. Check your inbox and spam folder.';
        } catch (error) {
            console.error('Password recovery failed:', error);

            if (error.code === 'auth/user-not-found' ||
                error.code === 'auth/invalid-credential') {
                message.textContent =
                    'If an account exists for this email, you can request a password reset.';
            } else if (error.code === 'auth/invalid-email') {
                message.textContent =
                    'Please enter a valid email address.';
            } else {
                message.textContent =
                    'Could not send the reset email. Please try again.';
            }
        }
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