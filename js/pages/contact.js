const contactForm = document.getElementById("form-container");
const fnameInput = document.getElementById("fname");
const lnameInput = document.getElementById("lname");
const emailInput = document.getElementById("email");
const phoneNumInput = document.getElementById("phone-number");
const messageInput = document.getElementById("message");
const messageSent = document.getElementById("message-sent");
const messageSentReturnBtn = document.getElementById("message-return__button");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneNumRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

let isValid = true;

const invalid = (input) => {
  function message() {
    if (input.value === "") {
      const inputDataName = input.getAttribute("data-name");
      return `${inputDataName} is empty. Please enter a valid value.`;
    } else {
      if (input === emailInput) {
        return "Email address is in an incorrect format. Please enter a valid value containing @.";
      } else if (input === phoneNumInput) {
        return `Phone number is in an incorrect format. Please enter any valid phone number format (ex. 123-456-7890, (123) 456-7890).`;
      }
    }
  }

  input.classList.add("invalid-input");
  // const invalidMsg = `<p class="invalid-input__msg" id="invalid-${input.name}__msg">${message()}</p>`; // not possible to use .after() for this case as the method typically inserts strings as text, even if it's a template literal creating a node
  const invalidMsg = document.createElement("p");
  invalidMsg.classList.add("invalid-input__msg");
  invalidMsg.id = `invalid-${input.name}__msg`;
  invalidMsg.textContent = message();
  input.after(invalidMsg);
  isValid = false;
};

const valid = (input) => {
  const invalidMsg = document.getElementById(`invalid-${input.name}__msg`);
  if (document.contains(invalidMsg)) {
    console.log(`removing: ${invalidMsg}`);
    invalidMsg.remove();
  }
  input.classList.remove("invalid-input");
};

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    const invalidMsg = document.getElementById(`invalid-${input.name}__msg`);
    if (!document.contains(invalidMsg)) {
      !input.value ||
      !emailRegex.test(emailInput.value) ||
      !phoneNumRegex.test(phoneNumInput.value)
        ? invalid(input)
        : valid(input);
    }
  });

  if (isValid) {
    messageSent.style.display = "flex";
    contactForm.style.display = "none";
    event.target.reset();
  }
});

messageSentReturnBtn.addEventListener("click", () => {
  messageSent.style.display = "none";
  contactForm.style.display = "flex";
});

fnameInput.addEventListener("input", (event) => {
  valid(event.target); // event.target gets 'fnameInput'
});

lnameInput.addEventListener("input", (event) => {
  valid(event.target);
});

emailInput.addEventListener("input", (event) => {
  valid(event.target);
});

phoneNumInput.addEventListener("input", (event) => {
  valid(event.target);
});

messageInput.addEventListener("input", (event) => {
  valid(event.target);
});
