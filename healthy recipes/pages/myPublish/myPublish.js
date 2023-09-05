// pages/myPublish/myPublish.js
import {formatTime,ajax} from '../../utils/util';
Page({

   /**
    * 页面的初始数据
    */
   data: {
      list:[]
   },

   getUpdate(e){
      const id = e.detail;
      wx.reLaunch({
         url: `../publish/publish?id=${id}`,
      })
   },

   async getDelete(e){
      const id = e.detail;
      const params={
         _id:id
      };
      const {data} = await ajax('/deleteRecipes','POST',params);
      if(data==="success"){
         wx.showToast({
           title: '删除成功！',
           icon:'none',
           success:()=>{
              this.onLoad();
           }
         })
      }else{
         wx.showToast({
           title: '删除失败！',
           icon:'none'
         })
      }
   },

   toDetail(e){
      const {info:{_id}} = e.currentTarget.dataset;
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
      };
      const result = await ajax('/getPublish','GET',params);
      const {data} = result;
      this.setData({
         list:data.map(item=>{
            return{
               ...item,//拓展运算符
               time:formatTime(item.time)
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