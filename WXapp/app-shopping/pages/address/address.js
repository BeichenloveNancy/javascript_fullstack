// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {
      name: '',
      detail: '',
      address: ''
    }
  },
  bindName (e) {
    console.log(e)
    // 将e的value字段保留到数据源中去
    this.setData({
      'address.name': e.detail.value
    })
  },
  bindPhone(e) {
    console.log(e)
    // 将e的value字段保留到数据源中去
    this.setData({
      'address.detail': e.detail.value
    })
  },
  bindDetail(e) {
    console.log(e)
    // 将e的value字段保留到数据源中去
    this.setData({
      'address.address': e.detail.value
    })
  },
  formSubmit() {
    console.log(this.data.address.name)
    console.log(this.data.address.detail)
    console.log(this.data.address.address)
    if (this.data.address.name && this.data.address.detail && this.data.address.address) {
      wx.setStorage({
        key: 'address',
        data: this.data.address,
        success: () => {
          wx.navigateBack() 
        },
        fail: () =>{},
        complete: ()=>{}
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '请填写完整所有信息',
        showCancel:false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            
          }
        },
        fail: () => {},
        complete: () => {}
      });
    }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})