import { openingModal, closingModal, openPaymentModal, purpleBackground, convertPriceAndQuantityToTotal, 
    changePaymentTerms, setPaymentTerms, changeModalBorders, ifItemListIsEmpty, changeTextColors, 
    areEveryFieldFilledOut, doesInputContainLetters, changeDraftColors, addRedColorsToInputs, removeListContainer} from "./helperFunctions.js";

/* DOM queries */

let modalFilter = document.querySelector(".modal--filter");
let modalEmpty = document.querySelector(".modal--empty");
let filterPanel = document.querySelector(".panel--filter");
let logoArrow = document.querySelector(".logo--arrow");
let checkboxContainers = document.querySelectorAll(".checkbox");
let checkboxes = document.querySelectorAll(".checkbox svg");
let themeLogo = document.querySelector(".logo--theme");
let body = document.querySelector("body");
let numberOfInvoices = document.querySelector(".number--invoices");
let invoicesSection = document.querySelector(".section--invoices");
let invoices = document.querySelectorAll(".invoice");
let buttonNew = document.querySelector(".button--new");
let statusTexts = document.querySelectorAll(".status--text");
let modalNew = document.querySelector(".modal--new");
let lightbox = document.querySelector(".lightbox");

// Modal New

let buttonGoBack = document.querySelector(".panel--goback--modal p");
let buttonNewItem = document.querySelector(".button--new--modal");
let buttonDiscard = document.querySelector(".button--discard");
let buttonsColorChange = document.querySelectorAll(".change");
let buttonSave = document.querySelector(".button--save");
let buttonsTrash = document.querySelectorAll(".trashbin");
let buttonDraft = document.querySelector(".button--draft");
let paymentLogo = document.querySelector(".arrow--down");
let allInputs = modalNew.querySelectorAll(".input");
let inputs = document.querySelectorAll("input");
let billInputs = document.querySelectorAll(".js--error");
let listInputs = document.querySelectorAll(".input--list");
let numberInputs = document.querySelectorAll(".input--number");
let calcInputs = document.querySelectorAll(".calc");
let senderAdressInputs = document.querySelectorAll(".from");
let clientAdressInputs = document.querySelectorAll(".to");
let infoInputs = document.querySelectorAll(".info");
let dateInput = document.querySelector(".input--date");
let errorTexts = document.querySelectorAll(".error");
let allErrorMessages = document.querySelectorAll(".message");
let footer = document.querySelector("footer");
let listSection = document.querySelector(".section--list");
let listContainers = document.querySelectorAll(".container--list");
let modalPayment = document.querySelector(".modal--payment");
let labelPanels = document.querySelectorAll(".panel--label");
let storedTheme = localStorage.getItem("theme");
let ids = document.querySelectorAll(".id");
let allLabels = document.querySelectorAll("label");  

let total = 0;
let tagArray = [];
let currentDate = new Date();

// regular expressions

let regExpNumbers = new RegExp(/[0-9]/);
let validEmailRegex = new RegExp(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/);

// localStorage 

let storedPaid = localStorage.getItem("paid");
let storedInvoice = localStorage.getItem("invoice");
let storedJsonData = JSON.parse(localStorage.getItem("jsonData"));
let newInvoice;
if(storedInvoice != null && storedInvoice != "") {
    newInvoice = JSON.parse(storedInvoice);
};

// booleans 

let isDarkThemeOn = false;
let names;
let colors;
let colorClass;
let jsonData;
let message;
let grandTotal = 0;
let colorBlack = "black";
let colorWhite = "white";
let colorGrayBlue = "grayBlue"
let textColor = isDarkThemeOn === true ? "white" : "black";

const fetchJson = async () => {
    try {
        let response = await fetch("/data.json");
        let jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.log("error");
    };
};

const filterBetweenStatuses = () => {
    checkboxContainers.forEach(box => {
        box.addEventListener("click", () => {
            let clickedStatus = box.nextElementSibling.textContent.toLowerCase();
            console.log(clickedStatus)
            statusTexts.forEach((text, index) => {
                let invoice = invoices[index];
                let isVisible = text.textContent === clickedStatus;
                invoice.classList.toggle("nodisplay", !isVisible);
                let boxesUnclicked = Array.from(checkboxContainers).every(box => {
                    return box.classList.contains("clicked") === false;
                });
                if(!boxesUnclicked) {
                    invoice.classList.remove("nodisplay");
                };
            })
        });
    });
};

