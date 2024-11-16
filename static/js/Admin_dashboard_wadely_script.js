let currentPage = 1;
let rowsPerPage = 10;  // Define rows per page
let totalPages = 1; // Start with 1 to avoid issues before data is loaded
let totalItems = 0; 
function fetchlogin_wadelys(page = currentPage) {
    // Make an AJAX request to the backend to get the categories for the current page
    fetch(`/get_login_wadely?rows_per_page=${rowsPerPage}&current_page=${page}`)
        .then(response => response.json())
        .then(data => {
            totalItems = data.total_login_wadely; 
            // Update the table with the fetched data
            const tableBody = document.querySelector('.style-164');
            tableBody.innerHTML = '';  // Clear the previous table rows

            
            // Populate the table with new categories
            data.login_wadely.forEach(login_wadely => {
                
                    const row = document.createElement('div');
                    row.classList.add('style-165');
                    row.setAttribute('role', 'row');
                    row.setAttribute('data-category-id', login_wadely.phone);
                    row.innerHTML += `
                            <div id=name${login_wadely.phone} role="gridcell" class="style-168"><div>${login_wadely.name}</div></div>
                            <div id=password${login_wadely.phone} role="gridcell" class="style-170"><div>${login_wadely.password}</div></div>
                            <div id=phone${login_wadely.phone} role="gridcell" class="style-172"><div>${login_wadely.phone}</div></div>
                            <div id=active${login_wadely.phone} role="gridcell" class="style-174"><div>${login_wadely.active}</div></div>
                            <div id=total_orders${login_wadely.phone} role="gridcell" class="style-176"><div>${login_wadely.total_orders}</div></div>
                            <div id=address${login_wadely.phone} role="gridcell" class="style-176"><div>${login_wadely.address}</div></div>
                            <div role="gridcell" data-tag="allowRowEvents" class="style-185">
                            <div class="button_div">
                                <button id="more-btn${login_wadely.phone}" class="style-186 more-btn" tabindex="0" type="button" aria-label="more" aria-haspopup="true">
                                    <svg class="style-187" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"></path>
                                    </svg>
                                </button>
                                <div id="dropdown-menu${login_wadely.phone}" class="dropdown-menu" style="display:none; position:absolute;">
                                    <button id="edit-btn${login_wadely.phone}" class="edit-btn">Edit</button>
                                    <button id="delete-btn${login_wadely.phone}" class="delete-btn">Delete</button>
                                </div>
                            </div>
                        
                    `;
                    tableBody.appendChild(row);

                    const moreBtn = row.querySelector(`#more-btn${login_wadely.phone}`);
                    const dropdown = row.querySelector(`#dropdown-menu${login_wadely.phone}`);

                    // Bind click event to the "more" button
                    moreBtn.addEventListener('click', function (event) {
                        // Toggle dropdown visibility
                        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                        // Close dropdown when clicking outside
                        document.addEventListener('click', function closeDropdown(e) {
                            if (!dropdown.contains(e.target) && e.target !== moreBtn) {
                                dropdown.style.display = 'none';
                                document.removeEventListener('click', closeDropdown); // Clean up listener
                            }
                        });
                    });

                    // Delete button event listener
                    const deleteBtn = row.querySelector(`#delete-btn${login_wadely.phone}`);
                    deleteBtn.addEventListener('click', function () {
                        const confirmDelete = confirm("Are you sure you want to delete this item?");
                        if (confirmDelete) {
                            const db = firebase.firestore();
                            const constantsRef = db.collection('constants');
                        
                            constantsRef.limit(1).get().then((querySnapshot) => {
                                if (!querySnapshot.empty) {
                                    const doc = querySnapshot.docs[0];
                                    const data = doc.data();
                                    const login_wadelyMap = data.login_wadely;
                        
                                    // Filter out the entry where the name matches ride.name
                                    const indexToDelete = login_wadelyMap.findIndex(login_wadely_item => login_wadely_item.name === login_wadely.name);

                                    if (indexToDelete !== -1) {
                                        // Remove the specific entry from the array
                                        login_wadelyMap.splice(indexToDelete, 1);
                                    
                                        // Fetch the 'constants' document and update it
                                        firebase.firestore().collection('constants').get().then((querySnapshot) => {
                                            if (!querySnapshot.empty) {
                                                // Assuming there is only one document in 'constants' collection
                                                const doc = querySnapshot.docs[0];
                                                doc.ref.update({
                                                    login_wadely: login_wadelyMap
                                                }).then(() => {
                                                    alert('Record deleted successfully');
                                                    location.reload(); // Reload to see the updated list
                                                }).catch(error => {
                                                    console.error("Error deleting record: ", error);
                                                });
                                            } else {
                                                console.error("No document found in 'constants' collection");
                                            }
                                        }).catch(error => {
                                            console.error("Error fetching document: ", error);
                                        });
                                    } else {
                                        alert("No matching delivery man found");
                                    }
                                } else {
                                    console.log("No document found in 'constants' collection.");
                                }
                            }).catch((error) => {
                                console.error('Error getting document: ', error);
                            });
                        }
                    });

                    // Edit button event listener
                    const editBtn = row.querySelector(`#edit-btn${login_wadely.phone}`);
                    editBtn.addEventListener('click', function () {
                        const button_div = row.querySelector('.button_div');
                        button_div.style.display = "none"; // Hide button div to prevent multiple clicks

                        // Populate editable fields
                        const activeCell = row.querySelector(`#active${login_wadely.phone}`);
                        activeCell.innerHTML = `
                            <select style="width:100%" id="active_select${login_wadely.phone}">
                                <option value="true" ${login_wadely.active ? 'selected' : ''}>True</option>
                                <option value="false" ${!login_wadely.active ? 'selected' : ''}>False</option>
                            </select>`;


                            row.querySelectorAll('[role="gridcell"] div').forEach(cell => {
                                
                                cell.setAttribute('contenteditable', 'true');
                                cell.style.border = '1px solid #ccc'; 
                                cell.style.width="100%";
                                
                            });

                        // Create a save button to persist changes
                        const saveBtn = document.createElement('button');
                        saveBtn.innerText = 'Save';
                        saveBtn.classList.add('style-186', 'save-btn');
                        row.appendChild(saveBtn);
                        const div= row.querySelector('.style-185');
                        div.appendChild(saveBtn);
                         // Append save button to the button div

                        // Event listener for the save button
                        saveBtn.addEventListener('click', function () {
                            // Gather updated values
                            const updatedlogin_wadely = {
                                name: row.querySelector(`#name${login_wadely.phone}`).innerText,
                                active: row.querySelector(`#active_select${login_wadely.phone}`).value === 'true',
                                password: row.querySelector(`#password${login_wadely.phone}`).innerText,
                                phone: row.querySelector(`#phone${login_wadely.phone}`).innerText,
                                total_orders: parseFloat(row.querySelector(`#total_orders${login_wadely.phone}`).innerText),
                                address: row.querySelector(`#address${login_wadely.phone}`).innerText,
                            };
                        
                            // Reference the Firestore document in 'constants' collection
                            const db = firebase.firestore();
                            const constantsRef = db.collection('constants').limit(1);
                        
                            constantsRef.get().then((querySnapshot) => {
                                if (!querySnapshot.empty) {
                                    const doc = querySnapshot.docs[0];
                                    const docRef = doc.ref;
                        
                                    // Retrieve the 'delivery_men' array from the document
                                    let login_wadelyArray = doc.data().login_wadely;
                        
                                    // Find the index of the rider to update in the array
                                    const indexToUpdate = login_wadelyArray.findIndex(item => item.phone === login_wadely.phone);
                        
                                    if (indexToUpdate !== -1) {
                                        // Update the specific entry with the new data
                                        login_wadelyArray[indexToUpdate] = updatedlogin_wadely;
                        
                                        // Write the updated array back to Firestore
                                        docRef.update({ login_wadely: login_wadelyArray })
                                            .then(() => {
                                                alert('Record updated successfully');
                                                location.reload(); // Reload the page to see updates
                                            })
                                            .catch(error => {
                                                console.error("Error updating record: ", error);
                                            });
                                    } else {
                                        alert("No matching delivery man found.");
                                    }
                                } else {
                                    console.log("No document found in 'constants' collection.");
                                }
                            }).catch(error => {
                                console.error('Error accessing document: ', error);
                            });
                        });
                        
                    });
        });

            // Update total pages and pagination display
            totalPages = data.total_pages;
            document.querySelector('.style-425').innerText = `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, data.total_categories)} of ${data.total_categories}`;

            // Update button states after fetching
            updatePagination();
        });
}

