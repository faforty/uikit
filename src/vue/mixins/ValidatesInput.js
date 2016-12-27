import Validator from 'validatorjs';

export default {
    props: {
        // valid: {
        //     type: Boolean,
        //     default: true
        // },
        // dirty: {
        //     type: Boolean,
        //     default: false
        // },
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
            if (!this.validationRules/* || !this.dirty*/) {
                return;
            }

            let data = {
                value: this.mValue
            };

            let rules = {
                value: this.validationRules
            };
            let validation = new Validator(data, rules, this.validationMessages);
            validation.setAttributeNames({ value: '' });

            this.setValidity(validation.passes(), validation.errors.first('value'));
        },

        setValidity(valid, error) {
            this.valid = valid;
            this.validationError = '';
            console.log( valid, error );
            if (!valid && error && error.length) {
                this.validationError = error;
            }
        }
    }
};