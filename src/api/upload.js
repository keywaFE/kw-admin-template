import { config } from '@/config/'
import { post } from '@/utils/request'

const baseUrl = config.baseUrl
export function uploadImg(file, userId) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_id', userId)
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(JSON.parse(xhr.responseText))
        }
      }
    }
    xhr.open('POST', `${baseUrl}/upload/uploadImg`)
    xhr.send(formData)
  })
}

export function uploadFile(data, onUploadProgress = () => { }) {
  return post('/storage/upload', data, onUploadProgress)
}
