const Countdown = function (opt) {
  this.ele = null
  this.totalTime = null
  this.timingFn = function () { }
  this.endFn = function () { }
  this.current = {
    curDay: 0,
    curHour: 0,
    curMinute: 0,
    curSecond: 0
  }
  this.init(opt)
  this.countDowner()
}
Countdown.prototype = {
  init: function (opt) {
    this.ele = opt.ele
    this.totalTime = opt.totalTime
    this.timingFn = opt.timingFn
    this.endFn = opt.endFn
  },
  countDowner: function () {
    var self = this
    if (this.totalTime > 0) {
      var seconds = this.totalTime / 1e3
      var minutes = Math.floor(seconds / 60)
      var hours = Math.floor(minutes / 60)
      var days = Math.floor(hours / 24)
      this.current.curDay = this.getCurDay(days)
      this.current.curHour = this.getCurHour(hours)
      this.current.curMinute = this.getCurMinute(minutes)
      this.current.curSecond = this.getCurSecond(seconds)

      this.timingFn && this.timingFn(this.current)

      this.countDownTimer = setTimeout(function () {
        self.totalTime -= 1e3
        self.countDowner()
      }, 1e3)
    } else {
      this.countDownTimer && clearTimeout(this.countDownTimer)
      this.endFn && this.endFn()
    }
  },
  getCurDay: function (days) {
    return days < 10 ? '0' + days : days
  },
  getCurHour: function (hours) {
    return hours % 24 < 10 ? '0' + hours % 24 : hours % 24
  },
  getCurMinute: function (minutes) {
    return minutes % 60 < 10 ? '0' + minutes % 60 : minutes % 60
  },
  getCurSecond: function (seconds) {
    return Math.floor(seconds % 60) < 10 ? '0' + Math.floor(seconds % 60) : Math.floor(seconds % 60)
  }
}
export default Countdown
