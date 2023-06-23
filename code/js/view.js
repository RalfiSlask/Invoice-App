import { openingModal, closingModal, purpleBackground, convertPriceAndQuantityToTotal, changePaymentTerms, setPaymentTerms, 
    changeModalBorders, ifItemListIsEmpty, changeTextColors, areEveryFieldFilledOut, 
    doesInputContainLetters, changeDraftColors, addRedColorsToInputs, removeListContainer} from "./helperFunctions.js";

// DOM Queries

let body = document.querySelector("body");
let buttons = body.querySelectorAll("button");
let buttonsTrash = document.querySelectorAll(".trashbin");
let modalDelete = document.querySelector(".modal");
let sections = document.querySelectorAll(".section");
let senderAddresses = document.querySelectorAll(".wrapper--sender p");
let clientAddresses = document.querySelectorAll(".wrapper--client p");
let client = document.querySelector(".name");
let email = document.querySelector(".email");
let paymentStatus = document.querySelector(".status");
let dateCreated = document.querySelector(".panel--date h2");
let dateDue = document.querySelector(".panel--payment h2");
let tagPanel = document.querySelector(".panel--tag");
let designWrappers = document.querySelectorAll(".panel--design");
let themeLogo = document.querySelector(".logo--theme");
let totalContainer = document.querySelector(".container--total");
let designContainer = document.querySelector(".container--design");
let grand = document.querySelector(".total");
let lightbox = document.querySelector(".lightbox");
let idTag = document.querySelector(".tag");
let footerView = document.querySelector(".footer--view");
let tag = document.querySelector(".id");
let statusTexts = document.querySelectorAll(".status--text");

// Modal Edit DOM Queries //

let modalEdit = document.querySelector(".modal--edit");
let modalPayment = document.querySelector(".modal--payment");
let listSection = document.querySelector(".section--list");
let listContainers = document.querySelectorAll(".container--list");
let labelPanels = document.querySelectorAll(".panel--label");
let allInputs = modalEdit.querySelectorAll(".input");
let nameInput = document.querySelector(".input--name");
let emailInput = document.querySelector(".input--email");
let inputPayment = document.querySelector(".input--payment");
let inputDate = document.querySelector(".input--date");
let inputDescription = document.querySelector(".input--description");
let billInputs = document.querySelectorAll(".js--error");
let listInputs = document.querySelectorAll(".input--list");
let numberInputs = document.querySelectorAll(".input--number");
let inputTotals = document.querySelectorAll(".input--total");
let paymentLogo = document.querySelector(".arrow--down");
let senderAddressInputs = document.querySelectorAll(".from");
let clientAddressInputs = document.querySelectorAll(".to");
let calcInputs = document.querySelectorAll(".calc");
let inputs = document.querySelectorAll("input");
let infoInputs = document.querySelectorAll(".info");
let errorTexts = document.querySelectorAll(".error");
let allErrorMessages = document.querySelectorAll(".message");

// Locally stored variables

let storedTheme = localStorage.getItem("theme");
let storedInvoice = localStorage.getItem("invoice");
let storedJsonData = JSON.parse(localStorage.getItem("jsonData"));
let storedTag = localStorage.getItem("id");

// Regular expressions

let regExpNumbers = new RegExp(/[0-9]/);
let validEmailRegex = new RegExp(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/);

// Booleans

let isDarkThemeOn = false;

// Others

let colorClass;
let costs;
let textColor = isDarkThemeOn === true ? "white" : "black";
let colors = document.querySelectorAll(`.${textColor}`);
let newInvoice;
let newStatus;
let message;
let total = 0;
let grandTotal = 0;
let grandSum = 0;
let colorBlack = "black";
let colorWhite = "white";

if(storedInvoice != null && storedInvoice != "") {
    newInvoice = JSON.parse(storedInvoice);
};

const displayTotals = () => {
    storedJsonData.forEach(object => {
        if(object.id === storedTag) {
            object.items.forEach((item, index) => {
                let totalInput = inputTotals[index];
                totalInput.textContent = item.total.toString();
            })
        };
    });
};

const displayAddresses = (objectAddress, adresses) => {
    let addressArray = [];
    for(let property in objectAddress) {
        let objectValue = objectAddress[property];
        addressArray.push(objectValue);
    };
        adresses.forEach((address, index) => {
        let arrayValue = addressArray[index];
        address.textContent = arrayValue;
    });
};

