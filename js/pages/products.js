async function productsDisplay() {
  const data = await fetchData();
  if (!data) return;
  const products = data.products;

  const productsPgContainer = document.getElementById("products-pg__container");
  populateProducts(products, productsPgContainer);
}

productsDisplay();
