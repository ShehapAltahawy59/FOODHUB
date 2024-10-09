

let SubTotal = 0;
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
});

function _addToCart(item) {
    
    // Check if the cart already exists in localStorage
    let _cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the item already exists in the cart
    const existingItem = _cart.find(cartItem => cartItem.id === item.id);
    console.log(existingItem);
    if (existingItem) {
        // If item exists, update its quantity
        existingItem.quantity += 1;
    } else {
        // If item doesn't exist, add it to the cart
        _cart.push(item);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(_cart));
    displayCart();
    console.log('Item added to cart:', item);
    updatecardcount();
}

// Function to add item to the cart
function _removeFromCart(item) {
    
    // Check if the cart already exists in localStorage
    let _cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the item already exists in the cart
    const existingItem = _cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem.quantity >1) {
        // If item exists, update its quantity
        existingItem.quantity -= 1;
    } 
    else {
        // If item doesn't exist, add it to the cart
        _cart = _cart.filter(cartItem => cartItem.id !== item.id);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(_cart));
    displayCart();
    console.log('Item added to cart:', item);
    updatecardcount();

}
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.querySelector('.card_contianer');
    
    // Clear the existing cart display
    

    if (cart.length === 0) {
        container.innerHTML = ''
        return;
    }
    console.log(cart[0].resturant_name);
    
    
    container.innerHTML = '';
    const itemscontainer = document.createElement('div')
    itemscontainer.classList.add('style-277');
    SubTotal = 0;
    
    cart.forEach(item => {
        console.log();
        //     // Create a new div for each cart item
        SubTotal += item.price*item.quantity
            
        const itemdiv = document.createElement('div');
        itemdiv.classList.add('style-278');
        itemdiv.innerHTML =`
        
                                        <div class="style-279">
                                        <button class="remove-button" tabindex="0" type="button"><svg class="style-281" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RemoveIcon">
                                                    <path d="M19 13H5v-2h14z" class=""></path>
                                                </svg><span class="style-282"></span></button>
                                            <p class="style-283">${item.quantity}</p>
                                            <button class="add-button" tabindex="0" type="button"><svg class="style-285" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon">
                                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" class=""></path>
                                                </svg><span class="style-286"></span></button>
                                        </div>
                                        <div class="style-287">
                                            <div class="style-288">
                                                <div class="">
                                                    <p class="style-289">${item.name} </p>
                                                    <p class="style-290"></p>
                                                </div>
                                                <div class="">
                                                    <p class="style-291"> $ ${item.price}</p>
                                                </div>
                                            </div>
                                        </div>          
        `
        const hr = document.createElement('hr');
        hr.classList.add('style-292');
        itemscontainer.appendChild(itemdiv);
        itemscontainer.appendChild(hr);
        removeButton = itemdiv.querySelector('.remove-button');
        const addButton = itemdiv.querySelector('.add-button');

    removeButton.addEventListener('click', () => {
        _removeFromCart(item); // Call your function with the item data
    });

    addButton.addEventListener('click', () => {
        // Define what happens when the add button is clicked
        // You might want to increment the quantity or something else
        
        _addToCart(item); // Call your function with updated data
    });
    
            });
            container.appendChild(itemscontainer)

        const div = document.createElement('div')
        div.innerHTML = `
        <div class="">
                                    <div class="style-323">
                                        <div class="style-324">
                                            <p class="style-325">SubTotal</p>
                                            <p class="style-326">$ ${SubTotal}</p>
                                        </div>
                                        <div class="style-327">
                                            <p class="style-328">Tax Charges</p>
                                            <p class="style-329">$ 2.90</p>
                                        </div>
                                        <div class="style-353">
                                            <div class="style-354"><span class="style-355">Total</span><span class="style-356">(incl. TAX)</span></div><span class="style-357">$ ${SubTotal+2.90}</span>
                                        </div>
                                    </div>
                                </div>
        `
        container.appendChild(div);
        const subtotalp = document.querySelector('.style-430')
        subtotalp.innerHTML=`$ ${SubTotal}`;
}

function palceorder(){
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    orders_ref = db.collection("orders");
    const user = firebase.auth().currentUser;
    const userId = user.uid; 
    
    
    db.collection("users").where("user_id", "==", userId).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
            // Assuming there's only one document per user_id
             const userDoc = querySnapshot.docs[0].data();
             
             let items = [];
        cart.forEach(item => {
            
            items.push(item)
            
        });
        const restueant_id = cart[0]['resturant_id'];
        console.log(SubTotal.toString());
    const order = {
        addressid:userDoc.addresses[0],
        cancelreason:"no reason",
        delivery:{
        name:"",
        phone:"",
        },
        deliveryCost:12,
        itemsinorder:items.map(item => `${item.id}:${item.quantity}`),
        lat:"30.5419389",
        long:"31.1385597",
        notes:"",
        orderid:Date.now(),
        phoneid:userDoc.phone[0],
        picked:false,
        resturant:restueant_id,
        status:"1",
        time:firebase.firestore.FieldValue.serverTimestamp(),
        totalprice:SubTotal.toString(),
        user_id:userDoc.user_id,
        username:userDoc.username,
    }
    db.collection("orders").add(order)
        .then((docRef) => {
            console.log("Order added with ID: ", docRef.id);
            alert("Order added successfully!");
        })
        .catch((error) => {
            console.error("Error adding order: ", error);
            alert("Failed to add order. Try again.");
        });

    }});
}
