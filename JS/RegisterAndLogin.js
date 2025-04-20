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
        alert('Passwords do not match. Please try again.');
        return; 
    }
   
    console.log('Email:', email, 'Password:', password); 

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            console.log('Registered:', userCredential.user); 
        })
        .catch(error => {
            console.error('Registration error:', error.message); 
        });
}
//document.getElementById('signup-btn').addEventListener('click', register);

//logout
function logout(){
    signOut(auth)
        .then(() => {
            console.log('logged out');
        })
        .catch(error => {
            console.error('logout error',error.message);
        })
}


document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-btn');
    const signupButton = document.getElementById('signup-btn');

    if (loginButton) {
        loginButton.addEventListener('click', login);
    }

    if (signupButton) {
        signupButton.addEventListener('click', register);
    }
});
    