const createInvoicesOnStart = (id, date, name, total, status) => {
    let div = document.createElement("div");
    div.classList.add("invoice");
    if(isDarkThemeOn) {
        div.classList.add("purple");
    };
    updateColorClassForStatus(status, colorClass);
    textColor = isDarkThemeOn === true ? "white" : "black";
    div.innerHTML = `
        <div class="tag">#<span class="${textColor} id">${id}</span></div>
        <div class="date">${date}</div>
        <div class="name">${name}</div>
        <div class="money ${textColor}">£ ${total}</div>
        <div class="status ${colorClass}">
            <div class="ball">.</div>
            <p class="status--text">${status}</p>
        </div>
        <div class="arrow--right"></div>`;
    invoicesSection.append(div);
};

const clickingOnInvoices = (invoices, ids, jsonData) => {
    invoices.forEach((invoice, index) => {
        let id = ids[index].textContent;
        invoice.addEventListener("click", () => {
            localStorage.setItem("id", id);
            location.assign("./view.html");
            localStorage.setItem("jsonData", JSON.stringify(jsonData));
            localStorage.setItem("theme", `${isDarkThemeOn}`);
        })
    })
};

const removeInvoices = (names, invoices, objects) => {
    let storedDelete = localStorage.getItem("delete");
    names.forEach((name, index) => {
        let invoice = invoices[index];
        if(name.textContent === storedDelete) {
            invoice.remove();
        };
    });
    objects.forEach((data, index, objects) => {
        let dataName = data.name;
        if(dataName === storedDelete) {
            objects.splice(index, 1)
        };
    })
};

const updateColorClassForStatus = (status) => {
    colorClass = status === "paid" ? "green" : status === "pending" ? "orange" : "gray";
    if(status === "draft" && isDarkThemeOn === true) {
        colorClass = "lightGray";
    };
};

const updatePaymenStatus = (statuses, statusTexts) => {
    names.forEach((name, index) => {
        let status = statuses[index];
        let statusText = statusTexts[index];
        if(name.textContent === storedPaid) {
            status.className = "status";
            status.classList.add("green");
            statusText.textContent = "paid";
        };
    })
};

const eraseAllInputData = (labelPanels, allErrorMessages, allInputs) => {
    let listErrorMessages = document.querySelectorAll(".list--error");
    listErrorMessages.forEach(errorMessage => {
        errorMessage.classList.add("nodisplay");
    })
    labelPanels.forEach(panel => {
        panel.classList.remove("red");
    });
    allErrorMessages.forEach(message => {
        if(message.matches(".error")) {
            message.classList.add("hidden");
        };
    });
    allInputs.forEach(input => {
        input.value = "";
        input.classList.remove("red--border");
        if(input.matches(".input--payment")) {
            input.value = "Net 1 Day";
        } else if(input.matches(".input--date")) {
            setCurrentDate(currentDate, input)
        };
    });
};

const handleJsonData = async () => {
    storedJsonData = JSON.parse(localStorage.getItem("jsonData"));
    storedInvoice = localStorage.getItem("invoice");
    if(storedInvoice != null && storedInvoice != "") {
        newInvoice = JSON.parse(storedInvoice);
    };
    if(storedJsonData === null) {
        jsonData = await fetchJson();
    } else if(newInvoice != undefined) {
        jsonData = storedJsonData;
        let doesInvoiceExist = false;
        storedJsonData.forEach(data => {
            if(data.id === newInvoice.id) {
                doesInvoiceExist = true;
            };
        })
        if(!doesInvoiceExist) {
            jsonData.push(newInvoice);
        }; 
    } else {
        jsonData = storedJsonData;
    }
    let invoiceData = jsonData.map(data => {
        return {id: data.id, date: data.paymentDue, status: data.status, 
                    name: data.clientName, total: data.total}; 
        })
        invoicesSection.innerHTML = "";
        invoiceData.forEach(invoice => {
            let {id, date, name, total, status} = invoice;
            createInvoicesOnStart(id, date, name, total, status);
        });
        colors = document.querySelectorAll(`.${textColor}`);
        invoices = document.querySelectorAll(".invoice");
        names = document.querySelectorAll(".name");
        ids = document.querySelectorAll(".id");
        let statuses = document.querySelectorAll(".status");
        statusTexts = document.querySelectorAll(".status--text");
        removeInvoices(names, invoices, invoiceData);
        invoices = document.querySelectorAll(".invoice");
        numberOfInvoices.textContent = invoices.length;
        clickingOnInvoices(invoices, ids, jsonData);
        updatePaymenStatus(statuses, statusTexts);
        
};

