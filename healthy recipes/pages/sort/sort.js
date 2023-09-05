// pages/sort/sort.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodlist:['精选','蛋/奶','肉类','鱼类','蔬菜','豆类','五谷杂粱','菜系','甜品'],
    rightList:[
       [
          {text:"粤菜"},
          {text:"凉拌类"},
          {text:"烘培类"},
          {text:"川菜"},
          {text:"湘菜"},
          {text:"靓汤"},
          {text:"糕点"}
       ],
       [
         {text:"鸡蛋"},
         {text:"鸭蛋"},
         {text:"鹅蛋"},
         {text:"咸蛋"},
         {text:"鹌鹑蛋"},
         {text:"奶酪"}
      ],
      [
         {text:"猪肉"},
         {text:"五花肉"},
         {text:"牛肉"},
         {text:"鸡肉"},
         {text:"鸭肉"},
         {text:"腊肉"}
      ],
      [
         {text:"皖鱼"},
         {text:"带鱼"},
         {text:"三文鱼"},
         {text:"鳗鱼"},
         {text:"马鲛鱼"}
      ],
      [
         {text:"大白菜"},
         {text:"芹菜"},
         {text:"油菜"},
         {text:"生菜"},
         {text:"韭菜"},
         {text:"卷心菜"},
         {text:"奶白菜"},
         {text:"西红柿"},
         {text:"西兰花"}
      ],
      [
         {text:"黄豆"},
         {text:"青豆"},
         {text:"花生"},
         {text:"红豆"},
         {text:"绿豆"},
         {text:"豆芽"},
         {text:"豆腐"}
      ],
      [
         {text:"大米"},
         {text:"小米"},
         {text:"小麦"},
         {text:"糯米"},
         {text:"薏米"},
         {text:"西米"}
      ],
      [
         {text:"粤菜"},
         {text:"西餐"},
         {text:"川菜"},
         {text:"湘菜"}
      ],
      [
         {text:"糖水"},
         {text:"糕点"}
      ]
    ],
    select:0
  },

  toSearch(){
   wx.navigateTo({
      url: '../search/search',
    })
  },

  selectLeft(e){
    const {index}=e.currentTarget.dataset;
    this.setData({
      select:index
    })
  },

  toSort(e){
      const {text} = e.currentTarget.dataset;
      wx.navigateTo({
        url: `../sortList/sortList?text=${text}`,
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})