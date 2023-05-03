const app = getApp()
const {
  globalData
} = app
const {
  BASEURL
} = globalData || {}
export const request = (param) => {
  return new Promise(async (resolve, reject) => {
    const {
      loaddingVisible,
      path
    } = param || {}
    if (loaddingVisible) {
      wx.showLoading({
        mask: true,
        title: '加载中...',
      })
    }
    wx.request({
      url: BASEURL + path,
      timeout: 1000000,
      header: {
        // 请求头添加cookie字段
        'cookie': wx.getStorageSync('cookies')
      },
      ...param,
      complete: async res => {
        const {
          statusCode,
          cookies,
          data
        } = res || {}
        const {
          errorCode,
          msg
        } = data
        if (statusCode === 200) {
          if (path === 'user/login') {
            wx.setStorageSync('cookies', cookies.toString())
          }
          if (errorCode) {
            wx.showToast({
              mask: true,
              icon: 'none',
              title: msg,
            })
            // 异常处理
            if (errorCode === '000001') {
              wx.navigateTo({
                url: '/pages/index/index',
              })
            }
            return
          }
          resolve(data)
        } else {
          reject()
        }
        if (loaddingVisible) {
          wx.hideLoading()
        }
      }
    })
  })
}
export const uploadFile = (param) => {
  return new Promise(async (resolve, reject) => {
    const {
      loaddingVisible,
      path
    } = param || {}
    if (loaddingVisible) {
      wx.showLoading({
        mask: true,
        title: '加载中...',
      })
    }
    wx.uploadFile({
      url: BASEURL + path,
      timeout: 1000000,
      header: {
        // 请求头添加cookie字段
        'cookie': wx.getStorageSync('cookies')
      },
      ...param,
      complete: async res => {
        const {
          statusCode,
          data
        } = res || {}
        // const {
        //   errorCode
        // } = data
        if (statusCode === 200) {
          // 异常处理
          resolve(JSON.parse(data))
        } else {
          reject()
        }
        if (loaddingVisible) {
          wx.hideLoading()
        }
      }
    })
  })
}