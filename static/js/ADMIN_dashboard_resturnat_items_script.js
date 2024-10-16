document.addEventListener('DOMContentLoaded', function() {
    const itemCatSelect = document.getElementById('item_cat');
    const itemCatSubSelect = document.getElementById('item_cat_sub');
  
    itemCatSelect.addEventListener('change', function() {
      const categoryId = this.value;
      if (categoryId) {
        fetch(`/get_subcategories/${categoryId}`)
          .then(response => response.json())
          .then(data => {
            itemCatSubSelect.innerHTML = '<option value="">Select Subcategory</option>';
            data.subcategories.forEach(subcat => {
              const option = document.createElement('option');
              option.value = subcat.id;
              option.textContent = subcat.name_ar;
              itemCatSubSelect.appendChild(option);
            });
          })
          .catch(error => console.error('Error fetching subcategories:', error));
      } else {
        itemCatSubSelect.innerHTML = '<option value="">Select Subcategory</option>';
      }
    });
  
    // Populate subcategories if already selected
    if (itemCatSelect.value) {
      itemCatSelect.dispatchEvent(new Event('change'));
    }
  });
  
  

let currentPage = 1;
let rowsPerPage = 10;  // Define rows per page
let totalPages = 1; // Start with 1 to avoid issues before data is loaded
let totalItems = 0; 
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
                tableBody.innerHTML += `
                <div role="row" class="style-2344">
                <div class="style-2345"><input type="checkbox" name="select-row-undefined" aria-label="select-row-undefined" class="style-2346" /></div>
                <div role="gridcell" data-tag="allowRowEvents" class="style-2347">
                    <div data-tag="allowRowEvents" class="style-2348"> ${item.name_en}</div>
                </div>
                <div role="gridcell" data-tag="allowRowEvents" class="style-2347">
                    <div data-tag="allowRowEvents" class="style-2348"> ${item.active}</div>
                </div>
                <div role="gridcell" data-tag="allowRowEvents" class="style-2347">
                    <div data-tag="allowRowEvents" class="style-2348"> ${item.price}</div>
                </div>
                <div role="gridcell" data-tag="allowRowEvents" class="style-2347">
                    <div data-tag="allowRowEvents" class="style-2348"> ${item.discount}</div>
                </div>
                <div role="gridcell" data-tag="allowRowEvents" class="style-2347">
                    <div data-tag="allowRowEvents" class="style-2348"> ${item.item_cat}</div>
                </div>
                
    
                <div role="gridcell" data-tag="allowRowEvents" class="style-2357">
                    <div class=""><button class="style-2358" tabindex="0" type="button" aria-label="more" aria-haspopup="true"><svg class="style-2359" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2" class=""></path>
                            </svg><span class="style-2360"></span></button>
                        <div class="style-2361"></div>
                    </div>
                </div>
            </div>
                `;
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

