let currentPage = 1;
let rowsPerPage = 10;  // Define rows per page
let totalPages = 1; // Start with 1 to avoid issues before data is loaded
let totalItems = 0; 
function fetchCategories(page = currentPage) {
    // Make an AJAX request to the backend to get the categories for the current page
    fetch(`/get_categories?rows_per_page=${rowsPerPage}&current_page=${page}`)
        .then(response => response.json())
        .then(data => {
            totalItems = data.total_categories; 
            // Update the table with the fetched data
            const tableBody = document.querySelector('.style-164');
            tableBody.innerHTML = '';  // Clear the previous table rows

            // Populate the table with new categories
            data.categories.forEach(category => {
                const row = document.createElement('div');
                    row.classList.add('style-165');
                    row.setAttribute('role', 'row');
                    row.setAttribute('data-category-id', category.id);

                    row.innerHTML = `
                        <div role="gridcell" class="style-168"><div>${category.name_en}</div></div>
                        <div role="gridcell" class="style-170"><div>${category.active}</div></div>
                        <div role="gridcell" class="style-172"><div>${category.order}</div></div>
                        <div role="gridcell" class="style-174"><div>${category.closefriday}</div></div>
                        <div role="gridcell" class="style-176"><div>${category.OpenTime.From}</div></div>
                        <div role="gridcell" class="style-176"><div>${category.OpenTime.To}</div></div>
                        <div role="gridcell" data-tag="allowRowEvents" class="style-185">
                            <div class="button_div">
                                <button id="more-btn-${category.id}" class="style-186 more-btn" tabindex="0" type="button" aria-label="more" aria-haspopup="true">
                                    <svg class="style-187" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"></path>
                                    </svg>
                                </button>
                                <div id="dropdown-menu-${category.id}" class="dropdown-menu" style="display:none; position:absolute;">
                                    <button id="edit-btn-${category.id}" class="edit-btn">Edit</button>
                                    <button id="delete-btn-${category.id}" class="delete-btn">Delete</button>
                                </div>
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
                        const categoryId = category.id;
                        const confirmDelete = confirm("Are you sure you want to delete this category?");
                        if (confirmDelete) {
                            // Delete category from Firestore
                            firebase.firestore().collection('categories').doc(categoryId).delete().then(() => {
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
                        const activeCell = row.querySelector('.style-170 div');
                        activeCell.innerHTML = `
                            <select style="width:100%" id="active-select">
                                <option value="true" ${category.active ? 'selected' : ''}>True</option>
                                <option value="false" ${!category.active ? 'selected' : ''}>False</option>
                            </select>`;

                        const orderCell = row.querySelector('.style-172 div');
                        orderCell.innerHTML = `
                            <select style="width:100%" id="order-select">
                                <option value="true" ${category.order ? 'selected' : ''}>True</option>
                                <option value="false" ${!category.order ? 'selected' : ''}>False</option>
                            </select>`;

                        const closeFridayCell = row.querySelector('.style-174 div');
                        closeFridayCell.innerHTML = `
                            <select style="width:100%" id="closefriday-select">
                                <option value="true" ${category.closefriday ? 'selected' : ''}>True</option>
                                <option value="false" ${!category.closefriday ? 'selected' : ''}>False</option>
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
                            const updatedCategory = {
                                name_en: row.querySelector('.style-168 div').innerText,
                                active: row.querySelector('#active-select').value === 'true',
                                order: row.querySelector('#order-select').value === 'true',
                                closefriday: row.querySelector('#closefriday-select').value === 'true',
                                OpenTime: {
                                    From: row.querySelector('.style-176 div').innerText,
                                    To: row.querySelector('.style-176 div').innerText
                                }
                            };

                            // Update Firestore document
                            firebase.firestore().collection('categories').doc(category.id).update(updatedCategory).then(() => {
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
        fetchCategories(currentPage); // Fetch new data for next page
    }
});

document.querySelector('.style-428').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchCategories(currentPage); // Fetch data for previous page
    }
});

document.querySelector('.style-427').addEventListener('click', () => {
    currentPage = 1;
    fetchCategories(currentPage); // Fetch first page data
});

document.querySelector('.style-430').addEventListener('click', () => {
    currentPage = totalPages;
    fetchCategories(currentPage); // Fetch last page data
});

document.getElementById('rows-per-page').addEventListener('change', (event) => {
    rowsPerPage = parseInt(event.target.value, 10);  // Get the new rows per page value
    console.log(rowsPerPage);
    currentPage = 1;  // Reset to the first page after changing rows per page
    fetchCategories(currentPage);  // Fetch new data with updated rows per page
});

// Initialize the pagination state and load first page data
fetchCategories();


// Get the search input element
const searchInput = document.getElementById('searchInput');

// Listen for user input
// searchInput.addEventListener('input', function () {
//     const searchValue = searchInput.value.toLowerCase();  // Get the input value and convert it to lowercase
//     console.log(searchValue);
//     // Fetch all the categories again (you can use the existing fetch or you can filter client-side data)
//     fetch(`/search_in_categories?search=${searchValue}`)
//         .then(response => response.json())
//         .then(data => {
//             // Update the table with the filtered data
//             const tableBody = document.querySelector('.style-164');
//             tableBody.innerHTML = '';  // Clear the previous table rows

//             // Loop through the filtered categories and display them
//             data.categories.forEach(category => {
//                 if (category.name_en.toLowerCase().includes(searchValue)) {  // Filter by name
//                     tableBody.innerHTML += `
//                 <div role="row" class="style-165" data-category-id="${category.id}">
                
//                 <div role="gridcell" class="style-168"><div>${category.name_en}</div></div>
//                 <div role="gridcell" class="style-170"><div>${category.active}</div></div>
//                 <div role="gridcell" class="style-172"><div>${category.order}</div></div>
//                 <div role="gridcell" class="style-174"><div>${category.closefriday}</div></div>
//                 <div role="gridcell" id="From" class="style-176"><div>${category.OpenTime.From}</div></div>
//                 <div role="gridcell" id="To" class="style-176"><div>${category.OpenTime.To}</div></div>
//                 <div role="gridcell" data-tag="allowRowEvents" class="style-185">
//                     <div class="button_div">
//                         <button id="more-btn-${category.id}" class="style-186 more-btn" tabindex="0" type="button" aria-label="more" aria-haspopup="true">
//                             <svg  class="style-187" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
//                                 <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2" class=""></path>
//                             </svg>
//                         </button>
//                         <div id="dropdown-menu-${category.id}" class="dropdown-menu" style="display:none; position:absolute;">
//                             <button id="edit-btn-${category.id}" class="edit-btn">Edit</button>
//                             <button id="delete-btn-${category.id}" class="delete-btn">Delete</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             `;
            
            
//             const moreBtn = tableBody.getElementById(`more-btn-${category.id}`);
//                 const dropdown = tableBody.getElementById(`dropdown-menu-${category.id}`);
            
//                 moreBtn.addEventListener('click', function(event) {
//                     dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            
//                     // Close the dropdown when clicking outside
//                     document.addEventListener('click', function closeDropdown(e) {
//                         if (!dropdown.contains(e.target) && e.target !== moreBtn) {
//                             dropdown.style.display = 'none';
//                             document.removeEventListener('click', closeDropdown);
//                         }
//                     });
//                 });
            
//                 // Delete button
//                 const deleteBtn = document.getElementById(`delete-btn-${category.id}`);
//                 deleteBtn.addEventListener('click', function() {
//                     const categoryId = category.id;
//                     const confirmDelete = confirm("Are you sure you want to delete this category?");
//         if (confirmDelete) {
//                     // Delete the record from Firestore
//                     firebase.firestore().collection('categories').doc(categoryId).delete().then(() => {
//                         alert('Record deleted successfully');
//                         location.reload();  // Reload to update the UI
//                     }).catch(error => {
//                         console.error("Error deleting record: ", error);
//                     });
//             }});
            
//                 // Edit button
//                 const editBtn = document.getElementById(`edit-btn-${category.id}`);
//                 editBtn.addEventListener('click', function() {
                    
//                     const row = document.querySelector(`[data-category-id="${category.id}"]`);
//                     const button_div = row.querySelector('.button_div');
//                     button_div.style.display = "none";
//                     const activeCell = row.querySelector('.style-170 div');
//                     activeCell.innerHTML = `
//                         <select style="width:100%" id="active-select">
//                             <option value="true" ${category.active ? 'selected' : ''}>True</option>
//                             <option value="false" ${!category.active ? 'selected' : ''}>False</option>
//                         </select>`;


//                     const orderCell = row.querySelector('.style-172 div');
//                     orderCell.innerHTML = `
//                     <select style="width:100%"  id="order-select">
//                     <option value="true" ${category.order ? 'selected' : ''}>True</option>
//                     <option value="false" ${!category.order ? 'selected' : ''}>False</option>
//                     </select>`;
            
//                     // Make the content editable
//                     row.querySelectorAll('[role="gridcell"] div').forEach(cell => {
//                         cell.setAttribute('contenteditable', 'true');
//                         cell.style.border = '1px solid #ccc';
//                         cell.style.width = '100%';  // Optional: visual indicator for editable cells
//                     });

//                     const closeFridayCell = row.querySelector('.style-174 div');
//                     closeFridayCell.innerHTML = `
//                         <select  style="width:100%" id="closefriday-select">
//                             <option value="true" ${category.closefriday ? 'selected' : ''}>True</option>
//                             <option value="false" ${!category.closefriday ? 'selected' : ''}>False</option>
//                         </select>`;
            
//                     // Add a save button to persist the changes
//                     row.querySelectorAll('[role="gridcell"] div').forEach(cell => {
//                         cell.setAttribute('contenteditable', 'true');
//                         cell.style.border = '1px solid #ccc'; 
//                         cell.style.width="100%";
//                     });

//                     const saveBtn = document.createElement('button');
//                     saveBtn.innerText = 'Save';
//                     saveBtn.classList.add('style-186');
//                     saveBtn.classList.add('save-btn');
//                     row.appendChild(saveBtn);
//                     const div= row.querySelector('.style-185');
//                     div.appendChild(saveBtn);
//                     saveBtn.addEventListener('click', function() {
//                         const updatedCategory = {
//                             name_en: row.querySelector('.style-168 div').innerText,
//                             active: row.querySelector('#active-select').value === 'true',
//                             order: row.querySelector('#order-select').value=== 'true',
//                             closefriday: row.querySelector('#closefriday-select').value === 'true',
//                             OpenTime: {
//                                 From: row.querySelector('#From').innerText,
//                                 To:  row.querySelector('#To').innerText
//                             }
//                         };

//                         firebase.firestore().collection('categories').doc(category.id).update(updatedCategory).then(() => {
//                             alert('Record updated successfully');
//                             location.reload();
//                         }).catch(error => {
//                             console.error("Error updating record: ", error);
//                         });
//                     });
//                 });
        
        
//             }});


//         });
// });



searchInput.addEventListener('input', function () {
    const searchValue = searchInput.value.toLowerCase();
    console.log(searchValue);
    
    fetch(`/search_in_categories?search=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('.style-164');
            tableBody.innerHTML = ''; // Clear the existing table body

            data.categories.forEach(category => {
                // Check if the category name matches the search value
                if (category.name_en.toLowerCase().includes(searchValue)) {
                    const row = document.createElement('div');
                    row.classList.add('style-165');
                    row.setAttribute('role', 'row');
                    row.setAttribute('data-category-id', category.id);

                    row.innerHTML = `
                        <div role="gridcell" class="style-168"><div>${category.name_en}</div></div>
                        <div role="gridcell" class="style-170"><div>${category.active}</div></div>
                        <div role="gridcell" class="style-172"><div>${category.order}</div></div>
                        <div role="gridcell" class="style-174"><div>${category.closefriday}</div></div>
                        <div role="gridcell" class="style-176"><div>${category.OpenTime.From}</div></div>
                        <div role="gridcell" class="style-176"><div>${category.OpenTime.To}</div></div>
                        <div role="gridcell" data-tag="allowRowEvents" class="style-185">
                            <div class="button_div">
                                <button id="more-btn-${category.id}" class="style-186 more-btn" tabindex="0" type="button" aria-label="more" aria-haspopup="true">
                                    <svg class="style-187" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"></path>
                                    </svg>
                                </button>
                                <div id="dropdown-menu-${category.id}" class="dropdown-menu" style="display:none; position:absolute;">
                                    <button id="edit-btn-${category.id}" class="edit-btn">Edit</button>
                                    <button id="delete-btn-${category.id}" class="delete-btn">Delete</button>
                                </div>
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
                        const categoryId = category.id;
                        const confirmDelete = confirm("Are you sure you want to delete this category?");
                        if (confirmDelete) {
                            // Delete category from Firestore
                            firebase.firestore().collection('categories').doc(categoryId).delete().then(() => {
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
                        const activeCell = row.querySelector('.style-170 div');
                        activeCell.innerHTML = `
                            <select style="width:100%" id="active-select">
                                <option value="true" ${category.active ? 'selected' : ''}>True</option>
                                <option value="false" ${!category.active ? 'selected' : ''}>False</option>
                            </select>`;

                        const orderCell = row.querySelector('.style-172 div');
                        orderCell.innerHTML = `
                            <select style="width:100%" id="order-select">
                                <option value="true" ${category.order ? 'selected' : ''}>True</option>
                                <option value="false" ${!category.order ? 'selected' : ''}>False</option>
                            </select>`;

                        const closeFridayCell = row.querySelector('.style-174 div');
                        closeFridayCell.innerHTML = `
                            <select style="width:100%" id="closefriday-select">
                                <option value="true" ${category.closefriday ? 'selected' : ''}>True</option>
                                <option value="false" ${!category.closefriday ? 'selected' : ''}>False</option>
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
                            const updatedCategory = {
                                name_en: row.querySelector('.style-168 div').innerText,
                                active: row.querySelector('#active-select').value === 'true',
                                order: row.querySelector('#order-select').value === 'true',
                                closefriday: row.querySelector('#closefriday-select').value === 'true',
                                OpenTime: {
                                    From: row.querySelector('.style-176 div').innerText,
                                    To: row.querySelector('.style-176 div').innerText
                                }
                            };

                            // Update Firestore document
                            firebase.firestore().collection('categories').doc(category.id).update(updatedCategory).then(() => {
                                alert('Record updated successfully');
                                location.reload(); // Reload the page to see updates
                            }).catch(error => {
                                console.error("Error updating record: ", error);
                            });
                        });
                    });
                }
            });
        });
});
