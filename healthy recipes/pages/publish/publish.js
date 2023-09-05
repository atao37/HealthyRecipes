// pages/publish/publish.js
import {
   ajax
} from '../../utils/util';
Page({

   /**
    * 页面的初始数据
    */
   data: {
      multiArray: [
         ['精选', '蛋/奶', '肉类', '鱼类', '蔬菜', '豆类', '五谷杂粮', '菜系', '甜品'],
         ['粤菜', '凉拌类', '烘培类', '川菜', '湘菜']
      ],
      pickerList: [
         ['粤菜', '凉拌类', '烘培类', '川菜', '湘菜', '靓汤', '糕点'],
         ['鸡蛋', '鸭蛋', '鹅蛋', '咸蛋', '鹌鹑蛋', '奶酪'],
         ['猪肉', '五花肉', '牛肉', '鸡肉', '鸭肉', '腊肉'],
         ['皖鱼', '带鱼', '三文鱼', '鳗鱼', '马鲛鱼'],
         ['大白菜', '芹菜', '油菜', '生菜', '韭菜', '卷心菜', '奶白菜', '西红柿', '西兰花'],
         ['黄豆', '青豆', '花生', '红豆', '绿豆', '豆芽', '豆腐'],
         ['大米', '小米', '小麦', '糯米', '薏米', '西米'],
         ['粤菜', '西餐', '川菜', '湘菜'],
         ['糖水', '糕点'],
      ],
      multiIndex: [0, 0],
      select: false,
      name: '',
      food: '',
      desc: '',
      imgList: []
   },

   async toPublish() {
      const {
         multiArray,
         multiIndex,
         name,
         food,
         desc,
         imgList,
         id
      } = this.data;
      if (!name || !food || !desc || !imgList) {
         wx.showToast({
            icon: 'none',
            title: '未填写必填项'
         });
         return;
      }

      if (id) {
         //修改
         const params = {
            openid: wx.getStorageSync('openid'),
            classify1: multiArray[0][multiIndex[0]],
            classify2: multiArray[1][multiIndex[1]],
            name,
            food,
            desc,
            imgList,
            time: new Date().getTime(),
            id
         };
         const {data} = await ajax('/updateRecipes', 'POST', params);

         if (data === "success") {
            wx.switchTab({
               url: '../index/index',
               success: () => {
                  wx.showToast({
                     icon: 'none',
                     title: '修改成功！'
                  })
               }
            })
         } else {
            wx.showToast({
               icon: 'none',
               title: '修改失败！'
            })
         }
      } else {
         //发布
         const params = {
            openid: wx.getStorageSync('openid'),
            classify1: multiArray[0][multiIndex[0]],
            classify2: multiArray[1][multiIndex[1]],
            name,
            food,
            desc,
            imgList,
            time: new Date().getTime()
         };
         const result = await ajax('/publish', 'POST', params);
         const {
            data
         } = result;
         if (data === "success") {
            wx.switchTab({
               url: '../index/index',
               success: () => {
                  wx.showToast({
                     icon: 'none',
                     title: '发布成功！'
                  })
               }
            })
         } else {
            wx.showToast({
               icon: 'none',
               title: '发布失败！'
            })
         }
      }
   },

   deleteImg(e) {
      let {
         index
      } = e.currentTarget.dataset;
      let {
         imgList
      } = this.data;
      imgList.splice(index, 1);
      this.setData({
         imgList
      })
   },

   uploadImg() {
      var that = this;
      let {
         imgList
      } = this.data;
      wx.chooseMedia({
         count: 5 - imgList.length,
         mediaType: ['image'],
         sourceType: ['album', 'camera'],
         success: (res) => {
            const {
               tempFiles
            } = res;
            tempFiles.forEach(item => {
               wx.uploadFile({
                  url: 'http://localhost:3000/uploadImg',
                  filePath: item.tempFilePath,
                  name: 'file',
                  success(res) {
                     const {
                        data
                     } = res;
                     let {
                        fieldname,
                        filename
                     } = JSON.parse(data)[0];
                     let _path = `http://localhost:3000/${fieldname}/${filename}`;
                     console.log(_path);
                     imgList.unshift(_path);
                     that.setData({
                        imgList
                     })
                     //const data = res.data
                     //do something
                  },
                  fail: (err) => {
                     console.log(err);
                  }
               })

               console.log(imgList);
            })

         }
      })
   },

   d() {
      this.setData({
         desc: ''
      })
   },

   getName(e) {
      this.setData({
         name: e.detail.value
      })
   },

   getFood(e) {
      this.setData({
         food: e.detail.value
      })
   },

   getDesc(e) {
      this.setData({
         desc: e.detail.value
      })
   },



   bindMultiPickerChange(e) {
      this.setData({
         select: true
      })
   },

   bindMultiPickerColumnChange(e) {
      let {
         column,
         value
      } = e.detail;
      let data = this.data;
      let {
         multiArray,
         pickerList
      } = this.data;
      if (column === 0) {
         //替换展示的数据源
         multiArray[1] = pickerList[value];
      }
      data.multiArray = multiArray;
      data.multiIndex[column] = value;
      this.setData(data);
   },

   closeSelect() {
      this.setData({
         select: false,
         multiIndex: [0, 0]
      })
   },

   /**
    * 生命周期函数--监听页面加载
    */
   async onLoad(options) {
      const {
         id
      } = options;
      const {
         multiArray,
         pickerList
      } = this.data;
      if (id) {
         const params = {
            _id: id
         };
         const {
            data
         } = await ajax('/getDetail', 'POST', params);
         
         const {
            classify1,
            classify2,
            name,
            food,
            desc,
            imgList
         } = data;
         const index1 = multiArray[0].findIndex(item => item === classify1);
         const index2 = pickerList[index1].findIndex(item => item === classify2);
         this.setData({
            select: true,
            multiArray: [
               multiArray[0],
               pickerList[index1]
            ],
            multiIndex: [index1, index2],
            name,
            food,
            desc,
            imgList,
            id
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