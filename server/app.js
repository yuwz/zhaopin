

// default options
const express = require('express');
//url模块： 解析get请求参数
const url = require('url');
//导入querystring模块（解析post请求数据）
var querystring = require('querystring');
// const jwt = require('./token')
//express-fileupload : 解析文件/解析formdata . 给req原型添加files成员
const fileUpload = require('express-fileupload');
let posData = require('./data') //初始化数据
// 创建服务器
let app = express();
var cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: [/* secret keys */'a', 'b'],
    // Cookie Options
    maxAge: 1 * 24 * 60 * 60 * 1000 // 24 hours
}));

// body-parser : 解析post参数。 给req原型添加body成员
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const zhaopin = require('mysql-ithm');
const { send } = require('process');
app.use(fileUpload());
// 连接数据库
zhaopin.connect({
    host: 'localhost',//数据库地址
    port: '3306',
    user: 'ywz',
    password: '123456',
    database: 'zhaopin'
})

// // 全局 中间件  解决所有路由的 跨域问题
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    next()
})


// 表格模型 操作表格
//hr表
let hr = zhaopin.model('hr', {
    'phone': String,
    'psw': String,
    'type': String,//用户类型
    'posSet': String, //发布招聘信息id集合;  
    'status': String, //对应的状态集合 0:禁用,1:通过,2:审核中
    'name': String,
    'age': String,
})
let user = zhaopin.model('user', {
    'phone': String,
    'psw': String,
    'type': String,
    'name': String,
    'age': String,
    'sendSet': String,//投递集合 
    'status': String,//对应的状态集合 0:不匹配,1:面试,2:待处理
    'nodes': String// 个人介绍
})

// 管理员表
let adm = zhaopin.model('adm', {
    'phone': String,
    'psw': String,
    'type': String,
    'posSet': String,//招聘信息id集合;修改status 0:禁用,1:通过,2:审核中
    'status': String //对应的状态集合
})
// 招聘信息表
let posInfo = zhaopin.model('posInfo', {
    'status': String,
    'city': String,
    'company': String,
    'salary': String,
    'jobName': String,
    'req': String,
    'description': String,
    'hr': String,
    'hr_id': String,
    'sendsSet': String, // 投递者集合 
    'userStatus': String//投递者对应状态集合 0:不匹配,1:面试,2:待处理
})

//初始化招聘信息数据
// posInfo.insert(posData, (err, results) => {
//     console.log(err);
//     console.log(results);
//     if (!err) console.log('增加成功');
// });

//设置允许跨域
const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true
}
// 解决跨域问题
app.use(require('cors')(corsOptions));
// app.all('*', function (req, res, next) {

//     res.header("Access-Control-Allow-Origin", "http://localhost:8080");//前端域名

//     res.header("Access-Control-Allow-Credentials", 'true');

//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

//     next();

// });


//获得所有通过的职位信息
app.get('/position', (req, res) => {
    //查询数据库所有数据
    posInfo.find(`status=${1}`, (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: err
            })
        } else {
            // console.log(results);
            res.send({
                code: 200,
                data: results,
            });

        };
    });
})
//注册
// register
app.post('/register', (req, res) => {
    let { type, phone, psw } = req.body;
    if (type == '0') {
        res.send({
            code: 200,
            msg: '不能注册管理员'
        })
    } else {
        let tamp;
        if (type == '1') {
            tamp = hr;
        } else if (tamp == '2') {
            tamp = user;
        }
        tamp.find(`phone like "%${phone}%"`, (err, results) => {
            console.log('注册', results);
            if (results.length == 0) {
                //可以注册
                tamp.insert(req.body, (err2, results2) => {
                    if (err2) {

                    } else {
                        console.log(results2);
                        res.send({
                            code: 200,
                            msg: '注册成功'
                        })
                    }
                })
            }
        })

    }
})
//获得所有职位信息
app.get('/position1', (req, res) => {
    //查询数据库所有数据
    posInfo.find((err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: err
            })
        } else {
            // console.log(results);
            res.send({
                code: 200,
                data: results,
            });

        };
    });
})
//根据城市,职位关键词查询招聘信息
app.get('/searchPos', (req, res) => {
    console.log(req.query);
    posInfo.find(`city like "%${req.query.city}%" and jobName like "%${req.query.jobName}%"`, (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: err
            });
        } else {
            res.send({
                code: 200,
                data: results,
            });
        }
    })
})
//根据posId查询招聘信息
app.get('/posdetail', (req, res) => {
    // console.log(req.url);
    let isLogin;
    let { type } = req.session.user
    if (req.session) {
        isLogin = true;
    } else {
        isLogin = false;
    }
    // console.log(req.query.id);
    let { id } = req.query
    posInfo.find(`id=${id}`, (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: err,

            });
        } else {
            res.send({
                code: 200,
                data: results[0],
                isLogin,
                type
            });
        };
    })
})



