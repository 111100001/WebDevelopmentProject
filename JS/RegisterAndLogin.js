import { auth } from './firebase-init.js' ;

import { createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";



//login
function login(event){
    event.preventDefault();

    console.log('login function called'); 


    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Email:', email, 'Password:', password); 

    signInWithEmailAndPassword(auth, email,password)
        .then(userCredential => {
            console.log('logged in', userCredential.user);
            window.location.href = './landingPage.html'
        })
        .catch(error => {
            console.error('login error:', error.message);
            document.getElementById('login-error').innerHTML = '<p>Email or Password is invalid</p>';
        });
}
//document.getElementById('login-btn').addEventListener('click', login);



//register code
function register(event) {
    event.preventDefault();
    
    console.log('Register function called'); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repassword = document.getElementById('repassword').value;

    if (password !== repassword) {
        document.getElementById('signup-error').innerHTML = '<p>Passwords do not match. Please try again.</p>';
        return; 
    }
   
    console.log('Email:', email, 'Password:', password); 

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            console.log('Registered:', userCredential.user);
            window.location.href = './LogInPage.html'
        })
        .catch(error => {
            console.error('Registration error:', error.message); 
        });
}
//document.getElementById('signup-btn').addEventListener('click', register);

//logout
function logout(event){
    event.preventDefault();
    signOut(auth)
        .then(() => {
            console.log('logged out');
            const loginButton = document.getElementById('loginbtn');
            const signupButton = document.getElementById('signupbtn');

            if (loginButton) {
                loginButton.style.display = 'inline-block'; // Show the login button
            }

            if (signupButton) {
                signupButton.style.display = 'inline-block'; // Show the signup button
            }
            
        })
        .catch(error => {
            console.error('logout error',error.message);
        })
}


document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-btn');
    const signupButton = document.getElementById('signup-btn');
    const logoutbutton = document.getElementById('logoutbtn');

    if (loginButton) {
        loginButton.addEventListener('click', login);
    }

    if (signupButton) {
        signupButton.addEventListener('click', register);
    }
    if(logoutbutton){
        logoutbutton.addEventListener('click', logout);
        
    }
});
    


