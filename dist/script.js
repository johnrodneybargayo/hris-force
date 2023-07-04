fetch("/")
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to fetch data from the server");
    }
    return response.json();
  })
  .then(data => {
    const messageElement = document.createElement("p");
    if (data.connected) {
      messageElement.textContent = "The backend server is connected successfully to MongoDB";
    } else {
      messageElement.textContent = "The backend server is not connected to MongoDB";
    }
    document.body.appendChild(messageElement);
  })
  .catch(error => {
    console.error("Error fetching data:", error);
    const errorElement = document.createElement("p");
    errorElement.textContent = "An error occurred while fetching data";
    document.body.appendChild(errorElement);
  });
