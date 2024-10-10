document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
});
// Function to add item to the cart
function addToCart(item) {
    
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
    displayCartItems();
    console.log('Item added to cart:', item);
    updatecardcount();
}

// Function to add item to the cart
function removeFromCart(item) {
    
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
    displayCartItems();
    console.log('Item added to cart:', item);
    updatecardcount();

}

// Example item to add
// const item = {
//     id: 1,
//     name: "Product Name",
//     price: 29.99,
//     quantity: 1
// };

// Add the item to the cart


// Function to get the cart items from localStorage


// Function to display the cart items
// function displayCartItems() {
//     const cart = getCartItems();
    
//     if (cart.length === 0) {
//         console.log('Cart is empty');
//         return;
//     }

//     cart.forEach(item => {
//         console.log(`Product: ${item.name}, Quantity: ${item.quantity}, Price: ${item.price}`);
//     });
// }

// Function to update the quantity of an item in the cart
function updateCartItem(id, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const itemIndex = cart.findIndex(cartItem => cartItem.id === id);
    
    if (itemIndex !== -1) {
        // Update the item quantity
        cart[itemIndex].quantity = newQuantity;

        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        console.log('Cart item updated:', cart[itemIndex]);
    } else {
        console.log('Item not found in cart');
    }
}


// Function to remove an item from the cart
// function removeFromCart(id) {
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
//     // Filter out the item with the matching id
//     cart = cart.filter(cartItem => cartItem.id !== id);

//     // Save the updated cart back to localStorage
//     localStorage.setItem('cart', JSON.stringify(cart));

//     console.log('Item removed from cart:', id);
// }

// Function to clear the entire cart






