<template>
    <div class="ui-calendar-wrapper">
        <span @click.stop="toggle">
            <slot></slot>
        </span>

        <transition name="fade" mode="out-in">
        <div v-if="visible" class="ui-calendar" @click.stop>

            <span class="ui-calendar-close ui-action ui-action--close ui-action--close--circle uikit-close-empty" @click="hide"></span>

            <div class="ui-calendar-year-picker">
                <div>
                    <span v-for="year in years" :class="year.class" @click.stop="setYear(year.year)">
                        {{ year.year }}
                    </span>
                </div>
            </div>

            <div class="ui-calendar-month-picker">
                <ui-button class="ui-calendar-prev ui-btn--circle ui-btn--xs" @click.stop="offsetMonth(-1)">
                    <i class="uikit-arrow-back"></i>
                </ui-button>
                {{currentMonthName}}
                <ui-button class="ui-calendar-next ui-btn--circle ui-btn--xs" @click.stop="offsetMonth(1)">
                    <i class="uikit-arrow-forward"></i>
                </ui-button>
            </div>

            <table>
                <tr>
                    <th v-for="weekday in weekdays">{{weekday}}</th>
                </tr>
                <tr v-for="week in calendar">
                    <td v-for="day in week" :class="day.class" @click.stop="select(day)">
                        <div>
                            <span>{{day.date}}</span>
                        </div>
                    </td>
                </tr>
            </table>
            <slot name="footer"></slot>
        </div>
        </transition>
    </div>
</template>

<script>
import moment from 'moment';

import uiButton from './ui-button.vue';

// FIXME
moment.locale('ru');

const normalizeDate = (date, format = '') => {
    var date = format ? moment(date, format, true) : moment(date);
    date = date.startOf('day').unix();
    return date || !isNaN(date) ? date : moment().unix();
}

export default {
    name: 'ui-calendar',
    components: {
        uiButton
    },
    props: {
        value: {},
        format: {
            type:    String,
            default: 'DD.MM.YYYY',
        },
        closeonselect: {
            type:    Boolean,
            default: true
        },
        disabledDate: {
            type:    Function,
            default: (date) => false
        },
        minDate: {},
        maxDate: {},
        multiple: {
            type:    Boolean,
            default: false
        }
    },
    data: () => ({
        visible:          false,
        weekdays:         moment.weekdaysShort(true),
        currentTimestamp: moment().unix(),
    }),

    watch: {
        value(value) {
            if (!this.multiple) {
                this.currentTimestamp = normalizeDate(this.value, this.format);
            }
        },
    },

    computed: {
        timestamp() {
            if (this.value) {
                return normalizeDate(this.value, this.format);
            }
        },

        minDateTimestamp() {
            if (this.minDate) {
                return normalizeDate(this.minDate, this.format) - 1;
            }
        },

        maxDateTimestamp() {
            if (this.maxDate) {
                return normalizeDate(this.maxDate, this.format) + 86400;
            }
        },

        current: {
            get() {
                return moment.unix(this.currentTimestamp);
            },
            set(date) {
                this.currentTimestamp = normalizeDate(date);
            }
        },
        years() {
            var years  = [];
            var offset = 2;
            for (var y = this.currentYear-offset; y<=this.currentYear+offset; y++) {
                years.push({
                    year:  y,
                    class: y == this.currentYear ? 'ui-calendar-current' : ''
                });
            }
            return years;
        },

        currentYear() {
            return this.current.year();
        },
        currentMonth() {
            return this.current.month();
        },
        currentMonthName() {
            return this.current.format('MMMM');
        },

        calendar() {
            var calendar = [];

            var date   = moment(this.current).startOf('month').startOf('week').startOf('day');
            var today  = normalizeDate(moment());
            var values = this.multiple ? (this.value ? [...this.value] : []) : [this.value];

            for (var i = values.length - 1; i >= 0; i--) {
                values[i] = normalizeDate(values[i], this.format);
            }

            for (var w = 0; w < 6; w++) {
                calendar[w] = [];
                for (var i = 0; i < 7; i++) {
                    var timestamp = date.unix();
                    var className = '';
                    var disabled  = this.isDisabledDate(date, timestamp);

                    if (date.month() != this.currentMonth) {
                        if (w > 0 && i === 0) break; // Dont draw next month week
                        className = 'ui-calendar-' + (w < 1 ? 'prev-month' : 'next-month');
                    }
                    if (values.indexOf(timestamp) > -1) {
                        className += ' ui-calendar-current';
                    }
                    if (timestamp == today) {
                        className += ' ui-calendar-today';
                    }
                    if (disabled) {
                        className += ' ui-calendar-disabled';
                    }
                    calendar[w].push({
                        timestamp,
                        disabled,
                        date:  date.date(),
                        class: className,
                    });
                    date.add(1, 'day');
                }
            }

            return calendar;
        }
    },

    methods: {
        toggle(state = null) {
            this.visible ? this.hide() : this.show();
        },

        show() {
            this.visible = true;
            this._lock = true;
            this.$root.$emit('ui-calendar:close');
        },

        hide() {
            if (this._lock) {
                this._lock = false;
                return;
            }
            this.visible = false;
        },

        select(day) {
            if (day.disabled) {
                return;
            }

            var value = moment.unix(day.timestamp);

            if (this.format) {
                value = value.format(this.format);
            }

            if (this.multiple) {
                value = this.makeMultipleValue(value);
            }

            this.$emit('input', value);

            if (this.closeonselect && !this.multiple) {
                this.hide();
            }
        },

        // resetCurrent() {
        //     this.current = (this.timestamp ? moment.unix(this.timestamp) : moment()).startOf('month');
        // },

        offsetMonth(offset) {
            this.current = this.current.add(offset, 'months');
        },

        setYear(year) {
            this.current = this.current.set({year});
        },

        isDisabledDate(date, timestamp) {
            return (this.minDateTimestamp && this.minDateTimestamp >= timestamp)
                || (this.maxDateTimestamp && this.maxDateTimestamp <= timestamp)
                || this.disabledDate(date);
        },

        makeMultipleValue(value) {
            var vModel = this.value ? [...this.value] : [];

            var index  = vModel.indexOf(value);
            if (index > -1) {
                vModel.splice(index, 1);
            } else {
                vModel.push(value);
            }

            return vModel; //.sort();
        }
    },

    mounted() {
        this.currentTimestamp = normalizeDate(this.value, this.format);
        this.$root.$on('ui-calendar:close', this.hide);
        document.body.addEventListener('click', this.hide);
    },

    beforeDestroy() {
        document.body.removeEventListener('click', this.hide);
    }
}
</script>