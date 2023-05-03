import {
  request
} from "../../request"
import apis from '../../apis'
import moment from 'moment'
const app = getApp()
const {
  globalData
} = app
const {
  BASEURL
} = globalData || {}
Page({
  data: {
    id: '',
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(param) {
    const {
      id
    } = param || {}
    this.setData({
      id
    }, this.getDetail)
  },
  /**
   * 获取详情
   */
  async getDetail() {
    const {
      id
    } = this.data
    const {
      data
    } = await request({
      path: apis.systemgetnotedetail,
      method: "get",
      loaddingVisible: true,
      data: {
        id
      }
    })
    data.date = moment(data.created_at).format('YYYY年MM月DD日')
    data.avatarFullUrl = BASEURL + data.avatar
    let filePaths = data.file_path ? data.file_path.split(',') : []
    let fileList = []
    filePaths.forEach(v => {
      const type = v.split('.')[1]
      fileList.push({
        fullUrl: BASEURL + v,
        type
      })
    })
    data.fileList = fileList
    console.log(data, 'datr')
    this.setData({
      data
    })
  },
  /**
   * 订阅消息
   */
  async subscribeMessage() {
    const data = await wx.requestSubscribeMessage({
      tmplIds: ['07fkht90c8tYybVeWMWZrNfvPn32BkZfN5CNNnJPfTA']
    })
    const isAllow = data['07fkht90c8tYybVeWMWZrNfvPn32BkZfN5CNNnJPfTA'] === "accept"
    if (isAllow) {
      wx.showToast({
        mask: true,
        icon: 'none',
        title: '订阅成功，每次接受均须重新授权',
      })
    }
  }

})