const displayDates = (objectDate, date) => {
    objectDate = objectDate.replaceAll("-", " ");
    date.textContent = objectDate;
};

const updateColorClassForStatus = (status) => {
    colorClass = status === "paid" ? "green" : status === "pending" ? "orange" : "gray";
};

const displayPaymentStatus = (status, colorClass) => {
    paymentStatus.className = "status";
    paymentStatus.classList.add(`${colorClass}`);
            paymentStatus.innerHTML = 
            `<div class="ball">.</div>
            <div class="status--text">${status}</div>`
    statusTexts = document.querySelectorAll(".status--text");
};

const displayTagAndDescription = (id, description) => {
    tagPanel.innerHTML = `
    <h2 class="tag">#<span class="${textColor}">${id}</span></h2>
    <p class="description">${description}</p>`
};

const displayGrandTotal = (costs, index) => {
    let cost = costs[index].textContent;
    let costAsNumnber = Number(cost);
    grandSum += costAsNumnber;
    grand.textContent = grandSum.toFixed(2);
};

const displayDesigns = (items) => {
    items.forEach((item, index) => {
        let design = document.createElement("div");
        design.classList.add("panel");
        design.classList.add("panel--design");
        let {name, quantity, price, total} = item;
        design.innerHTML = 
        `<div class="wrapper wrapper--design">
            <h2 class="item--name ${textColor}">${name}</h2>
            <p><span class="multiply">${quantity}</span><span class="x"> x </span><span class="cost">£ ${price}</span></p>
        </div>
        <h2 class="${textColor}">£ <span class="price">${total}</span></h2>`
        designContainer.append(design)
        costs = document.querySelectorAll(".price");
        designWrappers = document.querySelectorAll(".panel--design");
        displayGrandTotal(costs, index);
    });
};

const markPaymentAsPaid = () => {
    newStatus = "paid";
    updateColorClassForStatus(newStatus);
    displayPaymentStatus(newStatus, colorClass);
    storedJsonData.forEach(object => {
        if(object.id === storedTag) {
            object.status = "paid";
        };
        localStorage.setItem("jsonData", JSON.stringify(storedJsonData));
    });
};

const removeRedColorsFromInputs = (error, panel, input) => {
    error.textContent = "";
    error.classList.add("hidden");
    panel.classList.remove("red");
    input.classList.remove("red--border");
    input.style.border = isDarkThemeOn === true ? "1px solid #1E2139" : "1px solid #DFE3FA";
};

const checkIfInputIsValid = (regularExpression, input, error, message, panel) => {
    let isEmailRegex = regularExpression === validEmailRegex;
    let isInputValid = regularExpression.test(input.value);
    if((isEmailRegex && !isInputValid) || (!isEmailRegex && isInputValid)) {
        addRedColorsToInputs(panel, input, error, message);
    } else {
        removeRedColorsFromInputs(error, panel, input);
    };
};

const showErrorMessages = () => {
    billInputs.forEach((input, index) => {
        let errorMessage = errorTexts[index];
        let labelPanel = labelPanels[index];
        message = "can’t be empty";
        if(input.value === "") {
            addRedColorsToInputs(labelPanel, input, errorMessage, message);
        } else if(input.classList.contains("number--letters")) {
            message = "cant contain numbers";
            checkIfInputIsValid(regExpNumbers, input, errorMessage, message, labelPanel);
        } else if(input.classList.contains("input--email")) {
            message = "must be valid email";
            checkIfInputIsValid(validEmailRegex, input, errorMessage, message, labelPanel);
        } else {
            removeRedColorsFromInputs(errorMessage, labelPanel, input);
        };
    });
};

const handleInvoices =  () => {
    let Data = storedJsonData;
    Data.forEach(object => {
        let id = object.id;
        if(id === storedTag) {
            let {paymentDue, createdAt, clientAddress, senderAddress, id,
                 description, clientName, clientEmail, status, items} = object;
            email.textContent = clientEmail;
            client.textContent = clientName;
            idTag.textContent = id;
            designContainer.innerHTML = "";
            textColor = isDarkThemeOn === true ? "white" : "black";
            displayDesigns(items);
            displayTagAndDescription(id, description);
            displayDates(createdAt, dateCreated);
            displayDates(paymentDue, dateDue);
            displayAddresses(clientAddress, clientAddresses);
            displayAddresses(senderAddress, senderAddresses);
            updateColorClassForStatus(status);
            displayPaymentStatus(status, colorClass);
            colors = document.querySelectorAll(`.${textColor}`);
        }
    });
};

