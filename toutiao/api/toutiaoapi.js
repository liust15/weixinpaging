'use strict'
const express = require('express');
const orm = require('orm')
const mysql = require("mysql");
const app = express();
const bodyParser = require('body-parser');
const SQL_URL = "mysql://root:root@localhost:3306/python"
app.use(bodyParser.json({ limit: '1mb' }));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({ extended: true }));    //此项必须在 bodyParser.json 下面,为参数编码
app.listen(8080)
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200)
        /*让options请求快速返回 */
    }
    else {
        next();
    }
});
app.use(orm.express(SQL_URL, {
    define: function (db, models, next) {
        models.toutiao = db.define("students_toutiao", {
            id: { type: "integer", key: true, unique: false },
            image_url: String,
            title: String,
            media_creator_id: Number,
            media_name: String,
        });
        db.sync()
        next();
    }

}));

app.get('/example', function (req, res, next) {
    console.log('response will be sent by the next function ...');
    //res.send("121");
    next();
}, function (req, res) {
    res.send('Hello from D!');
});
//获取全部头条信息
app.get("/getAlltoutiao", function (req, res) {
    req.models.toutiao.find(function (err, toutiao) {
        if (err) {
            res.send(err);
        } else {
            // movie.type=;
            res.send(toutiao);
        }
    });
});
//模糊查询
app.get("/getToutiaoByTitle", function (req, res) {
   // console.log(req.query)
    let data = req.query.title;
    //console.log(data)
    req.models.toutiao.find({ "title": orm.like("%" + data + "%") }, function (err, toutiao) {
        if (err) {
            res.send(err);
        } else {
            res.send(JSON.stringify(toutiao));
        }
    });
});
//分页
app.get("/getAllPaging", function (req, res) {
    let data = req.query;
    let type = data.type;
    let year = data.year;
    let area = data.area;
     req.models.toutiao.find({ "title": orm.like("%" + data + "%") }, function (err, toutiao) {
         if (err) {
             res.send(err);
         } else {
             res.send(JSON.stringify(toutiao));
         }
     });
 });
// //模糊查询
// app.get("/getMovieByName", function (req, res) {
//     let data = req.query.name;
//     // console.log(data)
//     req.models.Movie.find({ "name": orm.like("%" + data + "%") }, function (err, movie) {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send(JSON.stringify(movie));
//         }
//     });

// });
// //根据年份/类型/地区查询
// app.get("/get/Movie/ByYearTypeArea", function (req, res) {
//     let data = req.query;
//     let type = data.type;
//     let year = data.year;
//     let area = data.area;
//     let yAnda = {};
//     if (year != null) {
//         yAnda.year = year;
//     }
//     if (area != null) {
//         yAnda.area = orm.like("%" + area + "%");
//     }
//     if (type == null) {
//         getMovieByYearArea(req, res, yAnda)
//     } else {
//         ByType(req, res, type, yAnda)
//     }
// });

// //根据年份或地区查找
// function getMovieByYearArea(req, res, yAnda) {
//     req.models.Movie.find(yAnda, function (err, movie) {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send(movie)
//         }
//     })
// }

// //  req.models.Type(10001).getMovies().order("score").run(function (err,movies) {
// // movies;
// // })

// //根据类型和其他查询
// function ByType(req, res, type, yAnda) {
//     req.models.Type.find({ name: type }, function (err, id) {
//         req.models.Type.find({ id: id[0].id }, function (err, types) {
//             types[0].getMovies(yAnda, function (err, movies) {
//                 res.send(movies)
//             })
//         });
//     });
// }

// //获取演员
// function getActors(id, req, res) {
//     req.models.Movieactors.find({ movieid: id }, function (err, actorid) {
//         if (err) {
//             res.send(err);
//         } else {
//             let actorIds = []
//             for (let a of actorid) {
//                 actorIds.push({ id: a.actorid })
//             }
//             req.models.Actors.find({ or: actorIds }, function (err, actorname) {
//                 if (err) {
//                     res.send(err);
//                 } else {
//                     res.send(actorname)
//                 }
//             })
//         }
//     })
// }

// //通过类型查找电影
// app.get("/getMovieByType", function (req, res) {
//     let data = req.query.type;
//     req.models.Type.find({ name: data }, function (err, id) {
//         req.models.Type.find({ id: id[0].id }, function (err, types) {
//             types[0].getMovies(3, function (err, movies) {
//                 res.send(movies)
//             })
//         });
//     });
// });

// //讲movieid转换为id
// function movieidMakeId(movieid, year, area) {
//     let ids = []
//     for (let mid of movieid) {
//         ids.push({ id: mid.movieid });
//     }
//     ids.push({ year: year });
//     ids.push({ area: area });
//     return ids;
// }

// app.get("/getType/ByMovieId", function (req, res) {
//     let data = req.query.movieid;
//     req.models.Type_movies.find({ movies_id: data }, function (err, type) {
//         if (err) {
//             res.send(err);
//         } else {

//             req.models.Type.find({ or: type_idchengid(type) }, function (err, typename) {
//                 if (err) {
//                     res.send(err);
//                 } else {
//                     res.send(typename);
//                 }
//             })
//         }
//     })
// })
// function getTypeByMovieId(movies, req, res) {
//     for (let m of movies) {
//         req.models.Type_movies.find({ movies_id: m.id }, function (err, type) {
//             if (err) {
//                 res.send(err);
//             } else {

//                 req.models.Type.find({ or: type_idchengid(type) }, function (err, typename) {
//                     if (err) {
//                         res.send(err);
//                     } else {
//                         movies.type = typename
//                         res.send(movies);
//                     }
//                 })
//             }
//         })
//     }

// }
// function type_idchengid(type) {
//     let ids = []
//     for (let t of type) {
//         ids.push({ id: t.type_id });
//     }
//     return ids;
// }