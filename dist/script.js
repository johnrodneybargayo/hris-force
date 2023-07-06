if (typeof window !== 'undefined') {
  // Fetch MongoDB connection status
  fetch("/.netlify/functions/mongodb-connection")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data from the server (${response.status} ${response.statusText})`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        const messageElement = document.createElement("p");
        messageElement.textContent = "The backend server is connected successfully to MongoDB";
        document.body.appendChild(messageElement);
      } else {
        const errorElement = document.createElement("p");
        errorElement.textContent = "The backend server is not connected to MongoDB";
        document.body.appendChild(errorElement);
      }
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      const errorElement = document.createElement("p");
      errorElement.textContent = "An error occurred while fetching data";
      document.body.appendChild(errorElement);
    });
}
