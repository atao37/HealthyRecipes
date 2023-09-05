// pages/myCollection/myCollection.js
import {ajax,formatTime} from '../../utils/util';
Page({

   /**
    * 页面的初始数据
    */
   data: {
      list:[]
   },

   toDetail(e){
      const {info:{id: {_id}}} = e.currentTarget.dataset;
       wx.navigateTo({
         url: `../recipesDetail/recipesDetail?_id=${_id}`,
       })
   },

   /**
    * 生命周期函数--监听页面加载
    */
   async onLoad(options) {
      const params={
         openid:wx.getStorageSync('openid')
      }
      const result = await ajax('/getCollection','GET',params);
      const {data} =result;
      this.setData({
         list:data.map(item=>{
            const {id} = item;
            return{
               ...item,
               id:{
                  ...id,
                  time:formatTime(id.time)
               }
            }
         })
      })
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
      this.onLoad();
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