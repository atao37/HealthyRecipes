import {
   formatTime,
   ajax
} from '../../utils/util';

Page({

   /**
    * 页面的初始数据
    */
   data: {
      background: ['../../images/cover2.jpg', '../../images/cover.jpg'],
      list: []
   },

   toHomeCooking() {
      wx.navigateTo({
         url: `../sortList/sortList?text=粤菜`,
      })
   },

   toColdfood() {
      wx.navigateTo({
         url: `../sortList/sortList?text=凉拌`,
      })
   },

   toNoodle() {
      wx.navigateTo({
         url: `../sortList/sortList?text=面食`,
      })
   },

   toSoup() {
      wx.navigateTo({
         url: `../sortList/sortList?text=靓汤`,
      })
   },

   toDetail(e) {
      const {
         info: {
            _id
         }
      } = e.currentTarget.dataset;
      wx.navigateTo({
         url: `../recipesDetail/recipesDetail?_id=${_id}`,
      })
   },

   toSort() {
      wx.reLaunch({
         url: '../sort/sort',
      })
   },

   toSearch() {
      wx.navigateTo({
         url: '../search/search',
      })
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: async function (options) {
      const params = {};

      if (!wx.getStorageSync('login_account')) {
         wx.redirectTo({
            url: '../login/login',
         })
      } else {
         const result = await ajax('/getRecipes', 'GET', params);
         const {
            data
         } = result;
         this.setData({
            list: data.map(item => {
               return {
                  ...item, //拓展运算符
                  time: formatTime(item.time)
               }
            })
         })

         const openid = wx.getStorageSync('openid');
         if (!openid) {
            const {
               code
            } = await wx.login();
            const params1 = {
               code
            };
            const result1 = await ajax('/login', 'GET', params1);
            const {
               data
            } = result1;
            if (data !== "error") {
               wx.setStorageSync('openid', data);
            }
         }

      }



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
      this.onLoad();
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