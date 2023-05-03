import moment from 'moment'
import apis from '../../apis'
import {
  request,
  uploadFile
} from '../../request'
const app = getApp()
const {
  globalData
} = app
const {
  BASEURL
} = globalData || {}
Page({
  data: {
    content: '',
    binded: false,
    needNotify: false,
    placeholder: `${moment().format('YYYY年MM月DD日')}，今天...我...呜呜呜呜...`,
    uploadBoxVisible: false,
    fileList: []
  },
  onReady() {
    this.getUserInfo()
  },
  /**
   * 从聊天记录选择图片
   */
  async chooseImgFromMessage() {
    const {
      tempFiles
    } = await wx.chooseMessageFile({
      count: 10,
      type: 'all'
    })
    const {
      fileList
    } = this.data
    for (let i = 0; i < tempFiles.length; i++) {
      const {
        path: filePath,
        type
      } = tempFiles[i] || {}
      if (type === 'image' || type === 'video') {
        const {
          data
        } = await uploadFile({
          filePath,
          name: 'file',
          loaddingVisible: true,
          path: apis.systemuploadfile
        })
        fileList.push({
          url: data,
          type,
          fullUrl: `${BASEURL}${data}`
        })
      }
      this.setData({
        fileList,
        uploadBoxVisible: false
      })
    }
  },
  /**
   * 从设备选择图片
   */
  async chooseImgFromDevice() {
    const {
      tempFiles
    } = await wx.chooseMedia({
      count: 10,
      mediaType: ['mix']
    })
    const {
      fileList
    } = this.data
    for (let i = 0; i < tempFiles.length; i++) {
      const {
        tempFilePath: filePath,
        fileType: type
      } = tempFiles[i] || {}
      if (type === 'image' || type === 'video') {
        const {
          data
        } = await uploadFile({
          filePath,
          name: 'file',
          loaddingVisible: true,
          path: apis.systemuploadfile
        })
        fileList.push({
          url: data,
          type,
          fullUrl: `${BASEURL}${data}`
        })
      }
      this.setData({
        fileList,
        uploadBoxVisible: false
      })
    }
  },
  /**
   * 关闭选取图片/视频弹窗
   */
  closeUploadBox() {
    this.setData({
      uploadBoxVisible: false
    })
  },
  /**
   * 删除选中图片
   */
  delThis(e) {
    const {
      fileList
    } = this.data
    const {
      index
    } = e.currentTarget.dataset
    fileList.splice(index, 1)
    this.setData({
      fileList
    })
  },
  /**
   * 唤醒图片选择类型弹窗
   */
  activeUploadBox() {
    this.setData({
      uploadBoxVisible: true
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
    const {
      binded
    } = userInfo || {}
    this.setData({
      binded
    })
  },
  /**
   * 切换选中框
   */
  toggleCheckBox() {
    const {
      needNotify
    } = this.data
    this.setData({
      needNotify: !needNotify
    })
  },
  /**
   * 新增一篇笔记
   */
  async submitNote() {
    const {
      content,
      needNotify,
      fileList
    } = this.data
    const {
      data: id
    } = await request({
      path: apis.systemsubmitnote,
      method: "post",
      loaddingVisible: true,
      data: {
        content,
        needNotify,
        fileList
      }
    })
    this.setData({
      content: '',
      fileList: []
    })
    if (id) {
      wx.showToast({
        mask: true,
        icon: 'none',
        title: '成功记录到小本本上咯！',
        duration: 1000
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      }, 1000)
    }
  }
})