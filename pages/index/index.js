import {
  request,
  uploadFile
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
    checkDateBoxVisible: false,
    menuBottom: 0,
    knockingNum: 0,
    canIEditMyInfo: false,
    helperBoxVisible: false,
    userInfo: {
      avatar: 'default_avatar.png',
      nick: '获取中...',
      binded: true,
    },
    avatarUrl: ''
  },
  /**
   * 关闭使用帮助提示弹窗
   */
  closeHelperBox() {
    this.setData({
      helperBoxVisible: false
    })
  },
  /**
   * 唤醒使用帮助提示弹窗
   */
  activeHelperBox() {
    this.setData({
      helperBoxVisible: true
    })
  },
  /**
   * 敲木鱼
   */
  knocking() {
    let {
      knockingNum
    } = this.data
      ++knockingNum
    const innerAudioContext = wx.createInnerAudioContext({
      useWebAudioImplement: true
    })
    innerAudioContext.src = 'https://oss.yinxit.com/knocking.mp3'
    innerAudioContext.play()
    this.setData({
      knockingNum
    })
  },
  /**
   * 唤醒日历弹窗
   */
  wakeUpCheckDateBox() {
    this.setData({
      checkDateBoxVisible: true
    })
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
    this.getUserInfo()
  },
  /**
   * 绑定关系
   */
  async bindLover() {
    const {
      data: activityId
    } = await request({
      path: apis.systemcreateactivityid,
      method: "post",
      loaddingVisible: true
    })
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
    wx.updateShareMenu({
      withShareTicket: true,
      isPrivateMessage: true,
      activityId,
    })
  },
  /**
   * 获取用户信息
   */
  async getUserInfo() {
    const {
      data: userInfo
    } = await request({
      path: apis.usergetuserinfo,
      method: "get",
      loaddingVisible: true
    })
    const {binded,email} = userInfo || {}
    if (binded && !email) {
      wx.showModal({
        mask: true,
        title: '提示',
        content: '绑定邮箱，及时接收Ta的通知！',
        confirmText: '去绑定',
        complete: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/setting/setting',
            })
          }
        }
      })
    }
    userInfo.avatarFullUrl = BASEURL + userInfo.avatar
    this.setData({
      userInfo
    })
  },
  /**
   * 获取用户头像
   */
  async onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    const {
      userInfo
    } = this.data
    const format = avatarUrl.split('.')[1]
    const {
      data
    } = await uploadFile({
      filePath: avatarUrl,
      name: 'file',
      loaddingVisible: true,
      formData: {
        format
      },
      path: apis.systemuploadfile
    })
    userInfo.avatar = data
    userInfo.avatarFullUrl = BASEURL + data
    this.setData({
      userInfo
    })
  },
  /**
   * 填写用户昵称
   */
  changeUserNick(e) {
    const {
      value
    } = e.detail
    const {
      userInfo
    } = this.data
    userInfo.nick = value
    this.setData({
      userInfo
    })
  },
  /**
   * 切换编辑用户信息按钮
   */
  toggleEditBtn() {
    const {
      canIEditMyInfo
    } = this.data
    if (!canIEditMyInfo) {
      this.setData({
        canIEditMyInfo: true
      })
    }
    if (canIEditMyInfo) {
      this.editUserInfo()
    }
  },
  /**
   * 修改用户信息
   */
  async editUserInfo() {
    const {
      userInfo
    } = this.data
    await request({
      path: apis.userupdateuserinfo,
      method: "post",
      loaddingVisible: true,
      data: userInfo
    })
    this.setData({
      canIEditMyInfo: false
    })
  },
  /**
   * 跳转页面
   */
  navigate(e) {
    const {
      url
    } = e.currentTarget.dataset
    wx.navigateTo({
      url,
    })
  },
  /**
   * 获取胶囊高度
   */
  getMenuButtonHeight() {
    const {
      bottom: menuBottom
    } = wx.getMenuButtonBoundingClientRect()
    this.setData({
      menuBottom
    })
  },
  /**
   * 去列表页
   */
  toListPage(e) {
    const {
      selectDays
    } = e.detail
    const date = selectDays[0]
    if (!date) return
    this.setData({
      checkDateBoxVisible: false
    })
    wx.navigateTo({
      url: `/pages/record/record?date=${date}`,
    })
  },
  /**
   * 关闭日历弹窗
   */
  closeCheckDateBox() {
    this.setData({
      checkDateBoxVisible: false
    })
  },
  onShow() {
    this.getMenuButtonHeight()
    this.login()
  },
  onShareAppMessage() {
    const {
      userInfo
    } = this.data
    const {
      openid,
      nick
    } = userInfo || {}
    return {
      title: `♥ ${nick}邀请你和TA绑定情侣关系`,
      path: `/pages/confirm_bind/confirm_bind?initiate_openid=${openid}`,
      imageUrl: "../../assets/share.png"
    }
  },
})