const calculateTotal = () => {
    calcInputs.forEach((input, index, calcInputs) => {
        input.addEventListener("input", () => {
            let price;
            let quantity;
            let totals;
            if(input.previousElementSibling.textContent === "Qty.") {
                price = calcInputs[index+1];
                totals = calcInputs[index+2];
                convertPriceAndQuantityToTotal(total, input, price, totals);
            } else if(input.previousElementSibling.textContent === "Price") {
                quantity = calcInputs[index-1];
                totals = calcInputs[index+1];
                convertPriceAndQuantityToTotal(total, input, quantity, totals);
            };
        })
    });
};

const changeButtonColors = () => {
    buttons.forEach(button => {
        if(button.matches(".button--edit")) {
            button.classList.toggle("dark-purple")
        } else if(button.matches(".button--cancel--edit") || button.matches(".button--new")) {
            button.classList.toggle("dark-purple");
        };
    });
};

const changeContainerColors = () => {
    body.classList.toggle("dark");
    let footerContainer = document.querySelector(".container--footer")
    let main = document.querySelector("main");
    main.classList.toggle("dark");
    footerContainer.classList.toggle("dark-purple")
    designContainer.classList.toggle("dark-purple");
    totalContainer.classList.toggle("darker");
    modalEdit.classList.toggle("dark");
    modalPayment.classList.toggle("dark-modal");
    modalDelete.classList.toggle("dark");
};

const changingTheme = () => {
    isDarkThemeOn = isDarkThemeOn === true ? false : true;
    let logo = isDarkThemeOn === true ? "sun" : "moon";
    themeLogo.style.backgroundImage = `url(/code/assets/icon-${logo}.svg)`;
    allInputs = modalEdit.querySelectorAll(".input");
    console.log(allInputs)
    purpleBackground(sections);
    purpleBackground(allInputs);
    changeModalBorders(modalPayment, isDarkThemeOn);
    changeContainerColors();
    changeButtonColors();
    changeTextColors(colors, colorBlack, colorWhite);
    changeDraftColors(statusTexts);
    textColor = isDarkThemeOn === true ? "white" : "black";
    colors = document.querySelectorAll(`.${textColor}`);
    allInputs.forEach(input => {
        input.style.border = isDarkThemeOn === true ? "1px solid #1E2139" : "1px solid #DFE3FA";
    });
};

const convertingObjectAddressInfoToInputs = (key, inputs) => {
    Object.values(key).forEach((value, index) => {
        let input = inputs[index];
        input.value = value;
    });
};

const setInvoiceDates = (form, object) => {
    let input = form.querySelector("input").value;
    let date = new Date(`${input}`);
    date.setDate(date.getDate() + object.paymentTerms);
    let year = date.toLocaleString("default", {year: "numeric"});
    let month = date.toLocaleString("default", { month: "2-digit"});
    let day = date.toLocaleString("default", { day: "2-digit"});
    let paymentDue = `${year}-${month}-${day}`;
    object.createdAt = input;
    object.paymentDue = paymentDue;
};

const setListKeysAndValues = (object) => {
    grandTotal = 0;
    listContainers.forEach(container => {
        let itemObjects = {};
        let labels = container.querySelectorAll("label");  
        inputs = container.querySelectorAll(".list--item");
        labels.forEach((label, index) => {
            let input = inputs[index].value;
            if(input === undefined) {
                input = Number(inputs[index].textContent);
            };
            if(typeof input === "string" && !isNaN(input)) {
                input = Number(inputs[index].value);
            };
            if(label.textContent.includes("Name")) {
                input = inputs[index].value
            };
            let key = label.textContent.toLowerCase();
            key = key.includes("item") ? key.replace("item ", "") : key;
            key = key.includes("qty.") ? key.replace("qty.", "quantity") : key;
            itemObjects[key] = input;
            if(label.textContent.includes("Total")) {
                grandTotal += Number(input);
            };
        });
        object.items.push(itemObjects);
    });
};

const deleteInvoice = () => {
    storedJsonData.forEach((object, index, storedJsonData) => {
        if(object.id === storedTag) {
            storedJsonData.splice(index, 1);
        };
        if(newInvoice != undefined && newInvoice.id === storedTag) {
            localStorage.setItem("invoice", "");
        };
        localStorage.setItem("jsonData", JSON.stringify(storedJsonData));
    })
    location.assign("./index.html"); 
};