// 登录接口
app.post('/login', (req, res) => {
    // console.log(req.body);
    console.log('cookies', req);
    // res.send('app收到post请求啦')
    let { type, psw, phone } = req.body;
    if (type == '2') {
        // login(user, phone, psw)
        user.find(`phone=${phone}`, (err, results) => {
            //查询user表校验phone psw
            if (err) { //查询账号失败
                res.send({
                    code: 500,
                    msg: '用户名或密码错误'
                })
            } else {
                if (results.length == 0) {//账号错误
                    res.send({
                        code: 400,
                        msg: '用户名或密码错误'
                    })
                } else {//账号正确
                    if (results[0].psw == psw) {//密码正确
                        let id = results[0].id
                        req.session.user = {
                            phone, psw, type, id
                        };
                        // console.log(req.session.user);
                        res.send({
                            code: 200,
                            msg: '登录成功',
                        })
                    } else {
                        res.send({ //密码错误
                            code: 400,
                            msg: '用户名或密码错误'
                        })
                    }
                }
            }
        })
    } else if (type == '1') {
        // login(hr, phone, psw)
        hr.find(`phone=${phone}`, (err, results) => {
            //查询user表校验phone psw
            if (err) { //查询账号失败
                res.send({
                    code: 500,
                    msg: '用户名或密码错误'
                })
            } else {
                if (results.length == 0) {//账号错误
                    res.send({
                        code: 400,
                        msg: '用户名或密码错误'
                    })
                } else {//账号正确
                    if (results[0].psw == psw) {//密码正确
                        let id = results[0].id
                        req.session.user = {
                            phone, psw, type, id

                        };
                        // console.log(req.session);
                        res.send({
                            code: 200,
                            msg: '登录成功'
                        })
                    } else {
                        res.send({ //密码错误
                            code: 400,
                            msg: '用户名或密码错误'
                        })
                    }
                }
            }
        })
    } else if (type == '0') {
        // login(adm, phone, psw)
        adm.find(`phone=${phone}`, (err, results) => {
            //查询user表校验phone psw
            if (err) { //查询账号失败
                res.send({
                    code: 500,
                    msg: '用户名或密码错误'
                })
            } else {
                if (results.length == 0) {//账号错误
                    res.send({
                        code: 400,
                        msg: '用户名或密码错误'
                    })
                } else {//账号正确
                    if (results[0].psw == psw) {//密码正确
                        let id = results[0].id
                        req.session.user = {
                            phone, psw, type, id
                        };
                        // console.log(req.session.user);
                        res.send({
                            code: 200,
                            msg: '登录成功'
                        })
                    } else {
                        res.send({ //密码错误
                            code: 400,
                            msg: '用户名或密码错误'
                        })
                    }
                }
            }
        })
    } else {
        res.send({
            code: 400,
            msg: '账号或密码错误'
        })
    }

})
//管理员修改职位状态
app.post('/admEditPosStatus', (req, res) => {
    let { status, id, hr_id } = req.body;
    //修改posInfo表中的状态
    posInfo.update(`id=${id}`, { status: status }, (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: err
            })
        } else {
            // console.log('status', status);
            hr.find(`phone=${hr_id}`, (err2, results2) => {
                if (err2) {
                    res.send({
                        code: 500,
                        msg: err2
                    })
                } else {
                    let posSetStr = results2[0].posSet;
                    let statusStr = results2[0].status;
                    let posSetArr = posSetStr.split(',');
                    let statusArr = statusStr.split(',');
                    posSetArr.pop(); posSetArr.shift();
                    statusArr.pop(); statusArr.shift();
                    for (let i = 0; i < posSetArr.length; i++) {
                        if (posSetStr[i] == id) {
                            statusArr[i] = status;
                        }
                    }
                    posSetStr = ',' + posSetArr.join(',') + ',';
                    statusStr = ',' + statusArr.join(',') + ',';
                    hr.update(`phone=${hr_id}`, { posSet: posSetStr, status: statusStr }, (err3, results3) => {
                        if (err3) {
                            res.send({
                                code: 500,
                                msg: err3
                            })
                        } else {
                            res.send({
                                code: 200,
                                msg: '成功'
                            })
                        }
                    })
                }
            })
        }
    })
    //修改对应hr中的状态
})
//新增职位
app.post('/addPos', (req, res) => {
    // console.log('addPos,reqBody', req.body);
    req.body.status = '2';
    let posId;
    //写入职位信息表
    posInfo.insert(req.body, (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: err
            })
        } else {
            //记录在hr表中
            posId = results.insertId;
            hr.find(`id=${req.session.user.id}`, (err2, results2) => {
                if (err2) {
                    res.send({
                        code: 500,
                        msg: err2
                    })
                } else {
                    let posSetStr = results2[0].posSet + posId + ',';
                    let statusStr = results2[0].status + 2 + ',';
                    hr.update(`id=${req.session.user.id}`, { posSet: posSetStr, status: statusStr }, (err3, results3) => {
                        if (err3) {
                            res.send({
                                code: 500,
                                msg: err3
                            })
                        } else {
                            res.send({
                                code: 200,
                                msg: '新增成功'
                            })
                        }
                    })
                }
            })
        }
    })

})
//一键投递
app.get('/send', (req, res) => {
    let posId = req.query.id//职位id
    let { id } = req.session.user//用户Id
    // console.log('在这呢', posId, id);
    //查重 求职者是否投递过该职位
    user.find(`id=${id}`, (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: err
            })
        } else {//查重
            // console.log('我进来拉', results[0]);
            // console.log('sendSet', results[0].sendSet);
            // console.log('posId', posId, id);
            let str = ',' + posId + ',';
            // console.log(results[0].sendSet.indexOf(str));
            if (results[0].sendSet.indexOf(str) != '-1') {//存在 已投递过
                res.send({
                    code: 201,
                    msg: '已投递过'
                })
            } else {//未投递过
                //记录
                let sendStr = results[0].sendSet + posId + ',';
                let statusStr = results[0].status + 2 + ',';
                // console.log('sendStr?', sendStr);
                // console.log('statusStr?', statusStr);
                //记录到user表中
                user.update(`id=${id}`, { sendSet: sendStr, status: statusStr }, (err2, results2) => {
                    if (err2) {
                        res.send({
                            code: 500,
                            msg: err2
                        })
                    }
                })
                //同时职位信息表posInfo记录投递者id
                posInfo.find(`id=${posId}`, (posInfoFindErr, posInfoFindResults) => {
                    if (posInfoFindErr) {
                        res.send({
                            code: 500,
                            msg: posInfoFindErr
                        })
                    } else {
                        let sendsStr = posInfoFindResults[0].sendsSet + id + ',';
                        let userStatusStr = posInfoFindResults[0].userStatus + 2 + ',';
                        posInfo.update(`id=${posId}`, { sendsSet: sendsStr, userStatus: userStatusStr }, (posInfoFindErr2, posInfoFindResults2) => {
                            if (posInfoFindErr2) {
                                res.send({
                                    code: 500,
                                    msg: posInfoFindErr2
                                })
                            } else {
                                res.send({
                                    code: 200,
                                    msg: 'posInfo修改成功'
                                })
                            }
                        })
                    }
                })

            }

        }
    })



})

