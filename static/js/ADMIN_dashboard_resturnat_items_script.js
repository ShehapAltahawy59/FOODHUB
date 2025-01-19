let currentPage = 1;
let rowsPerPage = 10;  // Define rows per page
let totalPages = 1; // Start with 1 to avoid issues before data is loaded
let totalItems = 0; 

document.addEventListener('DOMContentLoaded', function () {
    const itemCatSelect = document.getElementById('item_cat');
    const itemCatSubSelect = document.getElementById('item_cat_sub');
    const selectedRestaurantKey = 'selectedRestaurant';
    const selectedCategoryKey = 'selectedCategory';

    // Load saved selections from local storage
    const savedRestaurant = localStorage.getItem(selectedRestaurantKey);
    const savedCategory = localStorage.getItem(selectedCategoryKey);

    if (savedRestaurant) {
        console.log(savedRestaurant);
        itemCatSelect.value = savedRestaurant;
        fetch(`/get_subcategories/${savedRestaurant}`)
            .then(response => response.json())
            .then(data => {
                console.log('Subcategories fetched:', data);
                itemCatSubSelect.innerHTML = '<option value="">Select Subcategory</option>';
                if (data.subcategories && data.subcategories.length > 0) {
                    data.subcategories.forEach(subcat => {
                        const option = document.createElement('option');
                        option.value = subcat.id;
                        option.textContent = subcat.name_ar;
                        itemCatSubSelect.appendChild(option);
                    });
                    // Set the saved subcategory if it exists
                    if (savedCategory) {
                        console.log(savedCategory);
                        itemCatSubSelect.value = savedCategory;
                    }
                } else {
                    console.warn('No subcategories found.');
                }
            })
            .catch(error => console.error('Error fetching subcategories:', error));
    }

    // Save the selected restaurant to local storage
    itemCatSelect.addEventListener('change', function () {
        const categoryId = this.value;
        if (categoryId) {
            localStorage.setItem(selectedRestaurantKey, categoryId); // Save to local storage
            fetch(`/get_subcategories/${categoryId}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Subcategories fetched:', data);
                    itemCatSubSelect.innerHTML = '<option value="">Select Subcategory</option>';
                    if (data.subcategories && data.subcategories.length > 0) {
                        data.subcategories.forEach(subcat => {
                            const option = document.createElement('option');
                            option.value = subcat.id;
                            option.textContent = subcat.name_ar;
                            itemCatSubSelect.appendChild(option);
                        });
                        // Set the saved subcategory if it exists
                        if (savedCategory) {
                            itemCatSubSelect.value = savedCategory;
                        }
                    } else {
                        console.warn('No subcategories found.');
                    }
                })
                .catch(error => console.error('Error fetching subcategories:', error));
        } else {
            localStorage.removeItem(selectedRestaurantKey); // Remove from local storage if no selection
            itemCatSubSelect.innerHTML = '<option value="">Select Subcategory</option>';
        }
    });

    // Save the selected subcategory to local storage
    itemCatSubSelect.addEventListener('change', function () {
        const subcategoryId = this.value;
        if (subcategoryId) {
            localStorage.setItem(selectedCategoryKey, subcategoryId); // Save to local storage
        } else {
            localStorage.removeItem(selectedCategoryKey); // Remove from local storage if no selection
        }
    });
});


  
  


function fetchitems(page = currentPage) {
    // Make an AJAX request to the backend to get the categories for the current page
    fetch(`/get_items?rows_per_page=${rowsPerPage}&current_page=${page}`)
        .then(response => response.json())
        .then(data => {
            totalItems = data.total_items; 
            // Update the table with the fetched data
            const tableBody = document.querySelector('.style-2343');
            tableBody.innerHTML = '';  // Clear the previous table rows

            // Populate the table with new categories
            data.items.forEach(item => {
                const row = document.createElement('div');
                    row.classList.add('style-2344');
                    row.setAttribute('role', 'row');
                    row.setAttribute('data-category-id', item.item_id);
                    row.innerHTML += `
                <div role="gridcell"  data-tag="allowRowEvents" class="style-2347">
                    <div id="name_en" data-tag="allowRowEvents" class="style-2348"> ${item.name_en}</div>
                </div>
                <div role="gridcell"  data-tag="allowRowEvents" class="style-2347">
                    <div id="active" data-tag="allowRowEvents" class="style-2348"> ${item.active}</div>
                </div>
                <div role="gridcell" data-tag="allowRowEvents" class="style-2347">
                    <div id="price" data-tag="allowRowEvents" class="style-2348"> ${item.price}</div>
                </div>
                <div role="gridcell" data-tag="allowRowEvents" class="style-2347">
                    <div id="discount" data-tag="allowRowEvents" class="style-2348"> ${item.discount}</div>
                </div>
                <div  role="_gridcell" data-tag="allowRowEvents" class="style-2347">
                    <div data-tag="allowRowEvents" class="style-2348"> ${item.item_cat}</div>
                </div>
                
    
                <div role="gridcell" data-tag="allowRowEvents" class="style-2357">
                            <div class="button_div">
                                <button id="more-btn-${item.item_id}" class="style-2358 more-btn" tabindex="0" type="button" aria-label="more" aria-haspopup="true">
                                    <svg class="style-2359" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"></path>
                                    </svg>
                                </button>
                                <div id="dropdown-menu-${item.item_id}" class="dropdown-menu" style="display:none; position:absolute;">
                                    <button id="edit-btn-${item.item_id}" class="edit-btn">Edit</button>
                                    <button id="delete-btn-${item.item_id}" class="delete-btn">Delete</button>
                                </div>
                            </div>
            
                `;
                tableBody.appendChild(row); // Append the newly created row to the table

                    // Event listener for the "more" button
                    const moreBtn = row.querySelector(`.more-btn`);
                    const dropdown = row.querySelector(`.dropdown-menu`);

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
                    const deleteBtn = row.querySelector(`.delete-btn`);
                    deleteBtn.addEventListener('click', function () {
                        const categoryId = item.item_id;
                        const confirmDelete = confirm("Are you sure you want to delete this item?");
                        if (confirmDelete) {
                            // Delete category from Firestore
                            firebase.firestore().collection('items').doc(categoryId).delete().then(() => {
                                alert('Record deleted successfully');
                                location.reload(); // Reload the page to refresh the list
                            }).catch(error => {
                                console.error("Error deleting record: ", error);
                            });
                        }
                    });

                    // Edit button event listener
                    const editBtn = row.querySelector(`.edit-btn`);
                    editBtn.addEventListener('click', function () {
                        const button_div = row.querySelector('.button_div');
                        button_div.style.display = "none"; // Hide button div to prevent multiple clicks

                        // Populate editable fields
                        const activeCell = row.querySelector('#active');
                        activeCell.innerHTML = `
                            <select style="width:100%" id="active-select">
                                <option value="true" ${item.active ? 'selected' : ''}>True</option>
                                <option value="false" ${!item.active ? 'selected' : ''}>False</option>
                            </select>`;


                            row.querySelectorAll('[role="gridcell"] div').forEach(cell => {
                                if (cell.id !== "item_cat"){
                                cell.setAttribute('contenteditable', 'true');
                                cell.style.border = '1px solid #ccc'; 
                                cell.style.width="100%";
                                }
                            });

                        // Create a save button to persist changes
                        const saveBtn = document.createElement('button');
                        saveBtn.innerText = 'Save';
                        saveBtn.classList.add('style-2358', 'save-btn');
                        row.appendChild(saveBtn);
                        const div= row.querySelector('.style-2357');
                        div.appendChild(saveBtn);
                         // Append save button to the button div

                        // Event listener for the save button
                        saveBtn.addEventListener('click', function () {
                            // Gather updated values
                            const updatedCategory = {
                                name_en: row.querySelector('#name_en').innerText,
                                active: row.querySelector('#active-select').value === 'true',
                                discount: row.querySelector('#discount').innerText,
                                price:row.querySelector('#price').innerText,
                            };

                            // Update Firestore document
                            firebase.firestore().collection('items').doc(item.item_id).update(updatedCategory).then(() => {
                                alert('Record updated successfully');
                                location.reload(); // Reload the page to see updates
                            }).catch(error => {
                                console.error("Error updating record: ", error);
                            });
                        });
                    });
                
            });

            // Update total pages and pagination display
            totalPages = data.total_pages;
            document.querySelector('.style-2534').innerText = `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, data.total_categories)} of ${data.total_categories}`;

            // Update button states after fetching
            updatePagination();
        });
}

function updatePagination() {
    const pageInfo = document.querySelector('.style-2534');
    const firstItem = (currentPage - 1) * rowsPerPage + 1;
    const lastItem = Math.min(currentPage * rowsPerPage, totalItems);

    pageInfo.textContent = `${firstItem}-${lastItem} of ${totalItems}`;
    
    // Update button states
    console.log(currentPage);
    if (currentPage === 1){
        document.querySelector('.style-2536').disabled = true;
        document.querySelector('.style-2536').style.cursor="default"
        document.querySelector('.style-2537').disabled = true;
        document.querySelector('.style-2537').style.cursor="default"

    }
    else{
        document.querySelector('.style-2536').disabled = false;
        document.querySelector('.style-2536').style.cursor="pointer"
        document.querySelector('.style-2537').disabled = false;
        document.querySelector('.style-2537').style.cursor="pointer"
    }
    if (currentPage != totalPages){
        document.querySelector('.style-2538').disabled = false;
        document.querySelector('.style-2538').style.cursor="pointer"
        document.querySelector('.style-2539').disabled = false;
        document.querySelector('.style-2539').style.cursor="pointer"

    }
    else{
        document.querySelector('.style-2538').disabled = true;
        document.querySelector('.style-2538').style.cursor="default"
        document.querySelector('.style-2539').disabled = true;
        document.querySelector('.style-2539').style.cursor="default"
    }
       // Previous button
    // Last page button
}

// Event listeners for buttons
document.querySelector('.style-2538').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchitems(currentPage); // Fetch new data for next page
    }
});

document.querySelector('.style-2537').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchitems(currentPage); // Fetch data for previous page
    }
});

document.querySelector('.style-2536').addEventListener('click', () => {
    currentPage = 1;
    fetchitems(currentPage); // Fetch first page data
});

document.querySelector('.style-2539').addEventListener('click', () => {
    currentPage = totalPages;
    fetchitems(currentPage); // Fetch last page data
});

document.getElementById('rows-per-page').addEventListener('change', (event) => {
    rowsPerPage = parseInt(event.target.value, 10);  // Get the new rows per page value
    console.log(rowsPerPage);
    currentPage = 1;  // Reset to the first page after changing rows per page
    fetchitems(currentPage);  // Fetch new data with updated rows per page
});

// Initialize the pagination state and load first page data
fetchitems();


const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function () {
    const searchValue = searchInput.value.toLowerCase();
    console.log(searchValue);
    fetch(`/search_in_items?search=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            totalItems = data.total_items; 
            // Update the table with the fetched data
            const tableBody = document.querySelector('.style-2343');
            tableBody.innerHTML = '';  // Clear the previous table rows

            // Populate the table with new categories
            data.items.forEach(item => {
                if (item.name_en.toLowerCase().includes(searchValue)) {
                const row = document.createElement('div');
                    row.classList.add('style-2344');
                    row.setAttribute('role', 'row');
                    row.setAttribute('data-category-id', item.item_id);
                    row.innerHTML += `
                <div role="gridcell"  data-tag="allowRowEvents" class="style-2347">
                    <div id="name_en" data-tag="allowRowEvents" class="style-2348"> ${item.name_en}</div>
                </div>
                <div role="gridcell"  data-tag="allowRowEvents" class="style-2347">
                    <div id="active" data-tag="allowRowEvents" class="style-2348"> ${item.active}</div>
                </div>
                <div role="gridcell" data-tag="allowRowEvents" class="style-2347">
                    <div id="price" data-tag="allowRowEvents" class="style-2348"> ${item.price}</div>
                </div>
                <div role="gridcell" data-tag="allowRowEvents" class="style-2347">
                    <div id="discount" data-tag="allowRowEvents" class="style-2348"> ${item.discount}</div>
                </div>
                <div  role="_gridcell" data-tag="allowRowEvents" class="style-2347">
                    <div data-tag="allowRowEvents" class="style-2348"> ${item.item_cat}</div>
                </div>
                
    
                <div role="gridcell" data-tag="allowRowEvents" class="style-2357">
                            <div class="button_div">
                                <button id="more-btn-${item.item_id}" class="style-2358 more-btn" tabindex="0" type="button" aria-label="more" aria-haspopup="true">
                                    <svg class="style-2359" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"></path>
                                    </svg>
                                </button>
                                <div id="dropdown-menu-${item.item_id}" class="dropdown-menu" style="display:none; position:absolute;">
                                    <button id="edit-btn-${item.item_id}" class="edit-btn">Edit</button>
                                    <button id="delete-btn-${item.item_id}" class="delete-btn">Delete</button>
                                </div>
                            </div>
            
                `;
                tableBody.appendChild(row); // Append the newly created row to the table

                    // Event listener for the "more" button
                    const moreBtn = row.querySelector(`.more-btn`);
                    const dropdown = row.querySelector(`.dropdown-menu`);

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
                    const deleteBtn = row.querySelector(`.delete-btn`);
                    deleteBtn.addEventListener('click', function () {
                        const categoryId = item.item_id;
                        const confirmDelete = confirm("Are you sure you want to delete this item?");
                        if (confirmDelete) {
                            // Delete category from Firestore
                            firebase.firestore().collection('items').doc(categoryId).delete().then(() => {
                                alert('Record deleted successfully');
                                location.reload(); // Reload the page to refresh the list
                            }).catch(error => {
                                console.error("Error deleting record: ", error);
                            });
                        }
                    });

                    // Edit button event listener
                    const editBtn = row.querySelector(`.edit-btn`);
                    editBtn.addEventListener('click', function () {
                        const button_div = row.querySelector('.button_div');
                        button_div.style.display = "none"; // Hide button div to prevent multiple clicks

                        // Populate editable fields
                        const activeCell = row.querySelector('#active');
                        activeCell.innerHTML = `
                            <select style="width:100%" id="active-select">
                                <option value="true" ${item.active ? 'selected' : ''}>True</option>
                                <option value="false" ${!item.active ? 'selected' : ''}>False</option>
                            </select>`;


                            row.querySelectorAll('[role="gridcell"] div').forEach(cell => {
                                if (cell.id !== "item_cat"){
                                cell.setAttribute('contenteditable', 'true');
                                cell.style.border = '1px solid #ccc'; 
                                cell.style.width="100%";
                                }
                            });

                        // Create a save button to persist changes
                        const saveBtn = document.createElement('button');
                        saveBtn.innerText = 'Save';
                        saveBtn.classList.add('style-2358', 'save-btn');
                        row.appendChild(saveBtn);
                        const div= row.querySelector('.style-2357');
                        div.appendChild(saveBtn);
                         // Append save button to the button div

                        // Event listener for the save button
                        saveBtn.addEventListener('click', function () {
                            // Gather updated values
                            const updatedCategory = {
                                name_en: row.querySelector('#name_en').innerText,
                                active: row.querySelector('#active-select').value === 'true',
                                discount: row.querySelector('#discount').innerText,
                                price:row.querySelector('#price').innerText,
                            };

                            // Update Firestore document
                            firebase.firestore().collection('items').doc(item.item_id).update(updatedCategory).then(() => {
                                alert('Record updated successfully');
                                location.reload(); // Reload the page to see updates
                            }).catch(error => {
                                console.error("Error updating record: ", error);
                            });
                        });
                    });
                
            
            }    });

            // Update total pages and pagination display
            totalPages = data.total_pages;
            document.querySelector('.style-2534').innerText = `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, data.total_categories)} of ${data.total_categories}`;

            // Update button states after fetching
            updatePagination();
        });



    });
