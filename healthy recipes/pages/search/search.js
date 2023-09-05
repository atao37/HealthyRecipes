// pages/search/search.js
import {ajax} from '../../utils/util';
let t=null;
Page({

   /**
    * 页面的初始数据
    */
   data: {
      //延迟响应
      search:'',
      //及时响应
      _search:'',
      //搜索历史
      searchLog:[],
      //搜索结果显示
      searchRes:[]
   },

   toDetail(e){
      const {info:{_id}} = e.currentTarget.dataset;
       wx.navigateTo({
         url: `../recipesDetail/recipesDetail?_id=${_id}`,
       })
   },

   toSearchLog(e){
      const {name} = e.currentTarget.dataset;
      wx.navigateTo({
        url: `../searchHistory/searchHistory?name=${name}`,
      })
   },

   getSearch(e){
      this.setData({
         _search:e.detail.value
      });
      //实现防抖
      if(t) clearTimeout(t);
      t=setTimeout(async()=>{
         this.setData({
            search:e.detail.value
         });
         let searchLog=wx.getStorageSync('searchLog');
         if(searchLog){
            //缓存存在值
            searchLog.unshift(e.detail.value);
         }else{
            //缓存不存在值
            searchLog=[e.detail.value];
         }
         wx.setStorageSync('searchLog', searchLog);
         this.setData({
            searchLog
         })
         const params={
            name:e.detail.value
         };
         const result= await ajax('/searchRecipes','GET',params);
         const {data} = result;
         this.setData({
            searchRes:data
         })
      },1000);
   },

   deleteSearch(){
      this.setData({
         search:'',
         _search:''
      })
   },

   deleteLog(){
      //删除界面数据
      this.setData({
         searchLog:[]
      });
      //删除缓存中的数据
      wx.removeStorageSync('searchLog');
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad(options) {
      const searchLog=wx.getStorageSync('searchLog');
      this.setData({
         searchLog
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