function displayCartItems() {
    try{
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.querySelector('.style-22');
    container.style ="position: sticky; top: 100px; padding: 0px 5px;top:100px;padding:0px 5px;";

    // Clear the existing cart display
    

    if (cart.length === 0) {
        container.innerHTML = `
        <div style="border-radius: 20px; padding: 30px 20px;padding:30px 20px;display:flex;-webkit-box-align:center;align-items:center;">
        <div style="display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;"><img src="data:image/png;base64,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" alt="rider" style="filter: invert(0);" /></div>
        <div style="display: flex; justify-content: center; flex-direction: column; margin-left: 5px;justify-content:center;flex-direction:column;margin-left:5px;">
            <p style="font-weight: 600; font-size: 1.275rem; line-height: 1.5; letter-spacing: 0.00938em; font-family: Poppins, &quot;Open Sans&quot;, sans-serif; color: rgb(0, 0, 0);font-size:20.4px;line-height:30.6px;letter-spacing:0.191352px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(0, 0, 0);margin:0px;text-align:left;">Your Cart</p>
            <h6 style="font-size: 0.875rem; margin-top: 10px;margin-top:10px;font-weight:700;margin:10px 0px 0px;line-height:22.4px;letter-spacing:0.105px;font-family:Poppins, 'Open Sans', sans-serif;text-align:center;color:rgb(33, 33, 33);">Start adding items to your cart</h6>
        </div>
    </div>
    <div style="max-width:1200px;padding-left:24px;padding-right:24px;width: 100%;margin-left: auto;box-sizing:border-box;margin-right: auto;display:block;">
        <div style="display: flex; justify-content: space-between; margin-top: 48px;justify-content:space-between;margin-top:48px;">
            <p style="font-size:14px;margin:0px;font-weight:400;line-height:21px;letter-spacing:0.13132px;font-family:Poppins, 'Open Sans', sans-serif;">SubTotal</p>
            <p style="font-size:14px;margin:0px;font-weight:400;line-height:21px;letter-spacing:0.13132px;font-family:Poppins, 'Open Sans', sans-serif;">$ 0.00</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 16px;justify-content:space-between;margin-top:16px;">
            <p style="font-size:14px;font-weight:700;margin:0px;line-height:21px;letter-spacing:0.13132px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(33, 33, 33);">Total (Incl. TAX)</p>
            <p style="font-size:14px;font-weight:700;margin:0px;line-height:21px;letter-spacing:0.13132px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(33, 33, 33);">$ 0.00</p>
        </div>
        <div style="display: flex; justify-content: center; margin-top: 16px;justify-content:center;margin-top:16px;">
        <button tabindex="-1" type="button" disabled="" style="width: 100%;padding:10px 0px;background:rgb(189, 189, 189) none repeat scroll 0% 0% / auto padding-box border-box;border-radius:0px;color:rgba(0, 0, 0, 0.26);pointer-events:none;cursor:default;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:relative;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);background-color:rgb(189, 189, 189);outline:rgba(0, 0, 0, 0.26) none 0px;border:0px none rgba(0, 0, 0, 0.26);margin:0px;user-select:none;vertical-align:middle;appearance:none;text-decoration:none solid rgba(0, 0, 0, 0.26);font-weight:500;font-size:14px;line-height:24.5px;letter-spacing:0.39998px;text-transform:uppercase;font-family:Poppins, 'Open Sans', sans-serif;min-width:64px;transition:background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s cubic-bezier(0.4, 0, 0.2, 1);">
                <p style="font-size:14px;font-family:Poppins, 'Open Sans', sans-serif;font-weight:700;line-height:22.4px;letter-spacing:0.105px;color:rgb(255, 255, 255);margin:0px;">GO TO CHECKOUT</p>
            </button></div>
    </div>
    `
        return;
    }
    console.log(cart[0].resturant_name);
    container.innerHTML = '';
    const Div = document.createElement('div');
    Div.classList.add('card_style-0');
    Div.style = "position: sticky; top: 100px; padding: 0px 5px;top:100px;padding:0px 5px;";
    Div.innerHTML=`
    <div style="border-radius: 20px; padding: 30px 20px;padding:30px 20px;display:flex;-webkit-box-align:center;align-items:center;">
    <div style="display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;">
    <img src="data:image/png;base64,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" alt="rider" style="filter: invert(0);" />
    </div>
    <div style="margin-left: 5px;display:flex;-webkit-box-pack:center;justify-content:center;flex-direction:column;">
        <p style="font-weight: 600; font-size: 1.275rem; line-height: 1.5; letter-spacing: 0.00938em; font-family: Poppins, &quot;Open Sans&quot;, sans-serif; color: rgb(0, 0, 0);font-size:20.4px;line-height:30.6px;letter-spacing:0.191352px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(0, 0, 0);margin:0px;">Delivery Time</p>
        <p style="font-weight: 400; font-size: 0.875rem; line-height: 1.5; letter-spacing: 0.00938em; font-family: Poppins, &quot;Open Sans&quot;, sans-serif; color: rgb(90, 88, 88);font-size:14px;line-height:21px;letter-spacing:0.13132px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(90, 88, 88);margin:0px;">20 min</p>
        <h6 style="font-size: 0.78rem;font-weight:700;margin:0px;line-height:19.968px;letter-spacing:0.0936px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(33, 33, 33);">Your Order From ${cart[0].resturant_name}</h6>
    </div>
    `
    let SubTotal = 0;
    const itemcontainer = document.createElement('div');
    itemcontainer.style = "max-height: 30vh; overflow-y: scroll; padding-bottom: 16px; background: rgb(255, 255, 255); margin-bottom: 10px;overflow-y:scroll;padding-bottom:16px;background:rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box;margin-bottom:10px;max-width:1200px;padding-left:24px;padding-right:24px;width: 100%;margin-left: auto;box-sizing:border-box;margin-right: auto;display:block;";
    cart.forEach(item => {
        console.log();
        //     // Create a new div for each cart item
        SubTotal += item.price*item.quantity
            
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('card_style-8');
            itemDiv.style ="margin-top: 24px; margin-bottom: 24px;margin-bottom:24px;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:justify;justify-content:space-between;";
            itemDiv.innerHTML = `
            
            <div style="display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:justify;justify-content:space-between;">
            <button class="remove-button" tabindex="0" type="button" style="background: rgb(144, 234, 147);display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:relative;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);background-color:rgb(144, 234, 147);outline:rgba(0, 0, 0, 0.54) none 0px;border:0px none rgba(0, 0, 0, 0.54);margin:0px;cursor:pointer;user-select:none;vertical-align:middle;appearance:none;text-decoration:none solid rgba(0, 0, 0, 0.54);text-align:center;flex: 0 0 auto;border-radius:50%;overflow:visible;color:rgba(0, 0, 0, 0.54);transition:background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);padding:5px;font-size:18px;"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RemoveIcon" style="color: rgb(0, 0, 0);user-select:none;width: 1em;height:20px;display:block;fill:rgb(0, 0, 0);flex-shrink:0;transition:fill 0.2s cubic-bezier(0.4, 0, 0.2, 1);font-size:20px;">
                        <path d="M19 13H5v-2h14z"></path>
                    </svg><span style="overflow:hidden;pointer-events:none;position:absolute;z-index:0;inset:0px;border-radius:50%;"></span></button>
                <p style="font-weight: 700; font-size: 0.75rem; line-height: 1.66; letter-spacing: 0.03333em; font-family: Poppins, &quot;Open Sans&quot;, sans-serif; color: rgb(0, 0, 0); padding: 5px 10px; border-radius: 5px; margin: 0px 8px;font-size:12px;line-height:19.92px;letter-spacing:0.39996px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(0, 0, 0);padding:5px 10px;border-radius:5px;margin:0px 8px;">${item.quantity}</p>
                <button  class="add-button" tabindex="0" type="button" style="background: rgb(144, 234, 147);display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:relative;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);background-color:rgb(144, 234, 147);outline:rgba(0, 0, 0, 0.54) none 0px;border:0px none rgba(0, 0, 0, 0.54);margin:0px;cursor:pointer;user-select:none;vertical-align:middle;appearance:none;text-decoration:none solid rgba(0, 0, 0, 0.54);text-align:center;flex: 0 0 auto;border-radius:50%;overflow:visible;color:rgba(0, 0, 0, 0.54);transition:background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);padding:5px;font-size:18px;"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon" style="color: rgb(0, 0, 0);user-select:none;width: 1em;height:20px;display:block;fill:rgb(0, 0, 0);flex-shrink:0;transition:fill 0.2s cubic-bezier(0.4, 0, 0.2, 1);font-size:20px;">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path>
                    </svg><span style="overflow:hidden;pointer-events:none;position:absolute;z-index:0;inset:0px;border-radius:50%;"></span></button>
            </div>
            <div style="display:flex;flex-direction:column;-webkit-box-flex:1;flex-grow:1;margin-left:8px;-webkit-box-pack:end;justify-content:flex-end;">
                <div style="flex-grow: 1;display:flex;-webkit-box-pack:justify;justify-content:space-between;align-items:flex-end;">
                    <div class="MuiBox-root css-0">
                        <p style="color:rgb(144, 234, 147);font-size:16px;font-family:Poppins, 'Open Sans', sans-serif;font-weight:700;line-height:24px;letter-spacing:0.15008px;margin:0px;">${item.name}</p>
                    </div>
                    <div class="MuiBox-root css-0">
                        <p style="color: rgb(0, 0, 0);font-size:14px;font-family:Poppins, 'Open Sans', sans-serif;font-weight:400;line-height:21px;letter-spacing:0.13132px;margin:0px;"> $ ${item.price}</p>
                    </div>
                </div>
            </div>
        
    `;           
    itemcontainer.appendChild(itemDiv);
    const removeButton = itemDiv.querySelector('.remove-button');
    const addButton = itemDiv.querySelector('.add-button');

    removeButton.addEventListener('click', () => {
        removeFromCart(item); // Call your function with the item data
    });

    addButton.addEventListener('click', () => {
        // Define what happens when the add button is clicked
        // You might want to increment the quantity or something else
        
        addToCart(item); // Call your function with updated data
    });
    
            });
Div.appendChild(itemcontainer);
const resultDiv = document.createElement('div');
resultDiv.classList.add('card_style-23');
resultDiv.style = "padding-top: 16px; background: rgb(255, 255, 255);background:rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box;max-width:1200px;padding-left:24px;padding-right:24px;width: 100%;margin-left: auto;box-sizing:border-box;margin-right: auto;display:block;";
resultDiv.innerHTML = `
<div style="display: flex; justify-content: space-between; margin-top: 8px;justify-content:space-between;margin-top:8px;border-bottom:1px solid rgb(158, 158, 158);">
            <p style="font-size:14px;font-family:Poppins, 'Open Sans', sans-serif;font-weight:400;line-height:21px;letter-spacing:0.13132px;margin:0px;">SubTotal</p>
            <p style="font-size:14px;font-family:Poppins, 'Open Sans', sans-serif;font-weight:400;line-height:21px;letter-spacing:0.13132px;margin:0px;">$ ${SubTotal}</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px;justify-content:space-between;margin-top:8px;border-bottom:1px solid rgb(158, 158, 158);">
            <p style="font-size:14px;font-family:Poppins, 'Open Sans', sans-serif;font-weight:400;line-height:21px;letter-spacing:0.13132px;margin:0px;">Delivery Fee</p>
            <p style="font-size:14px;font-family:Poppins, 'Open Sans', sans-serif;font-weight:400;line-height:21px;letter-spacing:0.13132px;margin:0px;">$ 0</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px;justify-content:space-between;margin-top:8px;border-bottom:1px solid rgb(158, 158, 158);">
            <p style="font-size:14px;font-family:Poppins, 'Open Sans', sans-serif;font-weight:400;line-height:21px;letter-spacing:0.13132px;margin:0px;">Tax Charges</p>
            <p style="font-size:14px;font-family:Poppins, 'Open Sans', sans-serif;font-weight:400;line-height:21px;letter-spacing:0.13132px;margin:0px;">$ 0</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 16px;justify-content:space-between;margin-top:16px;">
            <p style="font-weight: 700; color: rgb(33, 33, 33);color:rgb(33, 33, 33);font-size:14px;font-family:Poppins, 'Open Sans', sans-serif;line-height:21px;letter-spacing:0.13132px;margin:0px;">Total (Inc. TAX)</p>
            <p style="font-weight: 700; color: rgb(33, 33, 33);color:rgb(33, 33, 33);font-size:14px;font-family:Poppins, 'Open Sans', sans-serif;line-height:21px;letter-spacing:0.13132px;margin:0px;">$ ${SubTotal}</p>
        </div>
        <div style="display:flex;-webkit-box-align:center;align-items:center;">
            <div style="display:flex;-webkit-box-align:center;align-items:center;">
                <p style="font-weight: 700; color: rgb(33, 33, 33); font-size: 0.975rem;color:rgb(33, 33, 33);font-size:15.6px;margin:0px;line-height:23.4px;letter-spacing:0.146328px;font-family:Poppins, 'Open Sans', sans-serif;">$ ${SubTotal}</p>
            </div>
            <div style="-webkit-box-flex:1;flex-grow:1;margin-left:16px;"><a href="/cart" style="text-decoration: none;"><button tabindex="0" type="button" style="background: rgb(144, 234, 147); margin: 16px 0px; border-radius: 10px;margin:16px 0px;border-radius:10px;width: 100%;padding:10px 0px;display:inline-flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:relative;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);background-color:rgb(144, 234, 147);outline:rgb(144, 234, 147) none 0px;border:0px none rgb(144, 234, 147);cursor:pointer;user-select:none;vertical-align:middle;appearance:none;text-decoration:none solid rgb(144, 234, 147);font-weight:500;font-size:14px;line-height:24.5px;letter-spacing:0.39998px;text-transform:uppercase;font-family:Poppins, 'Open Sans', sans-serif;min-width:64px;transition:background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s cubic-bezier(0.4, 0, 0.2, 1);color:rgb(144, 234, 147);">
                        <p style="color: rgb(0, 0, 0);font-size:14px;font-family:Poppins, 'Open Sans', sans-serif;font-weight:700;line-height:22.4px;letter-spacing:0.105px;margin:0px;">GO TO CHECKOUT</p><span style="overflow:hidden;pointer-events:none;position:absolute;z-index:0;inset:0px;border-radius:10px;"></span>
                    </button></a></div>
        </div>
`
    
Div.appendChild(resultDiv);
container.appendChild(Div);
}
catch{
    
}
}