const toggleFilterModal = () => {
    modalFilter.classList.toggle("hidden");
    logoArrow.classList.toggle("rotate");
};

const clickingOnStatusPanels = () => {
    checkboxContainers.forEach((container, index) => {
        let checkbox = checkboxes[index];
        let isClicked = false;
        container.addEventListener("click", () => {
            checkboxes.forEach(box => box.classList.add("hidden"));
            checkboxContainers.forEach(container => container.classList.remove("clicked"));
            if(isClicked) {
                isClicked = false; 
            } else {
                checkbox.classList.toggle("hidden");
                container.classList.toggle("clicked");
                isClicked = true;
            };
        })
    });
};

const changeContainerColors = () => {
    modalFilter.classList.toggle("dark-purple");
    footer.classList.toggle("dark--modal");
    modalNew.classList.toggle("dark--modal");
    body.classList.toggle("dark");
    buttonNewItem.classList.toggle("dark-purple--modal");
    buttonDiscard.classList.toggle("dark-purple--modal");
    modalPayment.classList.toggle("dark-modal");
};

const changingTheme = () => {
    isDarkThemeOn = isDarkThemeOn === true ? false : true;
    let logo = isDarkThemeOn === true ? "sun" : "moon";
    themeLogo.style.backgroundImage = `url(/assets/icon-${logo}.svg)`;
    changeTextColors(colors, colorBlack, colorWhite);
    changeTextColors(allLabels, colorGrayBlue, colorWhite);
    purpleBackground(invoices);
    purpleBackground(allInputs);
    purpleBackground(checkboxContainers);
    changeModalBorders(modalPayment, isDarkThemeOn);
    changeContainerColors();
    changeDraftColors(statusTexts);
    buttonsColorChange.forEach(button => {
        button.classList.toggle("gray--modal");
    });
    allInputs.forEach(input => {
        input.style.border = isDarkThemeOn === true ? "1px solid #1E2139" : "1px solid #DFE3FA";
    });
    localStorage.setItem("theme", `${isDarkThemeOn}`);
};

const isInvoicesEmpty = () => {
    if(invoicesSection.childElementCount == 0) {
        modalEmpty.classList.remove("hidden");
    } else {
        modalEmpty.classList.add("hidden");
    };
};

// Modal New

const setCurrentDate = (date, input) => {
    let year = date.toLocaleString("default", {year: "numeric"});
    let month = date.toLocaleString("default", { month: "2-digit"});
    let day = date.toLocaleString("default", { day: "2-digit"});
    let currentDate = `${year}-${month}-${day}`;
    input.value = currentDate;
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

const createListContainer = () => {
    textColor = isDarkThemeOn === true ? "white" : "black";
    let labelColor = isDarkThemeOn === true ? "white" : "grayBlue";
    let listContainer = document.createElement("div");
    listContainer.classList.add("container--list");
    listContainer.innerHTML = 
    `<div class="panel--input">
        <form class="form--item">
        <label class=${labelColor}>Item Name</label>
        <input class="input input--large input--list input--item list--item ${textColor}">
        </form>
    </div>
    <div class="panel--input">
        <form class="form--tiny">
            <label class=${labelColor}>Qty.</label>
            <input class="input input--tiny input--list input--number calc list--item ${textColor}" maxlength="2">
        </form>
        <form class="form--small">
            <label class=${labelColor}>Price</label>
            <input class="input input--small input--list input--number calc list--item ${textColor}" maxlength="7">
        </form>
        <form class="form--total">
            <label class=${labelColor}>Total</label>
            <div class="input--total calc list--item"></div>
        </form>
            <svg class="trashbin" width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.44442 0L9.33333 0.888875H12.4444V2.66667H0V0.888875H3.11108L4 0H8.44442ZM2.66667 16C1.68442 16 0.888875 15.2045 0.888875 14.2222V3.55554H11.5555V14.2222C11.5555 15.2045 10.76 16 9.77779 16H2.66667Z" fill="#888EB0"/>
        </svg>
    </div>`
    listSection.append(listContainer);
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
        let statusIsPending = "pending";
        closingModal(modalNew, lightbox);
        createInvoiceAsObject(statusIsPending);
        eraseAllInputData(labelPanels, allErrorMessages, allInputs);
    };
};


