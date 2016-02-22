/*
 * Bootstrap Validate Scriptlet that supports Twitter Bootstrap styling to
 * jQuery validate and unobstrusive jQuery validate
 * Author: David Nguyen (diepnn@gmail.com)
 * Author: Debbie-Ann Facey (debbie.facey@gmail.com)
 */

(function ($) {

    "use strict";

    var elements = {
        fieldValidationSpanAll: 'span.field-validation-valid, span.field-validation-error',
        fieldValidationSpanError: 'span.field-validation-error',
        inputValidationError: '.input-validation-error',
        controlGroupDiv: 'div.form-group',
        form: 'form',
        formInput: 'form input, form select, form textarea'
    },
    classes = {
        inlineHelp: 'help-inline',
        error: 'has-error'
    },
    addInlineHelp = function () {
        /// <summary>Adds inline-help classes</summary>
        $(this).addClass(classes.inlineHelp);
    },
    addErrorClasses = function ($form) {
        /// <summary>Add bootstrap validation styles on a form</summary>
        $form.find(elements.controlGroupDiv).each(function () {
            if ($(this).find(elements.inputValidationError).length > 0) {
                $(this).addClass(classes.error);
            }
        });
    },
    removeErrorClasses = function ($form) {
        /// <summary>Remove bootstrap validation styles from a form</summary>
        $form.find(elements.controlGroupDiv).each(function () {
            if ($(this).find(elements.inputValidationError).length === 0) {
                $(this).removeClass(classes.error);
            }
        });
    },
    validateAndUpdateClasses = function ($form) {
        var isFormValid = $form.valid();
        /// <summary>Add or removes bootstrap validation styles on a form</summary>
        if (isFormValid) {
            removeErrorClasses($form);
        }
        else {
            addErrorClasses($form);
        }
        return isFormValid;
    },    
    onFormSubmit = function () {
        /// <summary>Handles form submit event</summary>
        return validateAndUpdateClasses($(this));
    },
    onFormInputChange = function () {
        /// <summary>Handles form input change event</summary>
        var $controlGroup = $(this).parents(elements.controlGroupDiv);

        // The delay leaves jquery validate some time to insert the validation error
        setTimeout(function () {
            if ($controlGroup.find(elements.inputValidationError).length === 0) {
                $controlGroup.removeClass(classes.error);
            } else {
                $controlGroup.addClass(classes.error);
            }
        }, 500);
    },    
    initBootstrapValidation = function () {
        /// <summary>Initialises BootstrapValidate module to add support for Twitter Bootstrap to jQuery validate</summary>
        $(elements.fieldValidationSpanAll).each(addInlineHelp);
        $(elements.form).off('submit', onFormSubmit).on('submit', onFormSubmit);
        $(elements.formInput).off('change', onFormInputChange).on('change', onFormInputChange);
        $(elements.formInput).off('keyup', onFormInputChange).on('keyup', onFormInputChange);
        $(elements.formInput).off('blur', onFormInputChange).on('blur', onFormInputChange);
        //Highlight error inputs that have been initialised (e.g. part of initial page load)
        $(elements.form).each(function (index, form) { addErrorClasses($(form)); });
    },
    init = function () {
        // Initialise on page load
        $(function () {
            initBootstrapValidation();
        });

        // Initialise after Ajax request
        $(document).ajaxStop(function () {
            initBootstrapValidation();
        });

        // Add global functions that adds bootstrap styles to form.
        // This is useful if validation should be triggered without a form submission
        // e.g. to validate steps in a form wizard before submission
        window.bootstrapValidate = {
            formValid: validateAndUpdateClasses
        };
    };
            
    return {
        init: init
    };
}(jQuery)).init();