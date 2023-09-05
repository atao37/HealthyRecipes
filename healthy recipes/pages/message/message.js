import {ajax} from '../../utils/util';
// pages/message/message.js
Page({

   /**
    * 页面的初始数据
    */
   data: {
      list:[]
   },

   toDetail(e){
      const {info:{_id}} = e.currentTarget.dataset;
      wx.navigateTo({
        url: `../messageDetail/messageDetail?_id=${_id}`,
      })
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad:async function(options) {
      const params={};
      const result = await ajax('/getMessage', 'GET', params);
      const {data}=result;
       this.setData({
          list:data.map(item=>{
            return{
               ...item//拓展运算符
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