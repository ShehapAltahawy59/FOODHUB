function navigateToPage(url) {
    window.location.href = "/categories/"+url; // Change the current location to the specified URL
}




const cardGroups = document.querySelectorAll('.card-group');

cardGroups.forEach(group => {
    let currentIndex = 0;
    const cardContainer = group.querySelector('.style-1137'); // Card container
    const cards = group.querySelectorAll('.style-1138'); // Individual cards
    const cardWidth = cards[0].offsetWidth + 25; // Adjust according to margin if needed
    const containerWidth = cardContainer.offsetWidth; // Width of visible area

    function updateButtons() {
        const totalWidth = cards.length * cardWidth;
        const hiddenRight = totalWidth > containerWidth + (currentIndex * cardWidth);
        const hiddenLeft = currentIndex > 0;

        const nextButton = group.querySelector('.style-594'); // Button to slide right
        const prevButton = group.querySelector('.style-385'); // Button to slide left

        // Show or hide the next button
        if (nextButton) {
            if (hiddenRight) {
                nextButton.style.display = "block";
            } else {
                nextButton.style.display = "none";
            }
        }

        // Show or hide the previous button
        if (prevButton) {
            if (hiddenLeft) {
                prevButton.style.display = "flex";
            } else {
                prevButton.style.display = "none";
            }
        }
    }

    function slideItems(direction) {
        currentIndex += direction;

        // Prevent scrolling past the limits
        if (currentIndex < 0) {
            currentIndex = 0;
        } else if (currentIndex >= cards.length) {
            currentIndex = cards.length - 1;
        }

        const offset = -currentIndex * cardWidth;
        cards.forEach(card => {
            card.style.transform = `translateX(${offset}px)`; // Move individual cards
            card.style.transition = "transform 0.3s ease"; // Smooth transition
        });

        // Update the button visibility based on the current index and hidden cards
        updateButtons();

        console.log(`Current Index: ${currentIndex}, Offset: ${offset}`); // Debugging log
    }

    const nextButton = group.querySelector('.style-594'); // Button to slide right
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            slideItems(1); // Slide right
        });
    }

    const prevButton = group.querySelector('.style-385'); // Button to slide left
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            slideItems(-1); // Slide left
        });
    }

    // Initialize by checking if there are hidden cards
    updateButtons();
});


    // Assuming your <li> elements are inside a <ul> with the class 'style-64'
// Select all <li> elements within the class style-64
const listItems = document.querySelectorAll('.style-64 li');

listItems.forEach(item => {
    // Get the target ID from the data-target attribute
    const targetId = item.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);

    // Add click event listener to each <li>
    item.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior

        if (targetSection) {
            smoothScroll(targetSection);
        }
    });
});

// Custom smooth scroll function
function smoothScroll(target) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset-150; // Get position of the target
    const startPosition = window.pageYOffset; // Current scroll position
    const distance = targetPosition - startPosition; // Distance to scroll
    const duration = 1000; // Duration of the scroll in milliseconds
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime; // Set start time
        const timeElapsed = currentTime - startTime; // Time elapsed since start
        const run = ease(timeElapsed, startPosition, distance, duration); // Calculate the current scroll position
        window.scrollTo(0, run); // Scroll to the calculated position

        if (timeElapsed < duration) {
            requestAnimationFrame(animation); // Keep animating until duration is reached
        }
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b; // Ease in
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b; // Ease out
    }

    requestAnimationFrame(animation); // Start the animation
}

function toggleDropdown() {
    const profileContainer = document.querySelector('.profile-container');
    profileContainer.classList.toggle('open'); // Toggle the 'open' class
}

window.onclick = function(event) {
    const profileContainer = document.querySelector('.profile-container');
    const isClickInside = profileContainer.contains(event.target);

    // If the click is outside the profile container, remove the 'open' class
    if (!isClickInside) {
        profileContainer.classList.remove('open');
    }
}


function clearCart() {
    localStorage.removeItem('cart');
    console.log('Cart cleared');
}


function enablePhoneInput() {
    document.querySelectorAll("input[name='phone']").forEach(input => {
        input.disabled = false;
        input.style.color = 'green';
        input.style.backgroundColor  = '';
    });
}

// Function to save phone number to Firebase when Save button is clicked
function savePhoneNumber() {
    const phoneInput = document.querySelector("input[name='phone']");
    const newPhoneNumber = phoneInput.value;

    const user = firebase.auth().currentUser;
    
    
        const userId = user.uid; 
      // Firebas// Assuming this is the logged-in user's ID
    console.log(userId);
    // Query Firestore to find the document where user_id matches the current user's ID
    db.collection("users").where("user_id", "==", userId).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
            // Assuming there's only one document per user_id
            const userDoc = querySnapshot.docs[0];
            const docId = userDoc.id;

            // Update the phone number in that document
            db.collection("users").doc(docId).update({
                phone: [newPhoneNumber]
            }).then(() => {
                alert("Phone number updated successfully!");
                phoneInput.disabled = true; // Disable the input again after saving
                phoneInput.style.color = 'rgb(117, 117, 117)';
            }).catch((error) => {
                console.error("Error updating phone number: ", error);
                alert("Failed to update phone number. Try again.");
            });
        } else {
            alert("User document not found.");
        }
    }).catch((error) => {
        console.error("Error finding user document: ", error);
        alert("Failed to find user document. Try again.");
    });
}



function enableadresessInput() {
    document.querySelectorAll("input[name='addressDetail']").forEach(input => {
        input.disabled = false;
        input.style.color = 'green';
        input.style.backgroundColor  = '';
    });
}

// Function to save phone number to Firebase when Save button is clicked
function saveadresess() {
    const phoneInput = document.querySelector("input[name='addressDetail']");
    const newPhoneNumber = phoneInput.value;

    const user = firebase.auth().currentUser;
    
    
        const userId = user.uid; 
      // Firebas// Assuming this is the logged-in user's ID
    console.log(userId);
    // Query Firestore to find the document where user_id matches the current user's ID
    db.collection("users").where("user_id", "==", userId).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
            // Assuming there's only one document per user_id
            const userDoc = querySnapshot.docs[0];
            const docId = userDoc.id;

            // Update the phone number in that document
            db.collection("users").doc(docId).update({
                addresses: [newPhoneNumber]
            }).then(() => {
                alert("address updated successfully!");
                phoneInput.disabled = true; // Disable the input again after saving
                phoneInput.style.color = 'rgb(117, 117, 117)';
            }).catch((error) => {
                console.error("Error updating address: ", error);
                alert("Failed to update address. Try again.");
            });
        } else {
            alert("User document not found.");
        }
    }).catch((error) => {
        console.error("Error finding user document: ", error);
        alert("Failed to find user document. Try again.");
    });
}

function hideLabel() {
    const input = document.getElementById('addressInput');
    const label = document.getElementById('addressLabel');
    
    // Hide label if the input has any value
    if (input.value.trim() !== '') {
        label.style.visibility = 'hidden';
    } else {
        label.style.visibility = 'visible';
    }
}
