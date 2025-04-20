import { auth } from '../JS/firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play-btn');
    const createRoomButton = document.getElementById('create-room-btn');
    const joinRoomButton = document.getElementById('join-room-btn');
    const loginbutton = document.getElementById('loginbtn');
    const signupbutton = document.getElementById('signupbtn');
    const logoutbutton = document.getElementById('logoutbtn');

    // Check the user's authentication status
    onAuthStateChanged(auth, (user) => {
        console.log("playButton:", playButton);
        console.log("createRoomButton:", createRoomButton);
        console.log("joinRoomButton:", joinRoomButton);
        if (user) {
            // User is logged in, show the buttons
            playButton.style.display = 'block';
            createRoomButton.style.display = 'block';
            joinRoomButton.style.display = 'block';
            loginbutton.style.display = 'none';
            signupbutton.style.display = 'none';
            logoutbutton.style.display = 'block'

        } else {
            console.log("not logged in");
            // User is not logged in, hide the buttons
            playButton.style.display = 'none';
            createRoomButton.style.display = 'none';
            joinRoomButton.style.display = 'none';
            logoutbutton.style.display = 'none'
        }
    });
});

