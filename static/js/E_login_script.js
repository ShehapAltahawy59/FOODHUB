document.addEventListener('DOMContentLoaded', function() {
    updatecardcount();
});

function updatecardcount(){
    const item = document.querySelector('.button-overlay');
    const count=getCartItemscount();
    if (count > 0){
        item.innerHTML = `${count}`
    console.log(count);
    }
    
}

function getCartItemscount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.length;
}
// firebase-auth.js

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBkuZTtYT_Kk0v50TCjJn0oV25hykAoQpA",
    authDomain: "foodorderapp-2b2df.firebaseapp.com",
    projectId: "foodorderapp-2b2df",
    storageBucket: "foodorderapp-2b2df.appspot.com",
    messagingSenderId: "255365039854",
    appId: "1:255365039854:web:da178754d3b0450f6315ff",
    measurementId: "G-EHD8B4S495"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the Firebase Auth service
const auth = firebase.auth();
const db = firebase.firestore();

// Function to handle Google Sign-In
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            // Get user info
            const user = result.user;
            
            const email = user.email; // User's email
            const name = user.displayName; // User's name
            const photoURL = user.photoURL; // User's profile picture URL

            // You may need to handle additional user fields (like phone) separately
            const phone = user.phoneNumber;
            const uid = user.uid;

            

            // Optional: Use Flask-Login to handle the session (send email to the server)
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email,name,photoURL,phone,uid })
            })
            .then(response => response.json())
            .then(data => {
                if (data.redirect_url) {
                    // Redirect to the specified URL
                    window.location.href = data.redirect_url;
                } else {
                    console.error('Login failed:', data.error);
                }
            })
            .catch((error) => {
                console.error('Error during login:', error);
            });
        })
        .catch((error) => {
            console.error('Google Sign-In Error:', error);
        });
    }

// Call the function to sign in when the button is clicked



// Function to log out the user from Firebase and Flask-Login
const logoutUser = async () => {
    try {
        // Log out from Firebase
        await auth.signOut();
        clearCart();
        console.log('User signed out from Firebase.');

        // Log out from Flask-Login
        const response = await fetch('/logout', {
            method: 'POST', // or 'GET', depending on your Flask logout route
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Ensure cookies are included for session management
        });

        if (!response.ok) {
            throw new Error('Error logging out from Flask-Login');
        }

        console.log('User signed out from Flask-Login.');
        // Redirect to home page or show logged out state
        window.location.href = '/'; // Redirect to the home page

    } catch (error) {
        console.error('Error signing out:', error);
    }
};

// Example: Attach logout function to a button

