<template>
    <div class="ui-calendar-wrapper">
        <span @click.stop="toggle">
            <slot></slot>
        </span>

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
                <ui-button class="ui-calendar-next ui-btn--circle ui-btn--xs" @click.stop="offsetMonth(1)">
                    <i class="uikit-arrow-forward"></i>
                </ui-button>
                {{currentMonthName}}
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
        </div>

    </div>
</template>

<script>
import moment from 'moment';

moment.locale('ru');

const normalizeDate = (date, format = '') => {
    var date = moment(date, format).startOf('day').unix();
    return date || !isNaN(date) ? date : moment().unix();
}

export default {
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
    },
    data: () => ({
        visible:          false,
        weekdays:         moment.weekdaysShort(),
        currentTimestamp: moment().unix(),
    }),

    watch: {
        value(value) {
            this.currentTimestamp = normalizeDate(this.value, this.format);
        },
    },

    computed: {
        timestamp() {
            if (this.value) {
                return normalizeDate(this.value, this.format);
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

            var date  = moment(this.current).startOf('month').startOf('week').startOf('day') ;
            var today = normalizeDate(moment());
            var value = normalizeDate(this.value, this.format);

            for (var w = 0; w < 6; w++) {
                calendar[w] = [];
                for (var i = 0; i < 7; i++) {
                    var timestamp = date.format('X');
                    var className = '';
                    if (date.month() != this.currentMonth) {
                        if (w > 0 && i === 0) break; // Dont draw next month week
                        className = 'ui-calendar-' + (w < 1 ? 'prev-month' : 'next-month');
                    }
                    if (timestamp == value) {
                        className += ' ui-calendar-current';
                    }
                    if (timestamp == today) {
                        className += ' ui-calendar-today';
                    }
                    calendar[w].push({
                        timestamp,
                        date:  date.date(),
                        class: className
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
            var value = moment.unix(day.timestamp).format(this.format);
            this.$emit('input', value);
            if (this.closeonselect) {
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