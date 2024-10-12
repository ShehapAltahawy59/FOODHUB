var firebaseConfig;
var auth, db; // Declare auth and db globally
var firebaseInitialized = false; // Flag to check if Firebase has been initialized

function initializeFirebase() {
    if (!firebaseInitialized) {
        fetch('/firebase-config')
            .then(response => response.json())
            .then(config => {
                firebaseConfig = config;

                if (!firebase.apps.length) {
                    // Initialize Firebase
                    firebase.initializeApp(firebaseConfig);

                    // Initialize Firebase services
                    auth = firebase.auth();
                    db = firebase.firestore();
                    
                    firebaseInitialized = true; // Mark Firebase as initialized
                    console.log('Firebase initialized with dynamic config');
                }
            })
            .catch((error) => {
                console.error('Error fetching Firebase config:', error);
            });
    }
}

// Call initializeFirebase() when the script loads
initializeFirebase()
