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

    // fetching json using .then() chain
    // fetch('products.json')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error(`HTTP error--Status: ${response.status}`);
    //         }
    //         return response.json() // parse response as JSON
    //     })
    //     .then(data => {
    //         fetchedData = data;
    //         productsArray = fetchedData.products; // accessing products array inside the json file
    //     })
    //     .catch(error => {
    //         console.error('Error fetching JSON:', error);
    //     })
    // console.log(fetchedData);
    // console.log(productsArray);

    ///// Notes /////

    // QUESTIONS:
    // 1. What is the difference between fetching JSON data through an async function and through fetch().then()

    // Fetch operation is asynchronous, meaning that it'll execute before data is available 
    // The fetchData variable must be acessed after the promised has resolved 
    // (i.e., inside the async function after await or within the .then() block where it's assigned)

    ///// End of Notes /////

    // this function will allow me to have more control on how many product elements I want to create
    // needed this in the cases where I only display certain products (e.g., ice cream of the month, best sellers)
    function createProductElement(product) {
        const productContainer = document.createElement('div');

        const productImgContainer = document.createElement('div');
        const productImg = document.createElement('img');

        const productInfoContainer = document.createElement('div');
        const productName = document.createElement('p');
        const productPrice = document.createElement('p');
        const productDescription = document.createElement('p');
        const addToCartButton = document.createElement('button');

        productContainer.classList.add('product-container');
        productImgContainer.classList.add('product-img__container');
        productImg.classList.add('product-img');

        productInfoContainer.classList.add('product-info__container');
        productName.classList.add('product-name');
        productPrice.classList.add('product-price');
        productDescription.classList.add('product-description');
        addToCartButton.classList.add('add-to-cart__button');

        productImg.src = product.image;
        productImg.alt = product.name;
        productName.textContent = product.name;
        productPrice.textContent = `$${product.price}`;
        productDescription.textContent = product.description;
        addToCartButton.textContent = `Add to Cart`;

        productImgContainer.appendChild(productImg);

        productInfoContainer.appendChild(productName);
        productInfoContainer.appendChild(productPrice);
        productInfoContainer.appendChild(productDescription);
        productInfoContainer.appendChild(addToCartButton);

        productContainer.appendChild(productImgContainer);
        productContainer.appendChild(productInfoContainer);
        return productContainer;
    }

    // productContainerParent is the "purpose" of the overarching parent element displaying the product (i.e. monthly feature, best sellers, all products)
    // it should be the id of the parent element
    // function used to populate all the products inside the json file (for the products page)
    function populateProducts(products, productContainerParent) {
        for (const product of products) {
            // console.log(product);
            const productContainer = createProductElement(product);
            // console.log(productContainer);
            productContainerParent.appendChild(productContainer);
        }
    }

    // https://www.geeksforgeeks.org/javascript/how-to-get-a-value-from-a-json-array-in-javascript/ => different methods to get values from a json array
    function monthlyFeatureDisplay(productNames) {
        const monthlyFeatureContainer = document.getElementById('monthly-feature__container');

        let monthlyFeatureProducts = [];
        for (const productName of productNames) {
            for (const product of productsArray) {
                console.log(productName);
                console.log(product.name);
                if (product.name === productName) {
                    monthlyFeatureProducts.push(product);
                }
            }
        }
        console.log(monthlyFeatureProducts);

        populateProducts(monthlyFeatureProducts, monthlyFeatureContainer);
    }


    // productNamesArray is an array of products that will pass as the best sellers
    function bestSellersDisplay(productNames) {
        const bestSellersContainer = document.getElementById('best-sellers');
        let bestSellersProducts = []; // contains the objects of the passed best sellers products array
        for (const productName of productNames) {
            // finding the product objects of best sellers products
            const productObj = productsArray.find(product => product.name === productName);
            bestSellersProducts.push(productObj);
        }

        populateProducts(bestSellersProducts, bestSellersContainer);
    }


    if (window.location.pathname === '/index.html') {
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
        const messageSubmitInput = document.getElementById('contact-form__submit');
        const messageSent = document.getElementById('message-sent');
        const messageSentReturnBtn = document.getElementById('message-return__button')
        const invalidFnameMsg = document.getElementById('invalid-fname__msg');
        const invalidLnameMsg = document.getElementById('invalid-lname__msg');
        const invalidEmailMsg = document.getElementById('invalid-email__msg');
        const invalidPhoneMsg = document.getElementById('invalid-phonenum__msg');
        const invalidMessageMsg = document.getElementById('invalid-msg__msg');

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneNumRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let isValid = true;
            if (fnameInput.value === '') {
                invalidFnameMsg.style.display = 'block';
                invalidFnameMsg.textContent = "First name is empty. Please enter a valid value."
                fnameInput.classList.add('invalid-input');
                isValid = false;
            } else {
                invalidFnameMsg.style.display = 'none';
                fnameInput.classList.remove('invalid-input');
            }

            if (lnameInput.value === '') {
                invalidLnameMsg.style.display = 'block';
                invalidLnameMsg.textContent = "Last name is empty. Please enter a valid value."
                lnameInput.classList.add('invalid-input');
                isValid = false;
            } else {
                invalidLnameMsg.style.display = 'none';
                lnameInput.classList.remove('invalid-input');
            }

            if (emailInput.value === '') {
                invalidEmailMsg.style.display = 'block';
                invalidEmailMsg.textContent = "Email address is empty. Please enter a valid value."
                emailInput.classList.add('invalid-input');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                invalidEmailMsg.style.display = 'block';
                invalidEmailMsg.textContent = "Email address is in an incorrect format. Please enter a valid value."
                emailInput.classList.add('invalid-input');
                isValid = false;
            } else {
                invalidEmailMsg.style.display = 'none';
                emailInput.classList.remove('invalid-input');
            }

            if (phoneNumInput.value === '') {
                invalidPhoneMsg.style.display = 'block';
                invalidPhoneMsg.textContent = "Phone number is empty. Please enter a valid value."
                phoneNumInput.classList.add('invalid-input');
                isValid = false;
            } else if (!phoneNumRegex.test(phoneNumInput.value)) {
                invalidPhoneMsg.style.display = 'block';
                invalidPhoneMsg.textContent = "Phone number is in an incorrect format. Please enter a valid value."
                phoneNumInput.classList.add('invalid-input');
                isValid = false;
            } else {
                invalidPhoneMsg.style.display = 'none';
                phoneNumInput.classList.remove('invalid-input');
            }

            if (messageInput.value === '') {
                invalidMessageMsg.style.display = 'block';
                invalidMessageMsg.textContent = "Phone number is empty. Please enter a valid value."
                messageInput.classList.add('invalid-input');
                isValid = false;
            } else {
                invalidMessageMsg.style.display = 'none';
                messageInput.classList.remove('invalid-input');
            }

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

        fnameInput.addEventListener('change', () => {
            invalidFnameMsg.style.display = 'none';
            fnameInput.classList.remove('invalid-input');
        })

        lnameInput.addEventListener('change', () => {
            invalidLnameMsg.style.display = 'none';
            lnameInput.classList.remove('invalid-input');
        })

        emailInput.addEventListener('change', () => {
            invalidEmailMsg.style.display = 'none';
            emailInput.classList.remove('invalid-input');
        })

        phoneNumInput.addEventListener('change', () => {
            invalidPhoneMsg.style.display = 'none';
            phoneNumInput.classList.remove('invalid-input');
        })

        messageInput.addEventListener('change', () => {
            invalidMessageMsg.style.display = 'none';
            messageInput.classList.remove('invalid-input');
        })
    }
})();

