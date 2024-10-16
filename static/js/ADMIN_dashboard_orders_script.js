
let isFetchingActiveOrders = false;
let isFetchingPastOrders = false;




// Function to display active orders for the specific use r
async function showActiveOrders() {
    isFetchingActiveOrders = true;  // Set flag to indicate we're fetching active orders
    isFetchingPastOrders = false;   // Stop fetching past orders

    await initializeFirebase();
    const pastOrderButton = document.getElementById('pastorderbutton');
    const activeOrderButton = document.getElementById('activeorderbutton');

    // Initial style setup
    activeOrderButton.style.backgroundColor = 'transparent';
    pastOrderButton.style.backgroundColor = 'rgb(243, 244, 248)';
    const ordersContent = document.getElementById('orders-content');

    // Clear the content area
    ordersContent.innerHTML = 'Loading active orders...';

    // Fetch active orders from Firestore
    db.collection('orders')
        .where('status', 'in', ['1', '2', '3']) // Use 'in' for multiple statuses
        .get().then(async (querySnapshot) => {
            if (!isFetchingActiveOrders) return;  // Check if the request is still valid

            if (querySnapshot.empty) {
                ordersContent.innerHTML = 'There are no active orders.';
            } else {
                ordersContent.innerHTML = '';  // Clear the orders content
                for (let doc of querySnapshot.docs) {
                    const order = doc.data();

                    // Fetch the item details for this order
                    const items = await fetchOrderItems(order);

                    if (!isFetchingActiveOrders) return;  // Check again before appending content

                    // Now, display the order along with its items
                    const orderElement = document.createElement('div');
                    orderElement.classList.add('order');
                    let status_message = '';
                    if (order.status == "1") {
                        status_message = "Order Accepted, Waiting for Rider";
                    } else if (order.status == "2") {
                        status_message = "Rider Accepted, On the way to Restaurant";
                    } else if (order.status == "3") {
                        status_message = "On the Way to You!";
                    }

                    const cancelButton = document.createElement('button');
                    cancelButton.className = 'cancel-order-button';
                    cancelButton.type = 'button';
                    cancelButton.innerText = 'Cancel Order';
                    cancelButton.onclick = () => cancelOrder(order.orderid);

                    const acceptButton = document.createElement('button');
                    acceptButton.className = 'accept-order-button';
                    acceptButton.type = 'button';
                    acceptButton.innerText = 'Accept Order';
                    acceptButton.onclick = () => accept_order(order.orderid);

                    // Disable the button if the order is not in status 1
                    if (order.status !== "1") {
                        cancelButton.disabled = true;
                        acceptButton.disabled = true;
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
                    orderElement.querySelector('.order-details').appendChild(cancelButton);
                    orderElement.querySelector('.order-details').appendChild(acceptButton);
                    ordersContent.appendChild(orderElement);
                }
            }
        }).catch((error) => {
            console.error("Error fetching active orders: ", error);
        });
}
// Function to display past orders for the specific user
function showPastOrders() {
    isFetchingPastOrders = true;  // Set flag to indicate we're fetching past orders
    isFetchingActiveOrders = false;  // Stop fetching active orders

    const pastOrderButton = document.getElementById('pastorderbutton');
    const activeOrderButton = document.getElementById('activeorderbutton');

    // Initial style setup
    activeOrderButton.style.backgroundColor = 'rgb(243, 244, 248)';
    pastOrderButton.style.backgroundColor = 'transparent';

    const ordersContent = document.getElementById('orders-content');
    ordersContent.innerHTML = 'Loading past orders...';

    // Fetch past orders from Firestore for the specific user
    db.collection('orders')
        .where('status', 'in', ['4', '5'])
        .get().then(async (querySnapshot) => {
            if (!isFetchingPastOrders) return;  // Check if the request is still valid

            if (querySnapshot.empty) {
                ordersContent.innerHTML = 'There are no past orders.';
            } else {
                ordersContent.innerHTML = '';  // Clear the orders content
                for (let doc of querySnapshot.docs) {
                    const order = doc.data();

                    // Fetch the item details for this order
                    const items = await fetchOrderItems(order);

                    if (!isFetchingPastOrders) return;  // Check again before appending content

                    // Now, display the order along with its items
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
                    ordersContent.appendChild(orderElement);
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
    

function accept_order(orderid){
    console.log(orderid);
    db.collection('orders')
    .where('orderid', "==", orderid)
    .where('status', "==","1") // Use 'in' for multiple statuses
    .get().then( (querySnapshot) => {
        if(!querySnapshot.empty){
            
            const orderDoc = querySnapshot.docs[0]; // Get the first order document
                
                // Update the status to '5'
                orderDoc.ref.update({
                    status: "2" // Set status to 5
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
    

showActiveOrders();
