// pages/recipesDetail/recipesDetail.js
import {
   formatTime,
   ajax
} from '../../utils/util';
Page({

   /**
    * 页面的初始数据
    */
   data: {
      background: ['../../images/鸡蛋炒胡萝卜丝.jpeg', '../../images/cover.jpg'],
      collectIcon: ['/images/collect.png', '/images/collect(1).png'],
      info: {},
      from: '',
      comment: ''
   },

   async submitComment() {
      const {
         comment,
         info: {
            _id
         }
      } = this.data;
      if (comment.trim().length === 0) {
         wx.showToast({
            title: '您还未输入内容！',
            icon: 'none'
         })
         return;
      }
      const {
         avatarUrl,
         nickName
      } = wx.getStorageSync('userInfo');
      const params = {
         avatarUrl,
         nickName,
         content: comment,
         time: new Date().getTime(),
         _id
      };

      const {
         data: {
            status,
            data
         }
      } = await ajax('/addComment', 'POST', params);
      if (status === "success") {
         wx.showToast({
            title: '评论成功！',
            icon: 'none'
         })

         data.commentList.forEach(item => {
            item.time = formatTime(item.time)
         })

         this.setData({
            info: data,
            comment: ''
         })
      } else {
         wx.showToast({
            title: '评论失败！',
            icon: 'none'
         })
      }
   },

   getComment(e) {
      this.setData({
         comment: e.detail.value
      })
   },

   async toCollect() {
      const {
         info,
         collectIcon
      } = this.data;
      const {
         _id
      } = info;
      //当前菜谱还未被收藏
      if (collectIcon[0] === '/images/collect.png') {

         const params = {
            id: _id,
            openid: wx.getStorageSync('openid')
         };
         const result = await ajax('/toCollect', 'POST', params);
         const {
            data
         } = result;
         if (data === 'success') {
            wx.showToast({
               title: '收藏成功！！！',
               icon: 'none'
            })
            let last = collectIcon.pop();
            collectIcon.unshift(last);
            this.setData({
               collectIcon
            })
         }
      } else {
         const params1 = {
            id: _id,
            openid: wx.getStorageSync('openid')
         };
         const result1 = await ajax('/cancelCollect', 'POST', params1);
         const {
            data
         } = result1;
         if (data === "success") {
            wx.showToast({
               title: '收藏已取消',
               icon: 'none'
            })
            let last = collectIcon.pop();
            collectIcon.unshift(last);
            this.setData({
               collectIcon
            })
         }
      }


   },

   /**
    * 生命周期函数--监听页面加载
    */
   async onLoad(options) {
      const {
         _id
      } = options;
      const {
         collectIcon
      } = this.data;
      const params = {
         _id
      };
      const {
         data: info
      } = await ajax('/getDetail', 'POST', params);

      info.commentList.forEach(item => {
         item.time = formatTime(item.time);
      })

      this.setData({
         info
      })

      const params2 = {
         id: _id,
         openid: wx.getStorageSync('openid')
      };
      const result2 = await ajax('/checkCollect', 'POST', params2);
      const {
         data
      } = result2;
      if (data.length > 0) {
         let last = collectIcon.pop();
         collectIcon.unshift(last);
         this.setData({
            collectIcon
         })
      }
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