const convertingObjectInfoToInputs = (object) => {
    nameInput.value = object.clientName;
    emailInput.value = object.clientEmail;
    inputPayment.value = `Net ${object.paymentTerms.toString()} Day`;
    let invoiceDate = object.createdAt;
    if(object.createdAt.length < 10) {
        invoiceDate = invoiceDate.substring(0, 8) + "0" + invoiceDate.substring(8, 9);
    };
    inputDate.value = invoiceDate;
    inputDescription.value = object.description;
    tag.textContent = object.id;
};

const convertingListItemsToInputs = (object) => {
    object.items.forEach((item, index) => {
        createListContainer();
        let container = listContainers[index];
        Object.values(item).forEach((value, index) => {
                let input = container.querySelectorAll(".list--item")[index];
                if(input.classList.contains("input--total")) {
                    input.textContent = value;
                } else {
                    input.value = value;
                };
        });
    });
};

const loadJsonDataToEdit = () => {
    let Data = storedJsonData;
    Data.forEach(object => {
        if(object.id === storedTag) {
            let senderAddress = object.senderAddress;
            let clientAddress = object.clientAddress;
            convertingObjectAddressInfoToInputs(senderAddress, senderAddressInputs);
            convertingObjectAddressInfoToInputs(clientAddress, clientAddressInputs);
            convertingObjectInfoToInputs(object);
            convertingListItemsToInputs(object);
        };
    });
};

const createListContainer = () => {
    let listContainer = document.createElement("div");
    listContainer.classList.add("container--list");
    listContainer.innerHTML = 
    `<div class="panel--input">
        <form class="form--item">
        <label>Item Name</label>
        <input class="input input--large input--list input--item list--item">
        </form>
    </div>
    <div class="panel--input">
        <form class="form--tiny">
            <label>Qty.</label>
            <input class="input input--tiny input--list input--number calc list--item" maxlength="2">
        </form>
        <form class="form--small">
            <label>Price</label>
            <input class="input input--small input--list input--number calc list--item" maxlength="7">
        </form>
        <form class="form--total">
            <label class="label--total">Total</label>
            <div class="input--total calc list--item"></div>
        </form>
            <svg class="trashbin" width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.44442 0L9.33333 0.888875H12.4444V2.66667H0V0.888875H3.11108L4 0H8.44442ZM2.66667 16C1.68442 16 0.888875 15.2045 0.888875 14.2222V3.55554H11.5555V14.2222C11.5555 15.2045 10.76 16 9.77779 16H2.66667Z" fill="#888EB0"/>
        </svg>
    </div>`
    listSection.append(listContainer);
    buttonsTrash = document.querySelectorAll(".trashbin");
    listContainers = document.querySelectorAll(".container--list");
    inputs = document.querySelectorAll("input");
    calcInputs = document.querySelectorAll(".calc");
    listInputs = document.querySelectorAll(".input--list");
    inputTotals = document.querySelectorAll(".input--total");
    allInputs = modalEdit.querySelectorAll(".input");
    numberInputs = document.querySelectorAll(".input--number");
};

const checkIfListInputsAreValid = () => {
    listInputs.forEach(input => {
        if(input.value === "") {
            input.classList.add("red--border");
        } else {
            input.classList.remove("red--border");
            input.style.border = isDarkThemeOn === true ? "1px solid #1E2139" : "1px solid #DFE3FA";
        };
        doesInputContainLetters(allErrorMessages, numberInputs, regExpNumbers);
    })
    areEveryFieldFilledOut(listInputs, allErrorMessages);
    ifItemListIsEmpty(listSection, allErrorMessages);
};

const isEverythingValid = () => {
    let isValid = Array.from(allErrorMessages).every(element => {
        let invalidInput = element.classList.contains("hidden") || element.classList.contains("nodisplay");
        return invalidInput;
    });
    if(isValid) {
        modalEdit.classList.toggle("hidden");
        lightbox.classList.toggle("hidden");
    };
};

const setKeysAndValues = (inputs, object) => {
    inputs.forEach(input => {
        let rawKey = input.previousElementSibling.children[0].textContent.replaceAll(" ", "").replaceAll("’s", "")
        let key = (rawKey.charAt(0).toLowerCase() + rawKey.slice(1)).replaceAll("streetAddress", "street").replace("project", "");
        object[key] = `${input.value}`;
    });
};

