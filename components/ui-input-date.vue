<template>
    <ui-input
        :value="inputValue"
        :size="size"
        :max-size="maxSize"
        :autofocus="autofocus"
        :color="color"
        :disabled="disabled"
        :hint="hint"
        :icon-align="iconAlign"
        :icon="icon"
        :loading="loading"
        :info="info"
        :placeholder="placeholder"
        :state="state"
        :label="label"
        :label-align="labelAlign"

        @input="updateInputValue"
        @blur="inputBlur"
        @keydown.tab="$refs.calendar.hide()"
        @focus="$refs.calendar.show()"
        @click.native.stop
    >
        <slot></slot>

        <ui-calendar
            slot="dropdown"
            ref="calendar"
            :format="format"
            :max-date="maxDate"
            :min-date="minDate"
            :disabled-date="disabledDate"
            :value="value"
            @input="updateValue"
        ></ui-calendar>
    </ui-input>
</template>

<script>
import moment from 'moment';
import uiInput from './ui-input.vue';
import uiCalendar from './ui-calendar.vue';

export default {
    components: {
        uiInput,
        uiCalendar
    },

    props: {
        inputFormat: {type: String, default: 'DD.MM.YYYY'},

        // ui-input props
        autofocus:   {type: Boolean, default: false},
        color:       String,
        disabled:    Boolean,
        value:       {},
        placeholder: String,
        loading:     [Boolean, Object],
        icon:        {type: String, default: 'uikit-calendar'},
        iconAlign:   String,
        hint:        String,
        info:        String,
        state:       String,
        size:        {},
        maxSize:     {},
        label:       {type: Boolean, default: true},
        labelAlign:  String,

        // ui-calendar props
        minDate:      {},
        maxDate:      {},
        disabledDate: {},
        format:       {type: String, default: ''},
    },

    data: () => ({
        resetOnBlur: false,
    }),

    methods: {
        updateValue(value) {
            this.$emit('input', value);
        },
        updateInputValue(value) {
            if (value) {
                value = moment(value, this.inputFormat, true);
                if (!value.isValid()) {
                    return;
                }
                if (this.format) {
                    value = value.format(this.format);
                }
            }
            this.updateValue(value);
        },
        inputBlur() {
            // В inputValue попадет текущая выбранная дата (value).
            // Если была введена некорректная дата
            this.$forceUpdate();
        }
    },

    computed: {
        inputValue() {
            return this.value ? moment(this.value, this.format).format(this.inputFormat) : '';
        }
    }
}
</script>