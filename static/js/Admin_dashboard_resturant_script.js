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
                tableBody.innerHTML += `
                    <div role="row" class="style-165">
                        <div class="style-166"><input type="checkbox" name="select-row-undefined" /></div>
                        <div role="gridcell" class="style-168"><div>${category.name_en}</div></div>
                        <div role="gridcell" class="style-170"><div>${category.active}</div></div>
                        <div role="gridcell" class="style-172"><div>${category.order}</div></div>
                        <div role="gridcell" class="style-174"><div>${category.closefriday}</div></div>
                        <div role="gridcell" class="style-176"><div>${category.OpenTime.From}</div></div>
                        <div role="gridcell" class="style-176"><div>${category.OpenTime.To}</div></div>
                        <div role="gridcell" data-tag="allowRowEvents" class="style-185">
                                            <div class=""><button class="style-186" tabindex="0" type="button" aria-label="more" aria-haspopup="true"><svg class="style-187" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
                                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2" class=""></path>
                                                    </svg><span class="style-188"></span></button>
                                                <div class="style-189"></div>
                                            </div>
                                        </div>
                    </div>
                `;
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
searchInput.addEventListener('input', function () {
    const searchValue = searchInput.value.toLowerCase();  // Get the input value and convert it to lowercase
    console.log(searchValue);
    // Fetch all the categories again (you can use the existing fetch or you can filter client-side data)
    fetch(`/search_in_categories?search=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            // Update the table with the filtered data
            const tableBody = document.querySelector('.style-164');
            tableBody.innerHTML = '';  // Clear the previous table rows

            // Loop through the filtered categories and display them
            data.categories.forEach(category => {
                if (category.name_en.toLowerCase().includes(searchValue)) {  // Filter by name
                    tableBody.innerHTML += `
                        <div role="row" class="style-165">
                            <div class="style-166"><input type="checkbox" name="select-row-undefined" /></div>
                            <div role="gridcell" class="style-168"><div>${category.name_en}</div></div>
                            <div role="gridcell" class="style-170"><div>${category.active}</div></div>
                            <div role="gridcell" class="style-172"><div>${category.order}</div></div>
                            <div role="gridcell" class="style-174"><div>${category.closefriday}</div></div>
                            <div role="gridcell" class="style-176"><div>${category.OpenTime.From}</div></div>
                            <div role="gridcell" class="style-176"><div>${category.OpenTime.To}</div></div>
                            <div role="gridcell" data-tag="allowRowEvents" class="style-185">
                                            <div class=""><button class="style-186" tabindex="0" type="button" aria-label="more" aria-haspopup="true"><svg class="style-187" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
                                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2" class=""></path>
                                                    </svg><span class="style-188"></span></button>
                                                <div class="style-189"></div>
                                            </div>
                                        </div>
                        </div>
                    `;
                }
            });
        });
});
