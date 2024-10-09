
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
            console.log('hereeeeeeeeeeeeeeeeeeeee');
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
    db.collection('orders').where('user_id', '==', userId).where('status', '==', '4').get().then(async (querySnapshot) => {
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
