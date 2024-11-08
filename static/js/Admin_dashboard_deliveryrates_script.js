document.addEventListener("DOMContentLoaded", function() {
    const dropdown = document.getElementById("rate-type"); // Dropdown beside Commission Rates
    const deliveryRatesContainer = document.querySelector(".style-82"); // Container for commission rates

    // Function to update commission rates based on selected value
    function updateCommissionRates(rateType) {
        // Clear existing rates and fetch new data based on selection
        fetch(`/Admin_Dashboard/get_Delivary_Rates?search=${rateType}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                deliveryRatesContainer.innerHTML = "";

                // Ensure `data.Delivary_Rates` exists and iterate over it
                if (data.Delivary_Rates) {
                    for (const [key, value] of Object.entries(data.Delivary_Rates)) {
                        const rateRow = document.createElement("div");
                        rateRow.className = "style-83";

                        // Key (Location)
                        const locationDiv = document.createElement("div");
                        locationDiv.className = "style-84";
                        locationDiv.textContent = key;

                        // Input (Commission Rate)
                        const rateInputDiv = document.createElement("div");
                        rateInputDiv.className = "style-85";
                        const input = document.createElement("input");
                        input.type = "number";
                        input.min = "0";
                        input.className = "style-87";
                        input.value = value;
                        const _rateInputDiv = document.createElement("div");
                        _rateInputDiv.className = "style-86";
                        _rateInputDiv.setAttribute("step", "1");
                        _rateInputDiv.appendChild(input);
                        rateInputDiv.appendChild(_rateInputDiv);

                        // Save Button
                        const saveButtonDiv = document.createElement("div");
                        saveButtonDiv.className = "style-88";
                        const saveButton = document.createElement("button");
                        saveButton.className = "style-89";
                        saveButton.type = "button";
                        saveButton.textContent = "Save";
                        saveButtonDiv.appendChild(saveButton);

                        // Append all elements to the row
                        rateRow.appendChild(locationDiv);
                        rateRow.appendChild(rateInputDiv);
                        rateRow.appendChild(saveButtonDiv);

                        // Append row to container
                        deliveryRatesContainer.appendChild(rateRow);

                        // Add event listener for save button
                        saveButton.addEventListener("click", function() {
                            const updatedRate = input.value;

                            // Send updated rate to server for specific key
                            fetch(`/Admin_Dashboard/update_Delivary_Rate`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    key: key,
                                    rate: updatedRate,
                                    where:rateType,
                                })
                            })
                            .then(response => {
                                if (response.ok) {
                                    alert("Rate updated successfully!");
                                } else {
                                    throw new Error("Failed to update rate");
                                }
                            })
                            .catch(error => console.error("Error updating rate:", error));
                        });
                    }
                } else {
                    console.error("No delivery rates data available.");
                }
            })
            .catch(error => console.error("Failed to fetch data:", error));
    }

    // Listen for dropdown selection change
    dropdown.addEventListener("change", function() {
        const selectedRateType = dropdown.value;
        updateCommissionRates(selectedRateType);
    });

    // Initial load (default to 'quweisna')
    updateCommissionRates("quweisna");
});
