const mongoose = require('mongoose');

//连接mongodb数据库
mongoose.connect("mongodb://localhost:27017/HealthyRecipes")
    .then(() => {
        console.log("数据库连接成功！");
    })
    .catch((err) => {
        console.log("数据库连接失败！", err);
    })

//发布个人菜谱表
const RecipesSchema = new mongoose.Schema({
    openid: {
        type: String
    },
    classify1: {
        type: String
    },
    classify2: {
        type: String
    },
    name: {
        type: String
    },
    food: {
        type: String
    },
    desc: {
        type: String
    },
    imgList: {
        type: Array,
        default: []
    },
    time: {
        type: Number
    },
    commentList: {
        type: Array,
        default: []
    }
})

//健康资讯表
const MessageSchema = new mongoose.Schema({
    title: {
        type: String
    },
    source: {
        type: String
    },
    desc: {
        type: String
    },
    imgList: {
        type: Array,
        default: []
    },
    time: {
        type: String
    }
})

//菜谱收藏表
const CollectSchema = new mongoose.Schema({
    openid: {
        type: String
    },
    //对应Recipes表的_id   
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipes'
    }
})

//用户账号
const UserSchema = new mongoose.Schema({
    openid:{
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    date:{
        type:Number
    }
})

//管理员账号
const AdminSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    create_time: {
        type: Number
    },
    role: {
        type: Number
    },
    nickname: {
        type: String
    }
})

const Recipes = mongoose.model("Recipes", RecipesSchema);
const Collect = mongoose.model("Collect", CollectSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const Message = mongoose.model("Message", MessageSchema);
const User = mongoose.model("User",UserSchema);

// for(let i=0;i<10;i++){
//     Recipes.create({
//         openid:'oV9SO5A79GdRpYp9v8h8gLjdhXUg',
//         classify1:'精选',
//         classify2:'粤菜',
//         name:'胡萝卜丝炒鸡蛋',
//         food:'鸡蛋',
//         desc:'111',
//         imgList:[ "http://localhost:3000/file/cabbf188-b8fb-423b-b1b9-e5694375f801.jpeg" ],
//         time:'1682409539633.0'
//     })
// }

// for (let i = 0; i < 10; i++) {
//     Message.create({
//         title: '123',
//         source: '健康网',
//         desc: '111',
//         imgList: ["http://localhost:3000/file/295054b2-4914-45c1-806c-d8e0e6c5c7a5.jpg"],
//         time: '1月1日'
//     })
// }

module.exports = {
    Recipes,
    Collect,
    Admin,
    Message,
    User
}