//hr消息页面返回发布职位列表
app.get('/message/posList', (req, res) => {
    if (req.session.user) {
        let { phone } = req.session.user;
        posInfo.find(`hr_id like "%${phone}%" and status like "%1%"`, (err, results) => {
            if (err) {
                res.send({
                    code: 500,
                    msg: err
                })
            } else {
                res.send({
                    code: 200,
                    data: results
                })
            }
        })

    }
})
//消息页面
app.post('/message', (req, res) => {
    if (req.session.user) {//登录状态
        let { phone, type } = req.session.user
        let tamp
        if (type == '0') {
            tamp = adm
        } else if (type == '1') {
            tamp = hr
        } else if (type == '2') {
            tamp = user
            //寻找
        }
        tamp.find(`phone like "%${phone}%"`, (err, results) => {
            if (err) {
                res.send({
                    code: 500,
                    msg: err
                })
            } else {
                res.send({
                    code: 200,
                    data: results,
                    msg: '已登录',// 登录
                    type
                });

            };
        });
    } else {//未登录 
        res.send({
            code: 200,
            msg: '未登录' //未登录
        })
    }

})
//消息页面求职者请求投递的全部职位信息 参数数组
app.post('/message/userAllPos', (req, res) => {
    let { phone, type } = req.session.user;
    console.log('body', req.body);
    let resultsArr = [];
    for (let i = 0; i < req.body.length; i++) {
        posInfo.find(`id=${req.body[i]}`, (err, results) => {
            if (err) {
                res.send({
                    code: 500,
                    msg: err
                })
            } else {
                resultsArr[i] = results[0];
                console.log(results[0]);
                if (i == req.body.length - 1) {
                    console.log('resultsArr', resultsArr);
                    res.send({
                        code: 200,
                        data: resultsArr,
                        msg: '求职者全部投递信息'
                    });


                }
            }
        })
    }

})
//消息页面hr处理简历
app.post('/message/hrHeadle', (req, res) => {
    console.log('hrHeadle', req.body);
    let phone = req.body.userPhone;
    //处理 0 不匹配 1 面试
    let headleId = req.body.headleId;
    let headleType = req.body.headle;
    let headleMsg = req.body.message;
    let userId;
    //不匹配 结果写入user表,posInfo表
    //user
    user.find(`phone like "%${phone}%"`, (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: err
            })
        } else {
            let sendSetArr = results[0].sendSet.split(',')
            sendSetArr.pop(); sendSetArr.shift(); //
            let statusArr = results[0].status.split(',')
            statusArr.pop(); statusArr.shift(); //
            userId = results[0].id;
            console.log(results[0]);
            //写入处理结果
            for (let i = 0; i < sendSetArr.length; i++) {
                if (headleId == sendSetArr[i]) {
                    statusArr[i] = headleType; //状态修改

                    //转为字符串
                    let statusStr = "," + statusArr.join(',') + ",";
                    let sendSetStr = "," + sendSetArr.join(',') + ",";
                    user.update(`phone=${phone}`, { sendSet: sendSetStr, status: statusStr }, (err2, results2) => {
                        if (err2) {
                            res.send({
                                code: 500,
                                msg: err2
                            })
                        } else {
                            //posInfo
                            posInfo.find(`id like "${headleId}"`, (_err, _results) => {
                                if (_err) {
                                    send({
                                        code: 500,
                                        msg: _err
                                    })
                                } else {
                                    let sendsSetArr = _results[0].sendsSet.split(',');
                                    sendsSetArr.pop(); sendsSetArr.shift();
                                    let userStatusArr = _results[0].userStatus.split(',');
                                    userStatusArr.pop(); userStatusArr.shift();
                                    for (let i = 0; i < sendsSetArr.length; i++) {
                                        if (sendsSetArr[i] == userId) {
                                            userStatusArr[i] = headleType;
                                            console.log('posUpdate');
                                            let sendsSetStr = ',' + sendsSetArr.join(',') + ',';
                                            let userStatusStr = ',' + userStatusArr.join(',') + ',';
                                            //修改
                                            posInfo.update(`id=${headleId}`, { sendsSet: sendsSetStr, userStatus: userStatusStr }, (_err2, _results2) => {
                                                if (_err2) {
                                                    res.send({
                                                        code: 500,
                                                        msg: _err2
                                                    })
                                                } else {
                                                    console.log('userStatus修改成功', sendsSetStr, userStatusStr, headleType, userStatusArr[i]);
                                                }
                                            })
                                        }
                                    }
                                }
                            })
                        }
                    })


                }
            }

        };
    });



})
//人才市场
app.get('/message/allUser', (req, res) => {
    user.find((err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: err
            })
        } else {
            res.send({
                code: 200,
                data: results
            })
        }
    })
})
//消息页面招聘者请求用户信息 参数数组
app.post('/message/sendsInfo', (req, res) => {
    // console.log(req.body.length);
    if (req.body.length > 0) {
        let resultsArr = [];
        for (let i = 0; i < req.body.length; i++) {
            user.find(`id=${req.body[i]}`, (err, results) => {
                if (err) {
                    res.send({
                        code: 500,
                        msg: err
                    })
                } else {
                    resultsArr[i] = results[0];
                    if (i == req.body.length - 1) {
                        // console.log('resultsArr', resultsArr);
                        res.send({
                            code: 200,
                            data: resultsArr,
                            msg: '请求成功'
                        });


                    }
                }
            })
        }

    } else {
        res.send({
            code: 202,
            msg: '数组为空'
        })
    }
})
//消息页面招聘者发布成功的所有职位信息
//my页面
app.get('/userInfo', (req, res) => {
    // console.log(req);
    if (req.session.user) {//登录状态
        let { phone, type } = req.session.user
        let tamp
        if (type == '0') {
            tamp = adm
        } else if (type == '1') {
            tamp = hr
        } else if (type == '2') {
            tamp = user
        }
        tamp.find(`phone like "%${phone}%"`, (err, results) => {
            if (err) {
                res.send({
                    code: 500,
                    msg: err
                })
            } else {

                res.send({
                    code: 200,
                    data: results,
                    type,
                    msg: '已登录' // 登录
                });

            };
        });
    } else {//未登录 
        res.send({
            code: 200,
            msg: '未登录' //未登录
        })
    }
})
//my页面user编辑信息
app.post('/my/editUser', (req, res) => {
    let info = req.body;
    let { age, name, nodes } = info;
    let { phone, psw, id } = req.session.user;
    //写入数据
    user.update(`id=${id}`, { age: age, name: name, nodes: nodes }, (err, results) => {
        if (err) {
            res.send({
                code: 500,
                msg: err
            })
        } else {
            console.log('editUser修改成功');
            res.send({
                code: 200,
                msg: '修改成功'
            })
        }
    })
})
//退出登录
app.get('/loginOut', (req, res) => {
    req.session = null
    res.end('退出成功')
})

// res.setHeader("Access-Control-Allow-Origin", "*");//解决跨域

//3.开启服务器 （点击phpstudy软件开启按钮）

/**
* @description:监听ip地址和端口号
* @param {type} port : 端口号  电脑上每一个软件对应一个编号，称之为端口号
* @param {type} hostname : 主机名（ip地址）   电脑在网络上的身份证号，默认值是本机ip
* @param {type} callback :开启成功回调
* @return: 
*/
app.listen(3000, () => {
    console.log('服务器开启成功');
});
