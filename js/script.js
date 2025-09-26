// fetching json using asyn/await
const fetchData = async () => {
  try {
    const response = await fetch("/data/products.json");
    if (!response.ok) {
      throw new Error(`HTTP error--Status: ${response.status}`);
    }
    const data = await response.json(); // assigning parsed JSON to global variable
    return data;
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
};

// this function will allow me to have more control on how many product elements I want to create
// needed this in the cases where I only display certain products (e.g., ice cream of the month, best sellers)
function createProductElement(product) {
  // WARNING: Using template literals to create elements pose security issues (typically when working w/ API where you don't know what the types of the data being pulled in are)
  // To combat this, you can use TypeScript to specify the type you're expecting
  const productContainer = `
            <div class="product-container">
                <div class="product-img__container">
                    <img class="product-img" src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info__container">
                    <p class="product-name">${product.name}</p>
                    <p class="product-price">$${product.price}</p>
                    <p class="product-description">${product.description}</p>
                    <button class="add-to-cart__button">Add to Cart</button>
                </div>
            </div>`;

  return productContainer;
}

// productContainerParent is the "purpose" of the overarching parent element displaying the product (i.e. monthly feature, best sellers, all products)
// it should be the id of the parent element
// function used to populate all the products inside the json file (for the products page)
async function populateProducts(productContainerParent) {
  const data = await fetchData();
  const products = data.products;
  for (const product of products) {
    const productContainer = createProductElement(product);
    productContainerParent.innerHTML += productContainer;
  }
}

// https://www.geeksforgeeks.org/javascript/how-to-get-a-value-from-a-json-array-in-javascript/ => different methods to get values from a json array
async function monthlyFeatureDisplay(productNames) {
  const data = await fetchData();
  const products = data.products;
  const monthlyFeatureContainer = document.getElementById(
    "monthly-feature__container"
  );
  const monthlyFeatureProducts = products.filter((product) =>
    productNames.includes(product.name)
  );
  populateProducts(monthlyFeatureProducts, monthlyFeatureContainer);
}

// productNamesArray is an array of products that will pass as the best sellers
async function bestSellersDisplay(productNames) {
  const data = await fetchData();
  const products = data.products;
  const bestSellersContainer = document.getElementById("best-sellers");
  const bestSellersProducts = products.filter((product) =>
    productNames.includes(product.name)
  );
  populateProducts(bestSellersProducts, bestSellersContainer);
}

// ui js
const openMenuBtn = document.getElementById("mobile-nav__open");
const closeMenuBtn = document.getElementById("mobile-nav__close");
const navModal = document.getElementById("mobile-nav");

// to refactor/further optimize code, will make .hidden class to alter display
openMenuBtn.addEventListener("click", () => {
  navModal.style.display =
    getComputedStyle(navModal).display === "none" ? "flex" : "none";
  openMenuBtn.style.display = "none";
  closeMenuBtn.style.display = "block";
  document.body.classList.add("no-scroll");
});

closeMenuBtn.addEventListener("click", () => {
  navModal.style.display =
    getComputedStyle(navModal).display === "flex" ? "none" : "flex";
  openMenuBtn.style.display = "block";
  closeMenuBtn.style.display = "none";
  document.body.classList.remove("no-scroll");
});
