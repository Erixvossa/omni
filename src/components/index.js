const formContainer = document.querySelector('.form-container');

const validationRules = {
    formSelector: '.form',
    inputSelector: '.form__input',
    submitButtonSelector: '.form__submit-button',
    inactiveButtonClass: 'form__submit-button_disabled',
    inputErrorClass: 'form__input-error',
    errorClass: 'form__span-error_show',
    okClass: 'form__span-error_confirmed',
};

const numberInput = document.querySelector('#form-phone');
numberInput.removeAttribute('maxlength');
numberInput.addEventListener("input", (e) => autocompleteNumber(e));
numberInput.setAttribute('maxlength', '19');
numberInput.setAttribute('minlength', '19');


const autocompleteNumber = (e) => {
    e.preventDefault();

    const numRegExp = /[a-zа-яё0-9]/gi;
    const numberArr = [];

    let numberValue = numberInput.value;

    for(let i = 0; i < numberValue.length; i++) {
        numberArr.push(numberValue[i]);
    }

    if (numberValue) {
        const autocompletedNumberArr = numberArr.filter(num => num.match(numRegExp));
        let numberCount = numberValue.match(numRegExp).length;

        switch(numberCount) {
            case 2:
            case 3:
            case 4:
                autocompletedNumberArr.splice(1, 0, ' ( ');
                break;
            case 5:
            case 6:
            case 7:
                autocompletedNumberArr.splice(1, 0, ' ( ');
                autocompletedNumberArr.splice(5, 0, ' ) ');
                break;
            case 8:
            case 9:
                autocompletedNumberArr.splice(1, 0, ' ( ');
                autocompletedNumberArr.splice(5, 0, ' ) ');
                autocompletedNumberArr.splice(9, 0, '-');
                break;
            case 10:
            case 11:
                autocompletedNumberArr.splice(1, 0, ' ( ');
                autocompletedNumberArr.splice(5, 0, ' ) ');
                autocompletedNumberArr.splice(9, 0, '-');
                autocompletedNumberArr.splice(12, 0, '-');
                break;
            default:
                autocompletedNumberArr.splice(12, autocompletedNumberArr.length - 1);

        }
        numberInput.value = autocompletedNumberArr.join('');
    }
}


class FormValidator {
    constructor(object, formElement) {
        this._formSelector = object.formSelector;
        this._inputSelector = object.inputSelector;
        this._submitButtonSelector = object.submitButtonSelector;
        this._inactiveButtonClass = object.inactiveButtonClass;
        this._inputErrorClass = object.inputErrorClass;
        this._errorClass = object.errorClass;
        this._formElement = formElement;
        this._okClass = object.okClass;
    }

    _enableJsValidation() {
        this._formElement.querySelector(this._formSelector).setAttribute('novalidate', true);
    }

    _showInputError(formInput) {
        const errorElement = this._formElement.querySelector(`#${formInput.id}-error`);
        formInput.classList.add(this._inputErrorClass);
        errorElement.textContent = "!";
        errorElement.classList.add(this._errorClass);
    }


    _hideInputError(formInput) {
        const errorElement = this._formElement.querySelector(`#${formInput.id}-error`);
        formInput.classList.remove(this._inputErrorClass);
        errorElement.textContent = "";
        errorElement.classList.remove(this._errorClass);
    }

    _showInputOk(formInput) {
        const errorElement = this._formElement.querySelector(`#${formInput.id}-error`);
        errorElement.textContent = "✓";
        errorElement.classList.add(this._okClass);
    }

    _hideInputOk(formInput) {
        const errorElement = this._formElement.querySelector(`#${formInput.id}-error`);
        errorElement.textContent = "!";
        errorElement.classList.remove(this._okClass);
    }

    _checkInputValidity(formInput) {
        if (!formInput.validity.valid) {
            this._hideInputOk(formInput)
            this._showInputError(formInput);
        } else {
            this._hideInputError(formInput);
            this._showInputOk(formInput);
        }
    }


    _hasInvalidInput() {
        return this._inputList.some(formInput => !formInput.validity.valid);
    }


    _toggleButtonState() {
        if (this._hasInvalidInput()) {
            this._button.classList.add(this._inactiveButtonClass);
            this._button.setAttribute('disabled', true);
        } else {
            this._button.classList.remove(this._inactiveButtonClass);
            this._button.removeAttribute('disabled');
        }
    }


    _setEventListeners() {
        this._inputList = Array.from(this._formElement.querySelectorAll(this._inputSelector));
        this._button = this._formElement.querySelector(this._submitButtonSelector);
        this._toggleButtonState();
        this._inputList.forEach(formInput => {
            formInput.addEventListener('input', () => {
                this._checkInputValidity(formInput);
                this._toggleButtonState();
            });
        });
    }


    clearErrors() {
        this._inputList.forEach(formInput => {
            if (formInput.classList.contains(this._inputErrorClass)) {
                this._hideInputError(formInput);
            }
        });
        this._toggleButtonState(this._inputList, this._button);
    }


    enableValidation() {
        this._enableJsValidation();
        this._setEventListeners();
    }
}

const formValidator = new FormValidator(validationRules, formContainer);
formValidator.enableValidation();
