import request from '@/utils/request'

export function get (url, parameter) {
  return request({
    url: url,
    method: 'get',
    data: parameter
  })
}

export function post (url, parameter) {
  return request({
    url: url,
    method: 'post',
    data: parameter
  })
}
