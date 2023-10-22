
document.addEventListener("DOMContentLoaded", () => {
    const groceryList = document.querySelector("#grocery-list ul");
    const addGroceryForm = document.querySelector("#add-grocery-form");

    // Function to fetch and display groceries
const fetchGroceries = async () => {
    try {
        const response = await fetch("/groceries");
        if (!response.ok) {
            throw new Error("Request failed");
        }
        const groceries = await response.json();

        // Clear the existing list
        groceryList.innerHTML = "";

        // Render the fetched groceries
        groceries.forEach((grocery) => {
            // Create a list item for each grocery
            const listItem = document.createElement("li");

            // Create a div to hold the grocery details
            const detailsDiv = document.createElement("div");
            detailsDiv.classList.add("groceries-box");
            detailsDiv.textContent = `${grocery.name} - quantity: ${grocery.ammount}`;
            listItem.appendChild(detailsDiv);

            // Create an "Edit" button
            const editButton = document.createElement("button");
            editButton.classList.add("edit-button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => {
                // Call a function to handle editing
                editGrocery(grocery.id, grocery.name, grocery.ammount,groceryList,fetchGroceries);
            });
            listItem.appendChild(editButton);

            // Create a "Delete" button
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                // Call a function to handle deletion
                deleteGrocery(grocery.id);
                fetchGroceries();
            });
            listItem.appendChild(deleteButton);

            // Append the entire list item to the groceryList
            groceryList.appendChild(listItem);
        });
    } catch (error) {
        console.error(error);
    }
};


    // Fetch and display groceries when the page loads
    fetchGroceries();

    // Handle form submission to add a new grocery
    addGroceryForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const id = generateRandomId(5);
        const name = document.querySelector("#name").value;
        const ammount = document.querySelector("#ammount").value;

        try {
            const response = await fetch("/groceries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id,name, ammount }),
            });

            if (!response.ok) {
                throw new Error("Request failed");
            }

            // Clear the form fields
            
            document.querySelector("#name").value = "";
            document.querySelector("#ammount").value = "";

            // Fetch and display the updated grocery list
            fetchGroceries();
        } catch (error) {
            console.error(error);
        }
    });
});

// Function to delete a grocery item by ID
const deleteGrocery = async (id) => {
    try {
        const response = await fetch(`/groceries/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            // Refresh the grocery list after deletion
            fetchGroceries();
        } else {
            throw new Error("Delete request failed.");
        }
    } catch (error) {
        console.error(error);
    }
};

function generateRandomId(length) {
    const characters = "0123456789";
    let randomId = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }

    return randomId;}

    // Function to edit a grocery item by ID
    const editGrocery = async (id, name, ammount,groceryList,fetchGroceries) => {
        try {
            // Find the existing list item with the specific data-id attribute
            let listItem = document.querySelector(`[data-id="${id}"]`);
    
            if (!listItem) {
                // If the element doesn't exist (e.g., for newly added items), create it
                listItem = document.createElement("li");
                listItem.setAttribute("data-id", id);
                groceryList.appendChild(listItem); // Append to the list
            }
    
            // Create an editable form and pre-fill it with existing data
            const editForm = document.createElement("form");
            editForm.classList.add("edit-form");
            editForm.innerHTML = `
                <label for="editName">Name:</label>
                <input type="text" id="editName" value="${name}" required>
                <label for="editAmmount">Quantity:</label>
                <input type="number" id="editAmmount" value="${ammount}" required>
                <button type="button" class="update-button">Update</button>
            `;
    
            // Add an event listener to the "Update" button for submitting edits
            editForm.querySelector(".update-button").addEventListener("click", async () => {
                const updatedName = editForm.querySelector("#editName").value;
                const updatedAmmount = editForm.querySelector("#editAmmount").value;
    
                // Send a PUT request to update the grocery item on the server
                try {
                    const updateResponse = await fetch(`/groceries/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name: updatedName, ammount: updatedAmmount }),
                    });
    
                    if (updateResponse.ok) {
                        // Refresh the grocery list after updating
                        fetchGroceries();
                    } else {
                        throw new Error("Update request failed.");
                    }
                } catch (error) {
                    console.error(error);
                }
            });
    
            // Clear the existing content of the list item and append the editForm
            listItem.innerHTML = "";
            listItem.appendChild(editForm);
        } catch (error) {
            console.error(error);
        }
    };
    
