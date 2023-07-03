fetch("/")
  .then(response => response.json())
  .then(data => {
    const messageElement = document.createElement("p");
    messageElement.textContent = data.hello;
    document.body.appendChild(messageElement);
  });