function updatePagination() {
    const pageInfo = document.querySelector('.style-425');
    const firstItem = (currentPage - 1) * rowsPerPage + 1;
    const lastItem = Math.min(currentPage * rowsPerPage, totalItems);

    pageInfo.textContent = `${firstItem}-${lastItem} of ${totalItems}`;
    
    // Update button states
    console.log(currentPage);
    if (currentPage === 1){
        document.querySelector('.style-428').disabled = true;
        document.querySelector('.style-428').style.cursor="default"
        document.querySelector('.style-427').disabled = true;
        document.querySelector('.style-427').style.cursor="default"

    }
    else{
        document.querySelector('.style-428').disabled = false;
        document.querySelector('.style-428').style.cursor="pointer"
        document.querySelector('.style-427').disabled = false;
        document.querySelector('.style-427').style.cursor="pointer"
    }
    if (currentPage != totalPages){
        document.querySelector('.style-429').disabled = false;
        document.querySelector('.style-429').style.cursor="pointer"
        document.querySelector('.style-430').disabled = false;
        document.querySelector('.style-430').style.cursor="pointer"

    }
    else{
        document.querySelector('.style-429').disabled = true;
        document.querySelector('.style-429').style.cursor="default"
        document.querySelector('.style-430').disabled = true;
        document.querySelector('.style-430').style.cursor="default"
    }
       // Previous button
    document.querySelector('.style-429').disabled = currentPage === totalPages; // Next button
       // First page button
    document.querySelector('.style-430').disabled = currentPage === totalPages; // Last page button
}

