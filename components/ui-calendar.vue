<template>
    <div>
        <span @click.stop="toggleShow">
            <slot></slot>
        </span>

        <div v-if="active" class="ui-calendar" @click.stop>
            <div class="ui-calendar-month-picker">
                <ui-button class="ui-calendar-prev ui-btn--circle ui-btn--xs" :disabled="false" @click.stop="offsetMonth(-1)">
                    <i class="uikit-arrow-back"></i>
                </ui-button>
                <ui-button class="ui-calendar-next ui-btn--circle ui-btn--xs" :disabled="false" @click.stop="offsetMonth(1)">
                    <i class="uikit-arrow-forward"></i>
                </ui-button>

                <span class='ui-calendar-current-month' @click.stop="showToday">{{currentMonthName}}</span>
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

export default {
    props: {
        value: {},
        format: {
            type:    String,
            default: 'DD.MM.YYYY',
        }
    },
    data: () => ({
        active:           false,
        weekdays:         moment.weekdaysShort(),
        current:          null,
        calendar:         [],
        currentMonth:     null,
        currentMonthName: null,
        dayInMonths:      null,
        // currentYear:   null,
    }),

    watch: {
        value() {
            this.updateCalendar();
        },
    },

    methods: {
        toggleShow() {
            this.active ? this.hide() : this.show();
        },
        show() {
            this.active = true;
            this.resetCurrent();
            this.updateCalendar();
        },
        hide() {
            this.active = false;
        },

        getValue() {
            return moment(this.value, this.format);
        },

        select(day) {
            var date = moment.unix(day.timestamp);
            this.$emit('input', date.format(this.format));
        },

        resetCurrent(today = false) {
            if (!today && this.value) {
                this.current = this.getValue().startOf('month');
            } else {
                this.current = moment().startOf('month');
            }
        },

        showToday() {
            this.resetCurrent(true);
            this.updateCalendar();
        },

        offsetMonth(offset) {
            this.current.add(offset, 'months');
            this.updateCalendar();
        },

        updateCalendar() {
            if (!this.active) {
                return;
            }

            var current = this.current;
            this.currentMonth     = current.month();
            this.currentYear      = current.year();
            this.dayInMonths      = current.daysInMonth();
            this.currentMonthName = current.format('MMMM');

            this.generateDays();
        },

        generateDays() {
            var calendar = [];
            var date     = moment(this.current).startOf('month').startOf('week').startOf('day') ;
            var today    = moment().startOf('day');
            var current  = this.getValue().startOf('day');

            for (var w = 0; w < 6; w++) {
                calendar[w] = [];
                for (var i = 0; i < 7; i++) {
                    var className = '';
                    if (date.month() != this.currentMonth) {
                        if (w > 0 && i === 0) break; // Dont draw next month week
                        className = 'ui-calendar-' + (w < 1 ? 'prev-month' : 'next-month');
                    }
                    if (date.isSame(current)) {
                        className += ' ui-calendar-current';
                    }
                    if (date.isSame(today)) {
                        className += ' ui-calendar-today';
                    }

                    calendar[w].push({
                        date:      date.date(),
                        timestamp: date.format('X'),
                        class:     className,
                    });
                    date.add(1, 'day');
                }
            }

            this.calendar = calendar;
        }
    },

    computed: {},

    mounted() {
        document.body.addEventListener('click', this.hide);
    },

    beforeDestroy() {
        document.body.removeEventListener('click', this.hide);
    }
}
</script>