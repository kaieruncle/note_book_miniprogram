import {
  request
} from "../../request"
import apis from '../../apis'
Page({
  confirmCountdown: null,
  /**
   * 页面的初始数据
   */
  data: {
    email: '',
    editBoxVisible: false,
    confirmBoxVisible: false,
    binded: false,
    confirmText: '确定(10s)',
    canIConfirm: false
  },
  onShow() {
    this.checkBinded()
  },
  /**
   * 关闭弹窗
   */
  closeEditBox() {
    this.setData({
      editBoxVisible: false
    })
  },
  /**
   * 获取用户信息
   */
  async checkBinded() {
    const {
      data: userInfo
    } = await request({
      path: apis.usergetuserinfo,
      method: "get",
      loaddingVisible: false
    })
    const {
      binded
    } = userInfo || {}
    this.setData({
      binded
    })
  },
  /**
   * 唤醒编辑邮箱弹窗
   */
  async activeEditBox() {
    const {
      data: userInfo
    } = await request({
      path: apis.usergetuserinfo,
      method: "get",
      loaddingVisible: true
    })
    const {
      email
    } = userInfo || {}
    this.setData({
      email,
      editBoxVisible: true
    })
  },
  /**
   * 联系客服
   */
  contactUs(){
    wx.setClipboardData({
        data: 'kaieruncle',
        success: res => {
            wx.hideLoading()
            wx.showToast({
                mask: true,
                icon: 'none',
                title: '客服微信已复制',
            })
        }
    })
  },
  /**
   * 唤醒解绑关系确认弹窗
   */
  async activeConfirmBox() {
    let confirmCountdownTime = 10
    this.confirmCountdown = setInterval(() => {
      if (confirmCountdownTime === 0) {
        clearInterval(this.confirmCountdown)
        this.setData({
          confirmText: '确定',
          canIConfirm: true
        })
        return
      }
      --confirmCountdownTime
      this.setData({
        confirmText: `确定(${confirmCountdownTime}s)`
      })
    }, 1000)
    this.setData({
      confirmBoxVisible: true
    })
  },
  /**
   * 关闭解绑关系确认弹窗
   */
  closeConfirmBox() {
    clearInterval(this.confirmCountdown)
    this.setData({
      confirmText: '确定(10s)',
      canIConfirm: false,
      confirmBoxVisible: false
    })
  },
  onUnload() {
    this.closeConfirmBox()
  },
  /**
   * 发送解绑关系请求
   */
  async unBind() {
    const {
      canIConfirm
    } = this.data
    if (!canIConfirm) return
    await request({
      path: apis.loversunbindlovers,
      method: "post",
      loaddingVisible: true
    })
    this.setData({
      confirmText: '确定(10s)',
      canIConfirm: false,
      confirmBoxVisible: false
    },this.checkBinded)
  },
  /**
   * 取消事件冒泡
   */
  cancelBool() {},
  /**
   * 绑定邮箱
   */
  async bindEmail() {
    const {
      email
    } = this.data
    await request({
      path: apis.userupdateuseremail,
      method: "post",
      loaddingVisible: true,
      data: {
        email
      }
    })
    this.setData({
      email: '',
      editBoxVisible: false
    })
  }
})