const setKeysAndValues = (inputs, object) => {
    inputs.forEach(input => {
        let rawKey = input.previousElementSibling.children[0].textContent.replaceAll(" ", "").replaceAll("’s", "")
        let key = (rawKey.charAt(0).toLowerCase() + rawKey.slice(1)).replaceAll("streetAddress", "street").replace("project", "");
        object[key] = `${input.value}`;
    });
};

const createRandomLetter = () => {
    let alphabet = "abcdefghijklmnopqrstuvxyz";
    let randomNumberInAlphabet = Math.floor(Math.random() * alphabet.length);
    let randomLetter = alphabet[randomNumberInAlphabet].toUpperCase();
    tagArray.push(randomLetter)
};

const createRandomNumber = () => {
    let randomNumber = Math.floor(Math.random() * 9);
    tagArray.push(randomNumber.toString());
};

const createTag = (object) => {
    for(let i = 0; i < 2; i++) {
        createRandomLetter();    
    };  
    for(let i = 0; i < 4; i++) {
        createRandomNumber();
    };
    let tag = tagArray.toString().replaceAll(",", "");
    object.id = tag;
    tagArray = [];
};

const setListKeysAndValues = (object) => {
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
    setKeysAndValues(senderAdressInputs, invoiceObject.senderAddress);
    setKeysAndValues(clientAdressInputs, invoiceObject.clientAddress);
    setKeysAndValues(infoInputs, invoiceObject);
    setPaymentTerms(termsForm, invoiceObject);
    setInvoiceDates(dateForm, invoiceObject);
    setListKeysAndValues(invoiceObject);
    createTag(invoiceObject);
    invoiceObject.total = grandTotal;
    localStorage.setItem("invoice", JSON.stringify(invoiceObject));
};

filterBetweenStatuses();
changePaymentTerms(modalPayment, allInputs);
removeListContainer(buttonsTrash, listContainers, listInputs);   
calculateTotal();
setCurrentDate(currentDate, dateInput);
fetchJson();
handleJsonData();
clickingOnStatusPanels();
setInterval(isInvoicesEmpty, 0);
if(storedTheme != "" && storedTheme === "true") {
    changingTheme();
}; 

// event listeners 

filterPanel.addEventListener("click", toggleFilterModal);
themeLogo.addEventListener("click", changingTheme);
buttonNew.addEventListener("click", () => {
    openingModal(modalNew, lightbox)
    localStorage.setItem("theme", `${isDarkThemeOn}`);
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
});
buttonSave.addEventListener("click", () => {
    showErrorMessages();
    checkIfListInputsAreValid();
    isEverythingValid();
    handleJsonData();
});

buttonDraft.addEventListener("click", () => {
    let statusIsDraft = "draft"
    createInvoiceAsObject(statusIsDraft);
    modalNew.classList.toggle("hidden");
    lightbox.classList.toggle("hidden");
    eraseAllInputData(labelPanels, allErrorMessages, allInputs);
    handleJsonData();
});
buttonDiscard.addEventListener("click", () => {
    closingModal(modalNew, lightbox);
    eraseAllInputData(labelPanels, allErrorMessages, allInputs);
});

allInputs.forEach(input => {
    input.addEventListener("click", (event) => {
        if(event.target.matches(".input--payment")) {
            openPaymentModal(paymentLogo, modalPayment);
        }
    });
});

buttonGoBack.addEventListener("click", () => {
    closingModal(modalNew, lightbox);
    localStorage.setItem("theme", `${isDarkThemeOn}`);
});
buttonNewItem.addEventListener("click", () => {
    createListContainer();
    buttonsTrash = document.querySelectorAll(".trashbin");
    listContainers = document.querySelectorAll(".container--list");
    inputs = document.querySelectorAll("input");
    calcInputs = document.querySelectorAll(".calc");
    listInputs = document.querySelectorAll(".input--list");
    allInputs = modalNew.querySelectorAll(".input");
    colors = document.querySelectorAll(`.${textColor}`);
    console.log(colors)
    calculateTotal();
    removeListContainer(buttonsTrash, listContainers, listInputs);   
    if(isDarkThemeOn) {
        inputs.forEach(input => {
            if(!input.classList.contains("purple")) {
                input.classList.add("purple");
            }
        })
    };
});



