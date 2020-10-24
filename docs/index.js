"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var formContainer = document.querySelector('.form-container');
var validationRules = {
  formSelector: '.form',
  inputSelector: '.form__input',
  submitButtonSelector: '.form__submit-button',
  inactiveButtonClass: 'form__submit-button_disabled',
  inputErrorClass: 'form__input-error',
  errorClass: 'form__span-error_show',
  okClass: 'form__span-error_confirmed'
};
var numberInput = document.querySelector('#form-phone');
numberInput.removeAttribute('maxlength');
numberInput.addEventListener("input", function (e) {
  return autocompleteNumber(e);
});
numberInput.setAttribute('maxlength', '19');
numberInput.setAttribute('minlength', '19');

var autocompleteNumber = function autocompleteNumber(e) {
  e.preventDefault();
  var numRegExp = /[a-zа-яё0-9]/gi;
  var numberArr = [];
  var numberValue = numberInput.value;

  for (var i = 0; i < numberValue.length; i++) {
    numberArr.push(numberValue[i]);
  }

  if (numberValue) {
    var autocompletedNumberArr = numberArr.filter(function (num) {
      return num.match(numRegExp);
    });
    var numberCount = numberValue.match(numRegExp).length;

    switch (numberCount) {
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
};

var FormValidator = /*#__PURE__*/function () {
  function FormValidator(object, formElement) {
    _classCallCheck(this, FormValidator);

    this._formSelector = object.formSelector;
    this._inputSelector = object.inputSelector;
    this._submitButtonSelector = object.submitButtonSelector;
    this._inactiveButtonClass = object.inactiveButtonClass;
    this._inputErrorClass = object.inputErrorClass;
    this._errorClass = object.errorClass;
    this._formElement = formElement;
    this._okClass = object.okClass;
  }

  _createClass(FormValidator, [{
    key: "_enableJsValidation",
    value: function _enableJsValidation() {
      this._formElement.querySelector(this._formSelector).setAttribute('novalidate', true);
    }
  }, {
    key: "_showInputError",
    value: function _showInputError(formInput) {
      var errorElement = this._formElement.querySelector("#".concat(formInput.id, "-error"));

      formInput.classList.add(this._inputErrorClass);
      errorElement.textContent = "!";
      errorElement.classList.add(this._errorClass);
    }
  }, {
    key: "_hideInputError",
    value: function _hideInputError(formInput) {
      var errorElement = this._formElement.querySelector("#".concat(formInput.id, "-error"));

      formInput.classList.remove(this._inputErrorClass);
      errorElement.textContent = "";
      errorElement.classList.remove(this._errorClass);
    }
  }, {
    key: "_showInputOk",
    value: function _showInputOk(formInput) {
      var errorElement = this._formElement.querySelector("#".concat(formInput.id, "-error"));

      errorElement.textContent = "✓";
      errorElement.classList.add(this._okClass);
    }
  }, {
    key: "_hideInputOk",
    value: function _hideInputOk(formInput) {
      var errorElement = this._formElement.querySelector("#".concat(formInput.id, "-error"));

      errorElement.textContent = "!";
      errorElement.classList.remove(this._okClass);
    }
  }, {
    key: "_checkInputValidity",
    value: function _checkInputValidity(formInput) {
      if (!formInput.validity.valid) {
        this._hideInputOk(formInput);

        this._showInputError(formInput);
      } else {
        this._hideInputError(formInput);

        this._showInputOk(formInput);
      }
    }
  }, {
    key: "_hasInvalidInput",
    value: function _hasInvalidInput() {
      return this._inputList.some(function (formInput) {
        return !formInput.validity.valid;
      });
    }
  }, {
    key: "_toggleButtonState",
    value: function _toggleButtonState() {
      if (this._hasInvalidInput()) {
        this._button.classList.add(this._inactiveButtonClass);

        this._button.setAttribute('disabled', true);
      } else {
        this._button.classList.remove(this._inactiveButtonClass);

        this._button.removeAttribute('disabled');
      }
    }
  }, {
    key: "_setEventListeners",
    value: function _setEventListeners() {
      var _this = this;

      this._inputList = Array.from(this._formElement.querySelectorAll(this._inputSelector));
      this._button = this._formElement.querySelector(this._submitButtonSelector);

      this._toggleButtonState();

      this._inputList.forEach(function (formInput) {
        formInput.addEventListener('input', function () {
          _this._checkInputValidity(formInput);

          _this._toggleButtonState();
        });
      });
    }
  }, {
    key: "clearErrors",
    value: function clearErrors() {
      var _this2 = this;

      this._inputList.forEach(function (formInput) {
        if (formInput.classList.contains(_this2._inputErrorClass)) {
          _this2._hideInputError(formInput);
        }
      });

      this._toggleButtonState(this._inputList, this._button);
    }
  }, {
    key: "enableValidation",
    value: function enableValidation() {
      this._enableJsValidation();

      this._setEventListeners();
    }
  }]);

  return FormValidator;
}();

var formValidator = new FormValidator(validationRules, formContainer);
formValidator.enableValidation();