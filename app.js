App({
  globalData: {
    BASEURL: 'http://127.0.0.1:3000/',
  },
  onLaunch(){
    wx.loadFontFace({
      global: true,
      family: 'book',
      source: `url(${this.globalData.BASEURL}system/get-file?filePath=book.woff)`
    })
  },
})