// Event listeners for buttons
document.querySelector('.style-429').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchlogin_wadelys(currentPage); // Fetch new data for next page
    }
});

document.querySelector('.style-428').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchlogin_wadelys(currentPage); // Fetch data for previous page
    }
});

document.querySelector('.style-427').addEventListener('click', () => {
    currentPage = 1;
    fetchlogin_wadelys(currentPage); // Fetch first page data
});

document.querySelector('.style-430').addEventListener('click', () => {
    currentPage = totalPages;
    fetchlogin_wadelys(currentPage); // Fetch last page data
});

document.getElementById('rows-per-page').addEventListener('change', (event) => {
    rowsPerPage = parseInt(event.target.value, 10);  // Get the new rows per page value
    console.log(rowsPerPage);
    currentPage = 1;  // Reset to the first page after changing rows per page
    fetchlogin_wadelys(currentPage);  // Fetch new data with updated rows per page
});

// Initialize the pagination state and load first page data
fetchlogin_wadelys();


// Get the search input element
const searchInput = document.getElementById('searchInput');

// Listen for user input
searchInput.addEventListener('input', function () {
    const searchValue = searchInput.value.toLowerCase();  // Get the input value and convert it to lowercase
    console.log(searchValue);
    // Fetch all the categories again (you can use the existing fetch or you can filter client-side data)
    fetch(`/search_in_login_wadely?search=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            // Update the table with the filtered data
            const tableBody = document.querySelector('.style-164');
            tableBody.innerHTML = '';  // Clear the previous table rows

            // Loop through the filtered categories and display them
            data.login_wadelys.forEach(login_wadely => {
                if (login_wadely.name.toLowerCase().includes(searchValue)) {  // Filter by name
                    const row = document.createElement('div');
                    row.classList.add('style-165');
                    row.setAttribute('role', 'row');
                    row.setAttribute('data-category-id', login_wadely.phone);
                    row.innerHTML += `
                    <div id=name${login_wadely.phone} role="gridcell" class="style-168"><div>${login_wadely.name}</div></div>
                    <div id=password${login_wadely.phone} role="gridcell" class="style-170"><div>${login_wadely.password}</div></div>
                    <div id=phone${login_wadely.phone} role="gridcell" class="style-172"><div>${login_wadely.phone}</div></div>
                    <div id=active${login_wadely.phone} role="gridcell" class="style-174"><div>${login_wadely.active}</div></div>
                    <div id=total_orders${login_wadely.phone} role="gridcell" class="style-176"><div>${login_wadely.total_orders}</div></div>
                    <div id=address${login_wadely.phone} role="gridcell" class="style-176"><div>${login_wadely.address}</div></div>
                    <div role="gridcell" data-tag="allowRowEvents" class="style-185">
                    <div class="button_div">
                        <button id="more-btn${login_wadely.phone}" class="style-186 more-btn" tabindex="0" type="button" aria-label="more" aria-haspopup="true">
                            <svg class="style-187" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"></path>
                            </svg>
                        </button>
                        <div id="dropdown-menu${login_wadely.phone}" class="dropdown-menu" style="display:none; position:absolute;">
                            <button id="edit-btn${login_wadely.phone}" class="edit-btn">Edit</button>
                            <button id="delete-btn${login_wadely.phone}" class="delete-btn">Delete</button>
                        </div>
                    </div>
                
            `;
                    tableBody.appendChild(row);

                    const moreBtn = row.querySelector(`#more-btn${login_wadely.phone}`);
                    const dropdown = row.querySelector(`#dropdown-menu${login_wadely.phone}`);

                    // Bind click event to the "more" button
                    moreBtn.addEventListener('click', function (event) {
                        // Toggle dropdown visibility
                        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                        // Close dropdown when clicking outside
                        document.addEventListener('click', function closeDropdown(e) {
                            if (!dropdown.contains(e.target) && e.target !== moreBtn) {
                                dropdown.style.display = 'none';
                                document.removeEventListener('click', closeDropdown); // Clean up listener
                            }
                        });
                    });

                    // Delete button event listener
                    const deleteBtn = row.querySelector(`#delete-btn${login_wadely.phone}`);
                    deleteBtn.addEventListener('click', function () {
                        const confirmDelete = confirm("Are you sure you want to delete this item?");
                        if (confirmDelete) {
                            const db = firebase.firestore();
                            const constantsRef = db.collection('constants');
                        
                            constantsRef.limit(1).get().then((querySnapshot) => {
                                if (!querySnapshot.empty) {
                                    const doc = querySnapshot.docs[0];
                                    const data = doc.data();
                                    const login_wadelyMap = data.login_wadely;
                        
                                    // Filter out the entry where the name matches ride.name
                                    const indexToDelete = login_wadelyMap.findIndex(login_wadely_item => login_wadely_item.name === login_wadely.name);

                                    if (indexToDelete !== -1) {
                                        // Remove the specific entry from the array
                                        login_wadelyMap.splice(indexToDelete, 1);
                                    
                                        // Fetch the 'constants' document and update it
                                        firebase.firestore().collection('constants').get().then((querySnapshot) => {
                                            if (!querySnapshot.empty) {
                                                // Assuming there is only one document in 'constants' collection
                                                const doc = querySnapshot.docs[0];
                                                doc.ref.update({
                                                    login_wadely: login_wadelyMap
                                                }).then(() => {
                                                    alert('Record deleted successfully');
                                                    location.reload(); // Reload to see the updated list
                                                }).catch(error => {
                                                    console.error("Error deleting record: ", error);
                                                });
                                            } else {
                                                console.error("No document found in 'constants' collection");
                                            }
                                        }).catch(error => {
                                            console.error("Error fetching document: ", error);
                                        });
                                    } else {
                                        alert("No matching delivery man found");
                                    }
                                } else {
                                    console.log("No document found in 'constants' collection.");
                                }
                            }).catch((error) => {
                                console.error('Error getting document: ', error);
                            });
                        }
                    });

                    // Edit button event listener
                    const editBtn = row.querySelector(`#edit-btn${login_wadely.phone}`);
                    editBtn.addEventListener('click', function () {
                        const button_div = row.querySelector('.button_div');
                        button_div.style.display = "none"; // Hide button div to prevent multiple clicks

                        // Populate editable fields
                        const activeCell = row.querySelector(`#active${login_wadely.phone}`);
                        activeCell.innerHTML = `
                            <select style="width:100%" id="active_select${login_wadely.phone}">
                                <option value="true" ${login_wadely.active ? 'selected' : ''}>True</option>
                                <option value="false" ${!login_wadely.active ? 'selected' : ''}>False</option>
                            </select>`;


                            row.querySelectorAll('[role="gridcell"] div').forEach(cell => {
                                
                                cell.setAttribute('contenteditable', 'true');
                                cell.style.border = '1px solid #ccc'; 
                                cell.style.width="100%";
                                
                            });

                        // Create a save button to persist changes
                        const saveBtn = document.createElement('button');
                        saveBtn.innerText = 'Save';
                        saveBtn.classList.add('style-186', 'save-btn');
                        row.appendChild(saveBtn);
                        const div= row.querySelector('.style-185');
                        div.appendChild(saveBtn);
                         // Append save button to the button div

                        // Event listener for the save button
                        saveBtn.addEventListener('click', function () {
                            // Gather updated values
                            const updatedlogin_wadely = {
                                name: row.querySelector(`#name${login_wadely.phone}`).innerText,
                                active: row.querySelector(`#active_select${login_wadely.phone}`).value === 'true',
                                password: row.querySelector(`#password${login_wadely.phone}`).innerText,
                                phone: row.querySelector(`#phone${login_wadely.phone}`).innerText,
                                total_orders: parseFloat(row.querySelector(`#total_orders${login_wadely.phone}`).innerText),
                                address: row.querySelector(`#address${login_wadely.phone}`).innerText,
                            };
                        
                            // Reference the Firestore document in 'constants' collection
                            const db = firebase.firestore();
                            const constantsRef = db.collection('constants').limit(1);
                        
                            constantsRef.get().then((querySnapshot) => {
                                if (!querySnapshot.empty) {
                                    const doc = querySnapshot.docs[0];
                                    const docRef = doc.ref;
                        
                                    // Retrieve the 'delivery_men' array from the document
                                    let login_wadelyArray = doc.data().login_wadely;
                        
                                    // Find the index of the rider to update in the array
                                    const indexToUpdate = login_wadelyArray.findIndex(item => item.phone === login_wadely.phone);
                        
                                    if (indexToUpdate !== -1) {
                                        // Update the specific entry with the new data
                                        login_wadelyArray[indexToUpdate] = updatedlogin_wadely;
                        
                                        // Write the updated array back to Firestore
                                        docRef.update({ login_wadely: login_wadelyArray })
                                            .then(() => {
                                                alert('Record updated successfully');
                                                location.reload(); // Reload the page to see updates
                                            })
                                            .catch(error => {
                                                console.error("Error updating record: ", error);
                                            });
                                    } else {
                                        alert("No matching delivery man found.");
                                    }
                                } else {
                                    console.log("No document found in 'constants' collection.");
                                }
                            }).catch(error => {
                                console.error('Error accessing document: ', error);
                            });
                        });
                        
                    });
                
            
            
        }    
        });

            // Update total pages and pagination display
            // totalPages = data.total_pages;
            // document.querySelector('.style-2534').innerText = `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, data.total_categories)} of ${data.total_categories}`;

            // // Update button states after fetching
            // updatePagination();
        });
});
