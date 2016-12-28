<template>
    <ui-popup position-center="true" position-fixed="true" box-width="300px" :box-center="false">
        <div class="ui-datepicker" style="width: inherit">
            <div ref="years" id="yearList" class="ui-datepicker__year" style="overflow: scroll; display: flex;    flex-direction: row;">
                <div class="date-item" v-for="yearItem in library.year" track-by="$index">
                  <b v-show="checked.currentMoment.year == yearItem">{{yearItem}}</b>
                    {{yearItem}}
                </div>
            </div>
            </div>
            <div class="ui-datepicker__month">
        </div>
    </ui-popup>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    required: false,
    show: {
      type: Boolean
    },
    date: {
      type: Object,
      //required: true,
    },
    option: {
      type: Object,
      default () {
        return {
          type: 'day',
          SundayFirst: false,
          week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
          month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          format: 'YYYY-MM-DD',
          color: {
            checked: '#F50057',
            header: '#3f51b5',
            headerText: '#fff'
          },
          inputStyle: {
            'display': 'inline-block',
            'padding': '6px',
            'line-height': '22px',
            'font-size': '16px',
            'border': '2px solid #fff',
            'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
            'border-radius': '2px',
            'color': '#5F5F5F'
          },
          placeholder: 'when?',
          buttons: {
            ok: 'OK',
            cancel: 'Cancel'
          },
          overlayOpacity: 0.5,
          dismissible: true
        }
      }
    },
    limit: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    function hours () {
      let list = []
      let hour = 24
      while (hour > 0) {
        hour--
        list.push({
          checked: false,
          value: hour < 10 ? '0' + hour : hour
        })
      }
      return list
    }
    function mins () {
      let list = []
      let min = 60
      while (min > 0) {
        min--
        list.push({
          checked: false,
          value: min < 10 ? '0' + min : min
        })
      }
      return list
    }
    return {
      hours: hours(),
      mins: mins(),
      showInfo: {
        hour: false,
        day: false,
        month: false,
        year: false,
        check: false
      },
      displayInfo: {
        month: ''
      },
      library: {
        week: this.option.week,
        month: this.option.month,
        year: []
      },
      checked: {
        oldtime: '',
        currentMoment: null,
        year: '',
        month: '',
        day: '',
        hour: '00',
        min: '00'
      },
      dayList: [],
      selectedDays: []
    }
  },
  methods: {
    pad (n) {
      n = Math.floor(n)
      return n < 10 ? '0' + n : n
    },
    nextMonth (type) {
      let next = null
      type === 'next' ? next = moment(this.checked.currentMoment).add(1, 'M') : next = moment(this.checked.currentMoment).add(-1, 'M')
      this.showDay(next)
    },
    showDay (time) {
      if (time === undefined || !Date.parse(time)) {
        this.checked.currentMoment = moment()
      } else {
        this.checked.currentMoment = moment(time, this.option.format)
      }
      this.showOne('day')
      this.checked.year = moment(this.checked.currentMoment).format('YYYY')
      this.checked.month = moment(this.checked.currentMoment).format('MM')
      this.checked.day = moment(this.checked.currentMoment).format('DD')
      this.displayInfo.month = this.library.month[moment(this.checked.currentMoment).month()]
      let days = []
      let currentMoment = this.checked.currentMoment
      let firstDay = moment(currentMoment).date(1).day()
      // gettting previous and next month
      // let currentMonth = moment(currentMoment)
      let previousMonth = moment(currentMoment)
      let nextMonth = moment(currentMoment)
      nextMonth.add(1, 'months')
      previousMonth.subtract(1, 'months')
      let monthDays = moment(currentMoment).daysInMonth()
      let oldtime = this.checked.oldtime
      for (let i = 1; i <= monthDays; ++i) {
        days.push({
          value: i,
          inMonth: true,
          unavailable: false,
          checked: false,
          moment: moment(currentMoment).date(i)
        })
        if (i === Math.ceil(moment(currentMoment).format('D')) && moment(oldtime, this.option.format).year() === moment(currentMoment).year() && moment(oldtime, this.option.format).month() === moment(currentMoment).month()) {
          days[i - 1].checked = true
        }
        this.checkBySelectDays(i, days)
      }
      if (firstDay === 0) firstDay = 7
      for (let i = 0; i < firstDay - (this.option.SundayFirst ? 0 : 1); i++) {
        let passiveDay = {
          value: previousMonth.daysInMonth() - (i),
          inMonth: false,
          action: 'previous',
          unavailable: false,
          checked: false,
          moment: moment(currentMoment).date(1).subtract(i + 1, 'days')
        }
        days.unshift(passiveDay)
      }
      if (this.limit.length > 0) {
        for (let li of this.limit) {
          switch (li.type) {
            case 'fromto':
              days = this.limitFromTo(li, days)
              break
            case 'weekday':
              days = this.limitWeekDay(li, days)
              break
          }
        }
      }
      var passiveDaysAtFinal = 42 - days.length
      for (let i = 1; i <= passiveDaysAtFinal; i++) {
        let passiveDay = {
          value: i,
          inMonth: false,
          action: 'next',
          unavailable: false,
          checked: false,
          moment: moment(currentMoment).add(1, 'months').date(i)
        }
        days.push(passiveDay)
      }
      this.dayList = days
    },
    checkBySelectDays (d, days) {
      this.selectedDays.forEach(day => {
        if (this.checked.year === moment(day).format('YYYY') && this.checked.month === moment(day).format('MM') && d === Math.ceil(moment(day).format('D'))) {
          days[d - 1].checked = true
        }
      })
    },
    limitWeekDay (limit, days) {
      days.map((day) => {
        if (limit.available.indexOf(Math.floor(day.moment.format('d'))) === -1) {
          day.unavailable = true
        }
      })
      return days
    },
    limitFromTo (limit, days) {
      if (limit.from || limit.to) {
        days.map((day) => {
          if (this.getLimitCondition(limit, day)) {
            day.unavailable = true
          }
        })
      }
      return days
    },
    getLimitCondition (limit, day) {
      let tmpMoment = moment(this.checked.year + '-' + this.pad(this.checked.month) + '-' + this.pad(day.value))
      if (limit.from && !limit.to) {
        return !tmpMoment.isAfter(limit.from)
      } else if (!limit.from && limit.to) {
        return !tmpMoment.isBefore(limit.to)
      } else {
        return !tmpMoment.isBetween(limit.from, limit.to)
      }
    },
    checkDay (obj) {
      if (obj.unavailable || obj.value === '') {
        return false
      }
      if (!(obj.inMonth)) {
        this.nextMonth(obj.action)
      }
      if (this.option.type === 'day' || this.option.type === 'min') {
        this.dayList.forEach((x) => {
          x.checked = false
        })
        this.checked.day = this.pad(obj.value)
        obj.checked = true
      } else {
        let day = this.pad(obj.value)
        let ctime = this.checked.year + '-' + this.checked.month + '-' + day
        if (obj.checked === true) {
          obj.checked = false
          this.selectedDays.$remove(ctime)
        } else {
          this.selectedDays.push(ctime)
          obj.checked = true
        }
      }
      switch (this.option.type) {
        case 'day':
          this.picked()
          break
        case 'min':
          this.showOne('hour')
            // shift activated time items to visible position.
          this.shiftActTime()
          break
      }
    },
    showYear () {
      let year = moment(this.checked.currentMoment).year()
      this.library.year = []
      let yearTmp = []
      for (let i = year - 100; i < year + 5; ++i) {
        yearTmp.push(i)
      }

      this.library.year = yearTmp
     // this.showOne('year')
      //this.$nextTick(() => {
        let listDom = document.getElementById('yearList')
        // console.log(listDom.scrollWidth)
        listDom.scrollLeft = (listDom.scrollWidth - 100)
       // this.addYear()
      //})
    },
    showOne (type) {
      switch (type) {
        case 'year':
          this.showInfo.hour = false
          this.showInfo.day = false
          this.showInfo.year = true
          this.showInfo.month = false
          break
        case 'month':
          this.showInfo.hour = false
          this.showInfo.day = false
          this.showInfo.year = false
          this.showInfo.month = true
          break
        case 'day':
          this.showInfo.hour = false
          this.showInfo.day = true
          this.showInfo.year = false
          this.showInfo.month = false
          break
        case 'hour':
          this.showInfo.hour = true
          this.showInfo.day = false
          this.showInfo.year = false
          this.showInfo.month = false
          break
        default:
          this.showInfo.day = true
          this.showInfo.year = false
          this.showInfo.month = false
          this.showInfo.hour = false
      }
    },
    showMonth () {
      this.showOne('month')
    },
    addYear () {
      let listDom = document.getElementById('yearList')
      listDom.addEventListener('scroll', (e) => {
        if (listDom.scrollTop < listDom.scrollHeight - 100) {
          let len = this.library.year.length
          let lastYear = this.library.year[len - 1]
          this.library.year.push(lastYear + 1)
        }
      }, false)
    },
    setYear (year) {
      this.checked.currentMoment = moment(year + '-' + this.checked.month + '-' + this.checked.day)
      this.showDay(this.checked.currentMoment)
    },
    setMonth (month) {
      let mo = (this.library.month.indexOf(month) + 1)
      if (mo < 10) {
        mo = '0' + '' + mo
      }
      this.checked.currentMoment = moment(this.checked.year + '-' + mo + '-' + this.checked.day)
      this.showDay(this.checked.currentMoment)
    },
    showCheck () {
      if (this.date.time === '') {
        this.showDay()
      } else {
        if (this.option.type === 'day' || this.option.type === 'min') {
          this.checked.oldtime = this.date.time
          this.showDay(this.date.time)
        } else {
          this.selectedDays = JSON.parse(this.date.time)
          if (this.selectedDays.length) {
            this.checked.oldtime = this.selectedDays[0]
            this.showDay(this.selectedDays[0])
          } else {
            this.showDay()
          }
        }
      }
      this.showInfo.check = true
    },
    setTime (type, obj, list) {
      for (let item of list) {
        item.checked = false
        if (item.value === obj.value) {
          item.checked = true
          this.checked[type] = item.value
        }
      }
    },
    picked () {
      if (this.option.type === 'day' || this.option.type === 'min') {
        let ctime = this.checked.year + '-' + this.checked.month + '-' + this.checked.day + ' ' + this.checked.hour + ':' + this.checked.min
        this.checked.currentMoment = moment(ctime, 'YYYY-MM-DD HH:mm')
        this.date.time = moment(this.checked.currentMoment).format(this.option.format)
      } else {
        this.date.time = JSON.stringify(this.selectedDays)
      }
      this.showInfo.check = false
      this.$emit('change', this.date.time)
    },
    dismiss (evt) {
      if (evt.target.className === 'datepicker-overlay') {
        if (this.option.dismissible === undefined || this.option.dismissible) {
          this.showInfo.check = false
          this.$emit('cancel')
        }
      }
    },
    shiftActTime () {
      // shift activated time items to visible position.
      this.$nextTick(() => {
        if (!document.querySelector('.hour-item.active')) {
          return false
        }
        document.querySelector('.hour-box').scrollTop = (document.querySelector('.hour-item.active').offsetTop || 0) - 250
        document.querySelector('.min-box').scrollTop = (document.querySelector('.min-item.active').offsetTop || 0) - 250
      })
    },
    updated () {
      // this.showCheck()

      // console.log( 3243);
    }
  },
  mounted () {
     this.showCheck()
     this.showYear()
  }
}
</script>
