

async function calculatedata(){
    await initializeFirebase();
    userfiled=document.getElementById("user_count");
    resturant_fiels=document.getElementById("resturant_count");
    riders_field = document.getElementById("riders_count");
    const storeduserscount = sessionStorage.getItem('userscount');
    if (storeduserscount) {
        console.log("use saved data");
        userfiled.innerHTML=`${storeduserscount}`; // Use stored data if available
    }
    else{
            db.collection('users') // Use 'in' for multiple statuses
                .get().then(async (querySnapshot) => {
                if (querySnapshot) {
                    
                    count= querySnapshot.size
                    userfiled.innerHTML=`${count}`;
                    sessionStorage.setItem('userscount', JSON.stringify(count));
        } else {}})}

        const storeducategoriescount = sessionStorage.getItem('categoriescount');
        if (storeducategoriescount) {
            console.log("use saved data");
            resturant_fiels.innerHTML=`${storeducategoriescount}`; // Use stored data if available
        }
        else{
    db.collection('categories') // Use 'in' for multiple statuses
    .get().then(async (querySnapshot) => {
            if (querySnapshot) {
                
                count= querySnapshot.size
                resturant_fiels.innerHTML=`${count}`;
                sessionStorage.setItem('categoriescount', JSON.stringify(count));
            } else {}})}

            const storedriderscount = sessionStorage.getItem('riderscount');
            if (storedriderscount) {
                console.log("use saved data");
                riders_field.innerHTML=`${storedriderscount}`; // Use stored data if available
            }
            else{     
    db.collection('constants') // Use 'in' for multiple statuses
    .get().then(async (querySnapshot) => {
            if (querySnapshot) {
                
                count= querySnapshot.docs[0].data().delivery_men.length;
                riders_field.innerHTML=`${count}`;
                sessionStorage.setItem('riderscount', JSON.stringify(count));
            } else {}})}
}


function getLast5Months() {
    const now = new Date();
    const months = [];
    for (let i = 4; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(month);
    }
    return months;
}

// Format a Date object as 'YYYY-MM' to match month
function formatMonth(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${year}-${month}`;
}

// Fetch data from Firestore for order tracking (last 5 months)
async function fetchOrderData() {
    const months = getLast5Months();
    const labels = months.map(formatMonth);  // e.g. ['2023-06', '2023-07', ...]

    const data = {
        labels: labels,  // Last 5 months
        datasets: [
            { label: 'Total Orders', data: [0, 0, 0, 0, 0], borderColor: 'lightblue', fill: false },
            { label: 'Completed Orders', data: [0, 0, 0, 0, 0], borderColor: 'green', fill: false },
            { label: 'Cancelled Orders', data: [0, 0, 0, 0, 0], borderColor: 'red', fill: false }
        ]
    };
    
    const storedData = sessionStorage.getItem('orderData');
            if (storedData) {
                console.log("use saved data");
                return JSON.parse(storedData);  // Use stored data if available
            }
    try {
        console.log("use live data");
        // Fetch all documents from the 'orders' collection
        const querySnapshot = await db.collection('orders').get();

        // Process each order document based on its timestamp
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            const orderDate = docData.time.toDate(); // Convert Firestore timestamp to JS Date object

            // Find which month this order belongs to (within last 5 months)
            for (let i = 0; i < months.length; i++) {
                const monthStart = months[i];
                const nextMonthStart = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);

                // Check if orderDate falls within this month
                if (orderDate >= monthStart && orderDate < nextMonthStart) {
                    data.datasets[0].data[i] += 1; // Increment total orders

                    // Update specific statuses based on order fields
                    if (docData.status === '4') {
                        data.datasets[1].data[i] += 1;  // Completed Orders
                    } else if (docData.status === '5') {
                        data.datasets[2].data[i] += 1;  // Cancelled Orders
                    }
                    break;
                }
            }
        });
        sessionStorage.setItem('orderData', JSON.stringify(data));
        return(data);  // Draw the chart with the processed data

    } catch (error) {
        sessionStorage.removeItem('orderData');
        console.error('Error fetching Firestore data: ', error);
    }
}

// Draw the order tracking chart using Chart.js
function drawOrderChart(orderData) {
    var ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: orderData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Fetch order data and initialize chart

    
















window.onload = async function() {
    await calculatedata();
    const orderData = await fetchOrderData(); // Fetch order data
    drawOrderChart(orderData);  
};


