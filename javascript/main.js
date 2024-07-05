function loadCSV(url, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => callback(data))
    .catch((error) => console.error("Error loading CSV file:", error));
}

function parseCSV(data) {
  const lines = data.split("\n");
  const headers = lines[0].split(",").map((header) => header.trim());
  const items = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].split(",");
    if (line.length === headers.length) {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = line[index].trim();
      });
      items.push(item);
    }
  }
  return items;
}

function displayProducts(products) {
  const productList = document.getElementById("product-info-list");
  productList.innerHTML = ""; // Clear any existing content

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product-card");

    productDiv.innerHTML = `
      <img src="${product.picture_link}" alt="${product.name}" class="product-image">
      <h3>${product.name}</h3>
      <p>Category: ${product.category}</p>
      <p>Price: $${product.price}</p>
      <p>Color: ${product.color}</p>
      <p>Size: ${product.size}</p>
      <p>Gender: ${product.gender}</p>
    `;

    productList.appendChild(productDiv);
  });
}

function sortProducts(products, key, order = 'asc') {
  return products.sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
}

function initializeSort(inventory) {
  document.getElementById("sort-price-asc").addEventListener("click", () => {
    const sortedProducts = sortProducts([...inventory], 'price', 'asc');
    displayProducts(sortedProducts);
  });

  document.getElementById("sort-price-desc").addEventListener("click", () => {
    const sortedProducts = sortProducts([...inventory], 'price', 'desc');
    displayProducts(sortedProducts);
  });

  document.getElementById("sort-item-name").addEventListener("click", () => {
    const sortedProducts = sortProducts([...inventory], 'name', 'asc');
    displayProducts(sortedProducts);
  });
}

loadCSV("javascript/items.csv", (data) => {
  const inventory = parseCSV(data);
  displayProducts(inventory);
  initializeSort(inventory);

  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");

  const executeSearch = () => {
    const query = searchInput.value;
    const filteredProducts = filterProducts(inventory, query);
    displayProducts(filteredProducts);
  };

  searchButton.addEventListener("click", executeSearch);

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      executeSearch();
    }
  });

  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    displayProducts(inventory);
  });
});