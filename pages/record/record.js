import {
  request
} from "../../request"
import apis from '../../apis'
import moment from 'moment'
Page({
  data: {
    date: '',
    list: [],
    editBoxVisible: false,
    data: {},
    currentId: ''
  },
  /**
   * 跳转详情页
   */
  toDetailPage(e) {
    const {
      id
    } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  /**
   * 获取详情
   */
  async getDetail(e) {
    const {
      id
    } = e.currentTarget.dataset
    if (!id) return
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
    this.setData({
      data,
      currentId: id,
      editBoxVisible: true
    })
  },
  /**
   * 编辑文字
   */
  changeContent(e) {
    const {
      data
    } = this.data
    const {
      value
    } = e.detail
    data.content = value
    this.setData({
      data
    })
  },
  /**
   * 提交编辑
   */
  async editDetail() {
    const {
      data,
      currentId
    } = this.data
    const {
      content
    } = data || {}
    await request({
      path: apis.systemeditnote,
      method: "post",
      loaddingVisible: true,
      data: {
        id: currentId,
        content
      }
    })
    this.setData({
      editBoxVisible: false
    })
    this.getList()
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
   * 生命周期函数--监听页面加载
   */
  onLoad(param) {
    const {
      date
    } = param
    this.setData({
      date
    }, this.getList)
  },
  /**
   * 获取列表
   */
  async getList() {
    const {
      date
    } = this.data
    if (!date) return
    const {
      data
    } = await await request({
      path: apis.systemgetnotesbydate,
      method: "get",
      loaddingVisible: true,
      data: {
        date
      }
    })
    const {
      rows
    } = data || {}
    rows.map(v => {
      v.createdTime = moment(v.created_at).format('YYYY年MM月DD日')
    })
    this.setData({
      list: rows
    })
  }
})