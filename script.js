(async () => {
    let fetchedData;

    // fetching json using asyn/await
    const fetchData = async () => {
        try {
            const response = await fetch('/data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error--Status: ${response.status}`);
            }
            fetchedData = await response.json(); // assigning parsed JSON to global variable
            return fetchedData;
        } catch (error) {
            console.error('Error fetching JSON:', error);
        }
    }
    await fetchData();
    const productsArray = fetchedData.products; // accessing products array inside the json file

    // this function will allow me to have more control on how many product elements I want to create
    // needed this in the cases where I only display certain products (e.g., ice cream of the month, best sellers)
    function createProductElement(product) {
        // WARNING: Using template literals to create elements pose security issues
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
            </div>`

        return productContainer;
    }

    // productContainerParent is the "purpose" of the overarching parent element displaying the product (i.e. monthly feature, best sellers, all products)
    // it should be the id of the parent element
    // function used to populate all the products inside the json file (for the products page)
    function populateProducts(products, productContainerParent) {
        for (const product of products) {
            const productContainer = createProductElement(product);
            productContainerParent.innerHTML += productContainer;
        }
    }

    // https://www.geeksforgeeks.org/javascript/how-to-get-a-value-from-a-json-array-in-javascript/ => different methods to get values from a json array
    function monthlyFeatureDisplay(productNames) {
        const monthlyFeatureContainer = document.getElementById('monthly-feature__container');
        const monthlyFeatureProducts = productsArray.filter((product) => productNames.includes(product.name))
        populateProducts(monthlyFeatureProducts, monthlyFeatureContainer);
    }


    // productNamesArray is an array of products that will pass as the best sellers
    function bestSellersDisplay(productNames) {
        const bestSellersContainer = document.getElementById('best-sellers');
        const bestSellersProducts = productsArray.filter((product) => productNames.includes(product.name))
        populateProducts(bestSellersProducts, bestSellersContainer);
    }

    // to refactor/further optimize code, will create separate js files for each html file requiring it
    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
        monthlyFeatureDisplay(['Pineapple Twist-Up']);
        bestSellersDisplay(['Flip-Top Float', 'Jukebox Jive', 'Maple Jitterbug', 'Malt Shop Magic']);
    }

    if (window.location.pathname === '/pages/products.html') {
        const productsPgContainer = document.getElementById('products-pg__container');
        populateProducts(productsArray, productsPgContainer);
    }

    // ui js
    const openMenuBtn = document.getElementById('mobile-nav__open');
    const closeMenuBtn = document.getElementById('mobile-nav__close');
    const navModal = document.getElementById('mobile-nav');

    // to refactor/further optimize code, will make .hidden class to alter display
    openMenuBtn.addEventListener('click', () => {
        navModal.style.display = getComputedStyle(navModal).display === 'none' ? 'flex' : 'none';
        openMenuBtn.style.display = 'none';
        closeMenuBtn.style.display = 'block';
        document.body.classList.add('no-scroll');
    })

    closeMenuBtn.addEventListener('click', () => {
        navModal.style.display = getComputedStyle(navModal).display === 'flex' ? 'none' : 'flex';
        openMenuBtn.style.display = 'block';
        closeMenuBtn.style.display = 'none';
        document.body.classList.remove('no-scroll');
    })

    // form validation
    if (window.location.pathname === '/pages/contact.html') {
        const contactForm = document.getElementById('form-container');
        const fnameInput = document.getElementById('fname');
        const lnameInput = document.getElementById('lname');
        const emailInput = document.getElementById('email');
        const phoneNumInput = document.getElementById('phone-number');
        const messageInput = document.getElementById('message');
        const messageSent = document.getElementById('message-sent');
        const messageSentReturnBtn = document.getElementById('message-return__button')

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneNumRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

        let isValid = true;

        const invalid = (input) => {
            function message() {
                if (input.value === '') {
                    const inputDataName = input.getAttribute('data-name');
                    return `${inputDataName} is empty. Please enter a valid value.`
                } else {
                    if (input === emailInput) {
                        return "Email address is in an incorrect format. Please enter a valid value containing @.";
                    } else if (input === phoneNumInput) {
                        return `Phone number is in an incorrect format. Please enter any valid phone number format (ex. 123-456-7890, (123) 456-7890).`
                    }
                }
            }

            input.classList.add('invalid-input');
            // const invalidMsg = `<p class="invalid-input__msg" id="invalid-${input.name}__msg">${message()}</p>`; // not possible to use .after() for this case as the method typically inserts strings as text, even if it's a template literal creating a node
            const invalidMsg = document.createElement('p');
            invalidMsg.classList.add('invalid-input__msg');
            invalidMsg.id = `invalid-${input.name}__msg`
            invalidMsg.textContent = message();
            input.after(invalidMsg);
            isValid = false;
        }

        const valid = (input) => {
            const invalidMsg = document.getElementById(`invalid-${input.name}__msg`);
            if (document.contains(invalidMsg)) {
                console.log(`removing: ${invalidMsg}`);
                invalidMsg.remove();
            }
            input.classList.remove('invalid-input');
        }

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const inputs = document.querySelectorAll('input');
            inputs.forEach((input) => {
                const invalidMsg = document.getElementById(`invalid-${input.name}__msg`);
                if (!document.contains(invalidMsg)) {
                    !input.value || !emailRegex.test(emailInput.value) || !phoneNumRegex.test(phoneNumInput.value) ? invalid(input) : valid(input);
                }
            });

            if (isValid) {
                messageSent.style.display = 'flex';
                contactForm.style.display = 'none';
                event.target.reset();
            }
        })

        messageSentReturnBtn.addEventListener('click', () => {
            messageSent.style.display = 'none';
            contactForm.style.display = 'flex';
        })

        fnameInput.addEventListener('input', (event) => {
            valid(event.target); // event.target gets 'fnameInput'
        })

        lnameInput.addEventListener('input', (event) => {
            valid(event.target);
        })

        emailInput.addEventListener('input', (event) => {
            valid(event.target);
        })

        phoneNumInput.addEventListener('input', (event) => {
            valid(event.target);
        })

        messageInput.addEventListener('input', (event) => {
            valid(event.target);
        })
    }
})();