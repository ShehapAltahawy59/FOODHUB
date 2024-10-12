
let userId = null;



firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        userId = user.uid;
        showActiveOrders();
    }
});

// Function to display active orders for the specific user
function showActiveOrders() {
    const pastOrderButton = document.getElementById('pastorderbutton');
    const activeOrderButton = document.getElementById('activeorderbutton');

    // Initial style setup
    activeOrderButton.style.backgroundColor = 'transparent';
    pastOrderButton.style.backgroundColor = 'rgb(243, 244, 248)';
    const ordersContent = document.getElementById('orders-content');
    if (!userId) {
        console.log('user not found');
        
        return;
    }

    // Fetch past orders from Firestore for the specific user
    db.collection('orders')
  .where('user_id', '==', userId)
  .where('status', 'in', ['1', '2', '3']) // Use 'in' for multiple statuses
  .get().then(async (querySnapshot) => {
        if (querySnapshot.empty) {
            
            ordersContent.innerHTML='You have no active orders.';
        } else {
            
            ordersContent.innerHTML='';
            for (let doc of querySnapshot.docs) {
                const order = doc.data();
    
                // Fetch the item details for this order
                const items = await fetchOrderItems(order);
    
                // Now, you can display the order along with its items
                const orderElement = document.createElement('div');
                orderElement.classList.add('order');
                let status_message="";
                if(order.status == "1"){
                    status_message="order Accepted, Watinig for Rider";
                }
                else if(order.status == "2") {
                    status_message="Rider Accepted, On way to Resturant";
                }
                else if(order.status == "3") {
                    status_message="On the Way to You!";
                }

                const cancelButton = document.createElement('button');
                cancelButton.className = 'cancel-order-button';
                cancelButton.type = 'button';
                cancelButton.innerText = 'Cancel Order';
                
                cancelButton.onclick = () => cancelorder(order.orderid);

                // Disable the button if the order is not in status 1
                if (order.status !== "1") {
                    cancelButton.disabled = true;
                    }

                orderElement.innerHTML = `
    <div class="order-details">
        <h3 class="order-id">Order ID: ${order.orderid}</h3>
        <p class="order-date">Order Date: ${order.time.toDate().toLocaleString()}</p>
        <p class="order-total">Total: $${order.totalprice}</p>
        <p class="order-total" style="display:inline-block">Status: </p><p class="order-total" style="color:green; display:inline-block; padding-left:5px">${status_message}</p>
        <h4 class="order-items-title">Items:</h4>
        <table class="order-items-table">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>status</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                    <tr>
                        <td class="item-name">${item.name_en}</td>
                        <td class="item-quantity">${item.quantity}</td>
                        <td class="item-price">$${item.priceafterdiscount}</td>
                        <td class="item-total">$${(item.priceafterdiscount * item.quantity).toFixed(2)}</td>
                        
                        
                    </tr>

                `).join('')}
            </tbody>
        </table>
        <div button_container></div>
    </div>
`;
                orderElement.querySelector('.order-details').appendChild(cancelButton);
                document.getElementById('orders-content').appendChild(orderElement);
            }
        }
    }).catch((error) => {
        console.error("Error fetching active orders: ", error);
    });
}

// Function to display past orders for the specific user
function showPastOrders() {
    const pastOrderButton = document.getElementById('pastorderbutton');
    const activeOrderButton = document.getElementById('activeorderbutton');

    // Initial style setup
    activeOrderButton.style.backgroundColor = 'rgb(243, 244, 248)';
    pastOrderButton.style.backgroundColor = 'transparent';

    
    if (!userId) {
        alert('Please log in to view your past orders.');
        return;
    }

    const ordersContent = document.getElementById('orders-content');
    

    // Fetch past orders from Firestore for the specific user
    db.collection('orders').where('user_id', '==', userId).where('status' ,'in',[ '4','5']).get().then(async (querySnapshot) => {
        if (querySnapshot.empty) {
            ordersContent.innerHTML='You have no past orders.';
        } else {
            ordersContent.innerHTML='';
            for (let doc of querySnapshot.docs) {
                const order = doc.data();
    
                // Fetch the item details for this order
                const items = await fetchOrderItems(order);
    
                // Now, you can display the order along with its items
                const orderElement = document.createElement('div');
                orderElement.classList.add('order');
                orderElement.innerHTML = `
                                            <div class="order-details">
                                                <h3 class="order-id">Order ID: ${order.orderid}</h3>
                                                <p class="order-date">Order Date: ${order.time.toDate().toLocaleString()}</p>
                                                <p class="order-total">Total: $${order.totalprice}</p>
                                                <h4 class="order-items-title">Items:</h4>
                                                <table class="order-items-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Item Name</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${items.map(item => `
                                                            <tr>
                                                                <td class="item-name">${item.name_en}</td>
                                                                <td class="item-quantity">${item.quantity}</td>
                                                                <td class="item-price">$${item.priceafterdiscount}</td>
                                                                <td class="item-total">$${(item.priceafterdiscount * item.quantity).toFixed(2)}</td>
                                                            </tr>
                                                        `).join('')}
                                                    </tbody>
                                                </table>
                                            </div>
                                        `;
                document.getElementById('orders-content').appendChild(orderElement);
            }
        }
    }).catch((error) => {
        console.error("Error fetching past orders: ", error);
    });
}



async function fetchOrderItems(order) {
    const items = [];  // Array to store the item details

    // Loop through each item ID in the order
    const itemPromises = order.itemsinorder.map(async (itemid) => {
        const querySnapshot = await db.collection('items').where('item_id', '==', itemid.split(":")[0]).get();
        if (!querySnapshot.empty) {
            // Assuming item_id is unique, we take the first document found
            const itemData = querySnapshot.docs[0].data();
            itemData["quantity"]=itemid.split(":")[1]
            return itemData;  // Return item data for each item ID
        } else {
            console.error(`No item found for item_id: ${itemid}`);
            return null;  // Return null if the item is not found
        }
    });
 // Wait for all the item queries to resolve and add them to the items array
 const resolvedItems = await Promise.all(itemPromises);

 // Filter out any null values (in case an item wasn't found)
 return resolvedItems.filter(item => item !== null);
}


function cancelorder(orderid){
    console.log(orderid);
    db.collection('orders')
    .where('orderid', "==", orderid)
    .where('status', "==","1") // Use 'in' for multiple statuses
    .get().then( (querySnapshot) => {
        if(!querySnapshot.empty){
            
            const orderDoc = querySnapshot.docs[0]; // Get the first order document
                
                // Update the status to '5'
                orderDoc.ref.update({
                    status: "5" // Set status to 5
                })
                    .then(() => {
                        showActiveOrders();
                    })
                    .catch((error) => {
                        console.error("Error canceling order: ", error);
                    });
                
        } else {
            console.log("No order found with the given orderid.");
        }
        })
}
    