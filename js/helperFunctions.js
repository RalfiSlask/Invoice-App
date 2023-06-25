// Helper Functions
let inputPayment;

export const openingModal = (lightbox, modal) => {
    lightbox.classList.remove("hidden");
    modal.classList.remove("hidden");
};

export const closingModal = (lightbox, modal) => {
    lightbox.classList.add("hidden");
    modal.classList.add("hidden");
};

export const purpleBackground = (elements) => {
    elements.forEach(element => {
        element.classList.toggle("purple");
    });
};

export const openPaymentModal = (logo, modal) => {
    logo.classList.toggle("rotate");
    modal.classList.toggle("hidden")
};

export const convertPriceAndQuantityToTotal = (total, input, value, totals) => {
    total = +input.value * +value.value;
    if(!isNaN(total)) {
        totals.textContent = total.toFixed(2);
    } else {
        totals.textContent = 0;
    };
};

export const changePaymentTerms = (modalPayment, allInputs) => {
    let paymentPanels = modalPayment.querySelectorAll(".panel--net");
    allInputs.forEach(input => {
        if(input.matches(".input--payment")) {
            inputPayment = input;
        };
    });
    paymentPanels.forEach(panel => {
        panel.addEventListener("click", () => {
            inputPayment.value = panel.textContent;
            modalPayment.classList.toggle("hidden");
        })
    });
};

export const setPaymentTerms = (form, object) => {
    let input = form.querySelector("input").value;
    input = Number(input.substring(4, 6).replace(" ", ""));
    object.paymentTerms = input;
;}

export const changeModalBorders = (modal, isDarkThemeOn) => {
    let childArray = Array.from(modal.children);
    childArray.forEach(child => {
        child.style.border = isDarkThemeOn === true ? "1px solid #1E2139" : "1px solid #DFE3FA";
    }); 
};

export const ifItemListIsEmpty = (listSection, allErrorMessages) => {
    let errorText = Array.from(allErrorMessages).find(message => message.matches(".error--name"));
    listSection.children.length == 0 ? errorText.classList.remove("nodisplay") : errorText.classList.add("nodisplay");
};

export const changeTextColors = (colors, colorOne, colorTwo) =>  {
    colors.forEach(color => {
        if(!color.matches(".error")) {
            color.classList.toggle(`${colorOne}`);
            color.classList.toggle(`${colorTwo}`);
        };
    });
};

export const areEveryFieldFilledOut = (listInputs, allErrorMessages) => {
    let errorText = Array.from(allErrorMessages).find(message => message.matches(".error--fields"));
    let inputsFilledOut = Array.from(listInputs).every(input => {
        return input.value != "";
    })
    inputsFilledOut ? errorText.classList.add("nodisplay") : errorText.classList.remove("nodisplay");
};

export const doesInputContainLetters = (allErrorMessages, numberInputs, regExpNumbers) => {
    let errorText = Array.from(allErrorMessages).find(message => message.matches(".error--price"));
    let inputsContainNumbers = Array.from(numberInputs).every(input => {
        if(input.value === "" || regExpNumbers.test(input.value)) {
            return input;
        }
    });
    inputsContainNumbers ? errorText.classList.add("nodisplay") : errorText.classList.remove("nodisplay");
};

export const setKeysAndValues = (inputs, object) => {
    inputs.forEach(input => {
        let rawKey = input.previousElementSibling.children[0].textContent.replaceAll(" ", "").replaceAll("’s", "")
        let key = (rawKey.charAt(0).toLowerCase() + rawKey.slice(1)).replaceAll("streetAddress", "street").replace("project", "");
        object[key] = `${input.value}`;
    });
};

export const changeDraftColors = (texts) => {
    texts.forEach(text => {
        if(text.textContent === "draft") {
            text.parentElement.classList.toggle("gray");
            text.parentElement.classList.toggle("lightGray");
        };
    });
};

export const addRedColorsToInputs = (panel, input, error, message) => {
    panel.classList.add("red");
    input.classList.add("red--border");
    error.classList.remove("hidden");
    error.textContent = `${message}`;
};

export const removeRedColorsFromInputs = (error, panel, input, isDarkThemeOn) => {
    error.textContent = "";
    error.classList.add("hidden");
    panel.classList.remove("red");
    input.classList.remove("red--border");
    input.style.border = isDarkThemeOn === true ? "1px solid #1E2139" : "1px solid #DFE3FA";
};

export const removeListContainer = (buttonsTrash, listContainers, listInputs) => {
    buttonsTrash = document.querySelectorAll(".trashbin");
    buttonsTrash.forEach((button, index) => {
        let listContainer = listContainers[index];
        button.addEventListener("click", () => {
            listContainer.remove();
            listInputs = document.querySelectorAll(".input--list");
            listContainers = document.querySelectorAll(".container--list");
        });
    })
};
