import {
  request
} from '../../request'
import apis from '../../apis'
const app = getApp()
const {
  globalData
} = app
const {
  BASEURL
} = globalData || {}
Page({
  data: {
    initiate_openid: '',
    initUserInfo: {}
  },
  onLoad(param) {
    const {
      initiate_openid
    } = param
    this.setData({
      initiate_openid
    }, this.login)
  },
  /**
   * 登录
   */
  async login() {
    const {
      code: jsCode
    } = await wx.login()
    await request({
      path: apis.userlogin,
      method: "post",
      loaddingVisible: true,
      data: {
        jsCode
      }
    })
    this.getInitUserInfo()
  },
  /**
   * 获取邀请者头像昵称
   */
  async getInitUserInfo() {
    const {
      initiate_openid
    } = this.data
    const {
      data: initUserInfo
    } = await request({
      path: apis.usergetuserinfobyopenid,
      method: "get",
      loaddingVisible: true,
      data: {
        initiate_openid
      }
    })
    initUserInfo.avatarFullUrl = BASEURL + initUserInfo.avatar
    this.setData({
      initUserInfo
    })
  },
  /**
   * 回到首页
   */
  goHomePage(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  /**
   * 订阅消息
   */
  async subscribeMessage() {
    // const data = await wx.requestSubscribeMessage({
    //   tmplIds: ['07fkht90c8tYybVeWMWZrNfvPn32BkZfN5CNNnJPfTA']
    // })
    // const isAllow = data['07fkht90c8tYybVeWMWZrNfvPn32BkZfN5CNNnJPfTA'] === "accept"
    // if (!isAllow) {
    //   wx.showToast({
    //     mask: true,
    //     icon: 'none',
    //     title: '请同意订阅！'
    //   })
    //   return
    // }
    const {
      initiate_openid
    } = this.data
    if (!initiate_openid) return
    const {
      data: isSuccess
    } = await request({
      path: apis.loversbindlovers,
      method: "post",
      // loaddingVisible: true,
      data: {
        initiate_openid
      }
    })
    if (isSuccess) {
      wx.showToast({
        mask: true,
        icon: 'none',
        title: '绑定成功，1秒后跳转首页',
        duration: 1000
      })
      setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/index/index',
        })
      },1000)
    }
  }
})