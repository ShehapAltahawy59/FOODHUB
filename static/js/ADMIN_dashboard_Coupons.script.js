let currentPage = 1;
let rowsPerPage = 10;  // Define rows per page
let totalPages = 1; // Start with 1 to avoid issues before data is loaded
let totalItems = 0; 
function fetchCoupons(page = currentPage) {
    // Make an AJAX request to the backend to get the categories for the current page
    fetch(`/get_Coupons?rows_per_page=${rowsPerPage}&current_page=${page}`)
        .then(response => response.json())
        .then(data => {
            totalItems = data.total_Coupons; 
            // Update the table with the fetched data
            const tableBody = document.querySelector('.style-179');
            tableBody.innerHTML = '';  // Clear the previous table rows

            // Populate the table with new categories
            data.Coupons.forEach(Coupon => {
                tableBody.innerHTML += `
                
                <div role="row" class="style-180">
                                        <div role="gridcell" data-tag="allowRowEvents" class="style-181">
                                            <div data-tag="allowRowEvents" class="style-182">${Coupon.code}</div>
                                        </div>
                                        <div role="gridcell" data-tag="allowRowEvents" class="style-183">
                                            <div data-tag="allowRowEvents" class="style-184">${Coupon.discount}</div>
                                        </div>
                                        <div role="gridcell" data-tag="allowRowEvents" class="style-183">
                                            <div data-tag="allowRowEvents" class="style-184">${Coupon.is_valid}</div>
                                        </div>
                                        <div role="gridcell" data-tag="allowRowEvents" class="style-183">
                                            <div data-tag="allowRowEvents" class="style-184">${Coupon.count}</div>
                                        </div>
                                        <div role="gridcell" data-tag="allowRowEvents" class="style-183">
                                            <div data-tag="allowRowEvents" class="style-184">${Coupon.end_date}</div>
                                        </div>
                                
                                        <div role="gridcell" data-tag="allowRowEvents" class="style-192">
                                            <div class=""><button class="style-193" tabindex="0" type="button" aria-label="more" aria-haspopup="true"><svg class="style-194" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
                                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2" class=""></path>
                                                    </svg><span class="style-195"></span></button>
                                                <div class="style-196"></div>
                                            </div>
                                        </div>
                                    </div>
                `
                    ;
            });

            // Update total pages and pagination display
            totalPages = data.total_pages;
            document.querySelector('.style-360').innerText = `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, data.total_categories)} of ${data.total_categories}`;

            // Update button states after fetching
            updatePagination();
        });
}

function updatePagination() {
    const pageInfo = document.querySelector('.style-360');
    const firstItem = (currentPage - 1) * rowsPerPage + 1;
    const lastItem = Math.min(currentPage * rowsPerPage, totalItems);

    pageInfo.textContent = `${firstItem}-${lastItem} of ${totalItems}`;
    
    // Update button states
    console.log(currentPage);
    if (currentPage === 1){
        document.querySelector('.style-362').disabled = true;
        document.querySelector('.style-363').style.cursor="default"
        document.querySelector('.style-362').disabled = true;
        document.querySelector('.style-363').style.cursor="default"

    }
    else{
        document.querySelector('.style-362').disabled = false;
        document.querySelector('.style-363').style.cursor="pointer"
        document.querySelector('.style-362').disabled = false;
        document.querySelector('.style-363').style.cursor="pointer"
    }
    if (currentPage != totalPages){
        document.querySelector('.style-364').disabled = false;
        document.querySelector('.style-365').style.cursor="pointer"
        document.querySelector('.style-364').disabled = false;
        document.querySelector('.style-365').style.cursor="pointer"

    }
    else{
        document.querySelector('.style-364').disabled = true;
        document.querySelector('.style-365').style.cursor="default"
        document.querySelector('.style-364').disabled = true;
        document.querySelector('.style-365').style.cursor="default"
    }
       // Previous button

}

// Event listeners for buttons
document.querySelector('.style-362').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchCoupons(currentPage); // Fetch new data for next page
    }
});

document.querySelector('.style-363').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchCoupons(currentPage); // Fetch data for previous page
    }
});

document.querySelector('.style-364').addEventListener('click', () => {
    currentPage = 1;
    fetchCoupons(currentPage); // Fetch first page data
});

document.querySelector('.style-365').addEventListener('click', () => {
    currentPage = totalPages;
    fetchCoupons(currentPage); // Fetch last page data
});

document.getElementById('rows-per-page').addEventListener('change', (event) => {
    rowsPerPage = parseInt(event.target.value, 10);  // Get the new rows per page value
    console.log(rowsPerPage);
    currentPage = 1;  // Reset to the first page after changing rows per page
    fetchCoupons(currentPage);  // Fetch new data with updated rows per page
});

// Initialize the pagination state and load first page data
fetchCoupons();


// Get the search input element
const searchInput = document.getElementById('searchInput');

// Listen for user input
searchInput.addEventListener('input', function () {
    const searchValue = searchInput.value.toLowerCase();  // Get the input value and convert it to lowercase
    console.log(searchValue);
    // Fetch all the categories again (you can use the existing fetch or you can filter client-side data)
    fetch(`/search_in_Coupons?search=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            // Update the table with the filtered data
            const tableBody = document.querySelector('.style-179');
            tableBody.innerHTML = '';  // Clear the previous table rows

            // Loop through the filtered categories and display them
            data.Coupons.forEach(Coupon => {
                if (Coupons.code.toLowerCase().includes(searchValue)) {  // Filter by name
                    tableBody.innerHTML += `
                    <div role="row" class="style-180">
                    <div role="gridcell" data-tag="allowRowEvents" class="style-181">
                        <div data-tag="allowRowEvents" class="style-182">${Coupon.code}</div>
                    </div>
                    <div role="gridcell" data-tag="allowRowEvents" class="style-183">
                        <div data-tag="allowRowEvents" class="style-184">${Coupon.discount}</div>
                    </div>
                    <div role="gridcell" data-tag="allowRowEvents" class="style-183">
                        <div data-tag="allowRowEvents" class="style-184">${Coupon.is_valid}</div>
                    </div>
                    <div role="gridcell" data-tag="allowRowEvents" class="style-183">
                        <div data-tag="allowRowEvents" class="style-184">${Coupon.count}</div>
                    </div>
                    <div role="gridcell" data-tag="allowRowEvents" class="style-183">
                        <div data-tag="allowRowEvents" class="style-184">${Coupon.end_date}</div>
                    </div>
            
                    <div role="gridcell" data-tag="allowRowEvents" class="style-192">
                        <div class=""><button class="style-193" tabindex="0" type="button" aria-label="more" aria-haspopup="true"><svg class="style-194" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2" class=""></path>
                                </svg><span class="style-195"></span></button>
                            <div class="style-196"></div>
                        </div>
                    </div>
                </div>
                    `;
                }
            });
        });
});