const createInvoiceAsObject = (status) => {
    let invoiceObject = {
        status: `${status}`,
        senderAddress : {
        },
        clientAddress: {
        },
        items: []
    };
    let dateForm = document.querySelector(".form--date");
    let termsForm = document.querySelector(".form--payment");
    setKeysAndValues(senderAddressInputs, invoiceObject.senderAddress);
    setKeysAndValues(clientAddressInputs, invoiceObject.clientAddress);
    setKeysAndValues(infoInputs, invoiceObject);
    setPaymentTerms(termsForm, invoiceObject);
    setInvoiceDates(dateForm, invoiceObject);
    setListKeysAndValues(invoiceObject);
    invoiceObject.id = tag.textContent;
    invoiceObject.total = grandTotal;
    localStorage.setItem("invoice", JSON.stringify(invoiceObject));
};

const openingEditModal = () => {
    modalEdit.classList.toggle("hidden");
    footerView.classList.toggle("nodisplay");
    if(!isDarkThemeOn) {
        body.style.backgroundColor = "#F8F8F8";
    };
    lightbox.classList.toggle("hidden");
};

const closingEditModal = () => {
    lightbox.classList.toggle("hidden");
    modalEdit.classList.toggle("hidden");
    footerView.classList.toggle("nodisplay");
};

const goBackToPreviousPage = () => {
    location.assign("./index.html");
    localStorage.setItem("theme", `${isDarkThemeOn}`);
};

const savingChangesToEdit = () => {
    grandSum = 0;
    let statusIsPending = "pending";
    showErrorMessages();
    checkIfListInputsAreValid();
    isEverythingValid();
    createInvoiceAsObject(statusIsPending);
    textColor = isDarkThemeOn === true ? "white" : "black";
    colors = document.querySelectorAll(`.${textColor}`);
    storedInvoice = localStorage.getItem("invoice");
    if(storedInvoice != null && storedInvoice != "") {
    newInvoice = JSON.parse(storedInvoice);
    };
    storedJsonData.forEach((object, index, storedJsonData) => {
        if(newInvoice.id === object.id) {
            storedJsonData.splice(index, 1, newInvoice);
            localStorage.setItem("jsonData", JSON.stringify(storedJsonData));
            storedJsonData = JSON.parse(localStorage.getItem("jsonData"));
        };
    });
    displayTotals();
    handleInvoices();
};

const handleNewListContainer = () => {
    createListContainer();
    buttonsTrash = document.querySelectorAll(".trashbin");
    listContainers = document.querySelectorAll(".container--list");
    inputs = document.querySelectorAll("input");
    calcInputs = document.querySelectorAll(".calc");
    listInputs = document.querySelectorAll(".input--list");
    calculateTotal();
    removeListContainer(buttonsTrash, listContainers, listInputs);    
    if(isDarkThemeOn) {
        inputs.forEach(input => {
            if(!input.classList.contains("purple")) {
                input.classList.add("purple");
            };
        })
    };
};

// Function Calls

handleInvoices();
changePaymentTerms(modalPayment, allInputs);
loadJsonDataToEdit();
displayTotals();
removeListContainer(buttonsTrash, listContainers, listInputs);   
calculateTotal();

// Event Listeners

themeLogo.addEventListener("click", changingTheme);
inputPayment.addEventListener("click", () => {
    paymentLogo.classList.toggle("rotate");
    modalPayment.classList.toggle("hidden");
});

buttons.forEach(button => {
    button.addEventListener("click", (event) => {
        if(event.target.matches(".button--edit")) {
            openingEditModal()
        } else if(event.target.matches(".button--delete__one")) {
            openingModal(lightbox, modalDelete);
        } else if(event.target.matches(".button--delete__two")) {
            deleteInvoice();
        } else if(event.target.matches(".button--paid")) {
            markPaymentAsPaid();
        } else if(event.target.matches(".button--cancel")) {
            closingModal(lightbox, modalDelete);
        } else if(event.target.matches(".button--cancel--edit")) {
            closingEditModal();
        } else if(event.target.matches(".button--goback")) {
            goBackToPreviousPage();
        } else if(event.target.matches(".button--changes")) {
            savingChangesToEdit();
        } else if(event.target.matches(".button--new")) {
            handleNewListContainer();
        };
    });
});

if(storedTheme != "" && storedTheme === "true") {
    changingTheme();
}; 
