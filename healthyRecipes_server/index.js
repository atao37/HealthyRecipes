const express = require('express');
const app = express();
const { Recipes, Collect, Admin, Message, User } = require('./db');
const multer = require('multer');
const { v4 } = require('uuid');
const axios = require('axios');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.all("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Headers", '*');

    next();
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./file")
    },
    filename: (req, file, cb) => {
        let type = file.originalname.replace(/.+\./, ".");
        cb(null, `${v4()}${type}`)
    }
})

const upload = multer({ storage });

//发布菜谱
app.post("/publish", async (req, res) => {
    try {
        const { openid, classify1, classify2, name, food, desc, imgList, time } = req.body;
        await Recipes.create({
            openid, classify1, classify2, name, food, desc, imgList, time
        });
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

//上传图片
app.post("/uploadImg", upload.array("file", 5), (req, res) => {
    res.send(req.files);
})

//获取首页的数据
app.get("/getRecipes", async (req, res) => {
    const result = await Recipes.find().sort({ time: -1 });
    res.send(result);
})

//获取健康资讯的数据
app.get("/getMessage", async (req, res) => {
    const result = await Message.find();
    res.send(result);
})

//收藏菜谱
app.post("/toCollect", async (req, res) => {
    try {
        const { id, openid } = req.body;
        await Collect.create({
            id, openid
        })
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

//小程序注册
app.post('/register', async (req, res) => {
    const { openid, username, password, date } = req.body;
    const result = await User.findOne({
        username
    });
    if (result) {
        res.send("registered");
    } else {
        await User.create({
            openid,
            username,
            password,
            date
        });
        res.send("success");
    }
})

//小程序登录
app.post("/Login", async (req, res) => {
    const { username, password } = req.body;
    const result = await User.findOne({
        username
    });
    if (result) {
        if (result.password === password) {
            res.send("success");
        } else {
            res.send("passwordError");
        }
    } else {
        res.send("error");
    }
})

//实现登录
app.get("/login", async (req, res) => {
    const { code } = req.query;
    try {
        const { data: { openid } } = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wxa8aec10dcf2ca2c2&secret=87a3d1cf43594ea61b705ce18da25559&js_code=${code}&grant_type=authorization_code `);
        res.send(openid);
    } catch (error) {
        console.log(error);
        res.send("error");
    }
})

//查询个人是否有收藏菜谱
app.post("/checkCollect", async (req, res) => {
    const { id, openid } = req.body;
    const result = await Collect.find({
        id,
        openid
    });
    res.send(result);
})

//取消收藏操作
app.post("/cancelCollect", async (req, res) => {
    try {
        const { id, openid } = req.body;
        await Collect.findOneAndRemove({
            id,
            openid
        });
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

//获取我的收藏的数据
app.get("/getCollection", async (req, res) => {
    const { openid } = req.query;
    const result = await Collect.find({
        openid
    }).populate('id');
    res.send(result);
})

//获取我的发布的数据
app.get("/getPublish", async (req, res) => {
    const { openid } = req.query;
    const result = await Recipes.find({
        openid
    });
    res.send(result);
})

//通过菜谱的分类进行查找数据
app.post("/getSort", async (req, res) => {
    const { classify2 } = req.body;
    const result = await Recipes.find({
        classify2
    });
    res.send(result);
})

//模糊查询菜谱
app.get("/searchRecipes", async (req, res) => {
    const { name } = req.query;
    const _name = new RegExp(name, 'i');
    const result = await Recipes.find({
        name: _name
    });
    res.send(result);
})

//删除发布菜谱的数据
app.post("/deleteRecipes", async (req, res) => {
    const { _id } = req.body;
    try {
        await Recipes.findByIdAndRemove(_id);
        await Collect.findOneAndRemove({
            id: _id
        });
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

//修改发布菜谱的数据
app.post("/updateRecipes", async (req, res) => {
    const { openid, classify1, classify2, name, food, desc, imgList, time, id } = req.body;
    try {
        await Recipes.findByIdAndUpdate(id, {
            openid, classify1, classify2, name, food, desc, imgList, time
        })
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

//查询菜谱详情数据
app.post("/getDetail", async (req, res) => {
    const { _id } = req.body;
    try {
        const result = await Recipes.findById(_id);
        res.send(result);
    } catch (error) {
        res.send("error");
    }
})

//查询资讯详情数据
app.post("/getMessageDetail", async (req, res) => {
    const { _id } = req.body;
    try {
        const result = await Message.findById(_id);
        res.send(result);
    } catch (error) {
        res.send("error");
    }
})

//提交评论
app.post("/addComment", async (req, res) => {
    const { avatarUrl, nickName, content, time, _id } = req.body;
    try {
        let result = await Recipes.findById(_id);
        let { commentList } = result;
        commentList.push({
            avatarUrl,
            nickName,
            content,
            time
        })
        await Recipes.findByIdAndUpdate(_id, {
            commentList
        })
        result["commentList"] = commentList;
        res.send({
            status: "success",
            data: result
        });
    } catch (error) {
        res.send({
            status: "error",
            data: error
        });
    }
})

//管理员登录
app.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const result = await Admin.findOne({
        username
    })

    if (result && result.password === password) {
        res.send(result);//登录成功
    } else {
        res.send("error");//登录失败
    }
})

//管理系统的菜谱数据
app.post("/admin/getRecipes", async (req, res) => {
    const { page, size } = req.body;
    try {
        const result = await Recipes.find().skip((page - 1) * size).limit(size);
        const total = await Recipes.find().countDocuments();
        res.send({
            result,
            total
        })
    } catch (error) {
        res.send("error");
    }
})

//管理系统删除菜谱数据
app.post("/admin/deleteRecipes", async (req, res) => {
    const { _id } = req.body;
    try {
        await Recipes.findByIdAndRemove(_id);
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

//管理系统的健康资讯数据
app.post("/admin/getMessage", async (req, res) => {
    const { page, size } = req.body;
    try {
        const result = await Message.find().skip((page - 1) * size).limit(size);
        const total = await Message.find().countDocuments();
        res.send({
            result,
            total
        })
    } catch (error) {
        res.send("error");
    }
})

//管理系统删除菜谱数据
app.post("/admin/deleteMessage", async (req, res) => {
    const { _id } = req.body;
    try {
        await Message.findByIdAndRemove(_id);
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

//管理系统的用户数据
app.post("/admin/getUser", async (req, res) => {
    const { page, size, search } = req.body;
    try {
        if (search) {
            const username = new RegExp(search, 'i');
            const result = await User.find({
                username
            }).skip((page - 1) * size).limit(size);
            const total = await User.find().countDocuments();
            res.send({
                result,
                total
            })
        } else {
            const result = await User.find().skip((page - 1) * size).limit(size);
            const total = await User.find().countDocuments();
            res.send({
                result,
                total
            })
        }
    } catch (error) {
        res.send("error");
    }
})

//管理系统删除用户信息
app.post("/admin/deleteUser", async (req, res) => {
    const { _id } = req.body;
    try {
        await User.findByIdAndRemove(_id);
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

//管理系统的管理员信息
app.post("/admin/getAdmin", async (req, res) => {
    const { page, size, search } = req.body;
    try {
        if (search) {
            const username = new RegExp(search, 'i');
            const result = await Admin.find({
                username
            }).skip((page - 1) * size).limit(size);
            const total = await Admin.find().countDocuments();
            res.send({
                result,
                total
            })
        } else {
            const result = await Admin.find().skip((page - 1) * size).limit(size);
            const total = await Admin.find().countDocuments();
            res.send({
                result,
                total
            })
        }
    } catch (error) {
        res.send("error");
    }
})

//管理系统删除管理员信息
app.post("/admin/deleteAdmin", async (req, res) => {
    const { _id, username } = req.body;
    try {
        const {role} = await Admin.findOne({
            username
        });
        if (role === 1) {
            res.send("noPower");
        } else {
            await Admin.findByIdAndRemove(_id);
            res.send("success");
        }
    } catch (error) {
        res.send("error");
    }
})

//管理系统新增管理员
app.post("/admin/addAdmin",async(req,res)=>{
    const {username,password,role,nickname,_id} = req.body;
    try{
        if(_id){
            //编辑
            await Admin.findByIdAndUpdate(_id,{
                username,
                password,
                role,
                nickname
            })
        }else{
            //新增
            await Admin.create({
                username,
                password,
                role,
                nickname,
                create_time:new Date().getTime()
            })
        }
        res.send("success");
    }catch(error){
        res.send("error");
    }
})

//查询管理员权限
app.post("/admin/getPower",async (req,res)=>{
    const {username} = req.body;
    try{
        const {role} = await Admin.findOne({
            username
        });
        if(role === 0){
            res.send(true);
        }else{
            res.send(false);
        }
    }catch(error){
        res.send("error");
    }
})

app.listen(3000, () => {
    console.log('server running!');
})