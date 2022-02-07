export const dateFormat = (date) => {
  if (date == null) return null
  date = new Date(date)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) month = '0' + month
  let day = date.getDate()
  if (day < 10) day = '0' + day
  let hour = date.getHours()
  if (hour < 10) hour = '0' + hour
  let minutes = date.getMinutes()
  if (minutes < 10) minutes = '0' + minutes
  let seconds = date.getSeconds()
  if (seconds < 10) seconds = '0' + seconds
  let newDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
  return newDate
}
