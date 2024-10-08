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
  productList.innerHTML = "";

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product-card");

    productDiv.innerHTML = `
      <img src="${product.picture_link}" alt="${
      product.name
    }" class="product-image">
      <h3>${product.name}</h3>
      <p>Category: ${product.category}</p>
      <p>Price: $${product.price}</p>
      <p>Color: ${product.color}</p>
      <p>Size: ${product.size}</p>
      <p>Gender: ${product.gender}</p>
      <button class="add-to-cart-button" data-product='${JSON.stringify(
        product
      ).replace(/'/g, "&apos;")}'>Add to Cart</button>
    `;

    productList.appendChild(productDiv);
  });

  document.querySelectorAll(".add-to-cart-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const product = JSON.parse(
        event.target.getAttribute("data-product").replace(/&apos;/g, "'")
      );
      addToCart(product);
    });
  });
}

function searchProduct(inventory, query) {
  query = query.toLowerCase();
  return inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
  );
}

function sortProducts(products, criteria, order = "asc") {
  return products.sort((a, b) => {
    if (criteria === "price") {
      return order === "asc" ? a.price - b.price : b.price - a.price;
    } else if (criteria === "name") {
      if (a.name < b.name) return order === "asc" ? -1 : 1;
      if (a.name > b.name) return order === "asc" ? 1 : -1;
      return 0;
    }
  });
}

function initializeSort(inventory) {
  document.getElementById("sort-price-asc").addEventListener("click", () => {
    const sortedProducts = sortProducts([...inventory], "price", "asc");
    displayProducts(sortedProducts);
  });

  document.getElementById("sort-price-desc").addEventListener("click", () => {
    const sortedProducts = sortProducts([...inventory], "price", "desc");
    displayProducts(sortedProducts);
  });

  document.getElementById("sort-item-name").addEventListener("click", () => {
    const sortedProducts = sortProducts([...inventory], "name", "asc");
    displayProducts(sortedProducts);
  });
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").innerText = cart.length;
}

document.addEventListener("DOMContentLoaded", updateCartCount);

loadCSV("javascript/items.csv", (data) => {
  const inventory = parseCSV(data);
  displayProducts(inventory);

  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");

  const executeSearch = () => {
    const query = searchInput.value;
    const filteredProducts = searchProduct(inventory, query);
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

  document.getElementById("sort-price-asc").addEventListener("click", () => {
    const sortedProducts = sortProducts([...inventory], "price", "asc");
    displayProducts(sortedProducts);
  });

  document.getElementById("sort-price-desc").addEventListener("click", () => {
    const sortedProducts = sortProducts([...inventory], "price", "desc");
    displayProducts(sortedProducts);
  });

  document.getElementById("sort-item-name").addEventListener("click", () => {
    const sortedProducts = sortProducts([...inventory], "name", "asc");
    displayProducts(sortedProducts);
  });
});
