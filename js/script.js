/* TASKS
HOMEPAGE
[] Add slides for hero images
[] Change product cards for variation
[] Add indicators for 'Best Sellers'
  [] Add next/prev buttons functionality

PRODUCTS
Nice-to-Haves
[] Add more products in the JSON
  [] Implement pagenation

CONTACT
[] Form validation/data sanitation
  [] Validate min and max values for inputs
*/

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
async function populateProducts(products, productContainerParent) {
  for (const product of products) {
    const productContainer = createProductElement(product);
    productContainerParent.innerHTML += productContainer;
  }
}

// https://www.geeksforgeeks.org/javascript/how-to-get-a-value-from-a-json-array-in-javascript/ => different methods to get values from a json array
async function monthlyFeatureDisplay(productNames) {
  const data = await fetchData();
  if (!data) return; // gaurd clause
  const products = data.products;
  const monthlyFeatureContainer = document.getElementById(
    "monthly-feature__container"
  );
  const monthlyFeatureProducts = products.filter((product) =>
    productNames.includes(product.name)
  );
  console.log(monthlyFeatureProducts);
  populateProducts(monthlyFeatureProducts, monthlyFeatureContainer);
}

// productNamesArray is an array of products that will pass as the best sellers
async function bestSellersDisplay(productNames) {
  const data = await fetchData();
  if (!data) return;
  const products = data.products;
  const bestSellersContainer = document.getElementById("best-sellers");
  const bestSellersProducts = products.filter((product) =>
    productNames.includes(product.name)
  );
  populateProducts(bestSellersProducts, bestSellersContainer);
}

// ui js
const navbar = document.querySelector("nav");
const openMenuBtn = document.querySelector(".mobile-nav__openBtn");
const closeMenuBtn = document.querySelector(".mobile-nav__closeBtn");
const navModal = document.querySelector(".mobile-nav");

navbar.addEventListener("click", (e) => {
  const clickedBtn = e.target.closest("button");

  if (clickedBtn === openMenuBtn) {
    navbar.classList.add("nav__modal--opened");
    navModal.classList.add("open");
    document.body.classList.add("no-scroll");
  }

  if (clickedBtn === closeMenuBtn) {
    navbar.classList.remove("nav__modal--opened");
    navModal.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
});
