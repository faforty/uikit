import Validator from 'validatorjs';

export default {
    props: {
        hideValidationErrors: {
            type: Boolean,
            default: false
        },
        validationRules: [String, Array],
        validationMessages: Object
    },

    data() {
        return {
            validationError: '',
            valid: true,
        };
    },

    events: {
        'ui-input::set-validity': function(valid, error, id) {
            // Abort if event isn't meant for this component
            if (!this.eventTargetsComponent(id)) {
                return;
            }

            this.setValidity(valid, error);
        }
    },

    methods: {
        validate() {
            if (!this.validationRules) {
                return;
            }

            var data = {
                value: this.value
            };

            var rules = {
                value: this.validationRules
            };
            var validation = new Validator(data, rules, this.validationMessages);
            validation.setAttributeNames({ value: '' });

            this.setValidity(validation.passes(), validation.errors.first('value'));
        },

        setValidity(valid, error) {
            this.valid = valid;
            this.validationError = '';

            if (!valid && error && error.length) {
                this.validationError = error;
            }
        }
    },
};