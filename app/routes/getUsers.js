const url = require('url');
const drive = require('../../google-api/index');
const loadExelFile = require('../../src/loadExelFile');
const axios = require('axios');
const cheerio = require('cheerio');
const loadBall = require('./loadBall')

module.exports = (app, db, fs) => {
    app.get('/api/users/', (req, res) => {
        db.query('SELECT ID, user_email, user_url, display_name, user_discription, user_ball, user_login FROM wp_users', (err, result) => {
            if (err) throw error;
            res.send(result);
        });
    });

    app.delete('/api/users/:id', (req, res) => {
        let id = req.params.id;
        db.query(`SELECT ID, user_email, user_url, display_name, user_discription, user_ball, user_login FROM wp_users WHERE ID = ${id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });

    app.get('/api/users/:id', (req, res) => {
        let id = req.params.id;
        db.query(`SELECT * FROM wp_users WHERE ID=${id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    })

    app.put('/api/users/s', (req, res) => {
        let id = req.body.id;
        let discription = req.body.discription;
        let ball = req.body.ball;
        db.query('UPDATE wp_users SET user_discription=?, user_ball=? WHERE ID=?', [discription, ball, id], (err, result) => {
            if (err) throw err;
            res.send('Successful!')
        })
    });
    // Загружаем таблицу по ссылки 
    app.post('/api/users/statistic', (req, res, next) => {
            let urls = url.parse(req.body.url)
            if (urls.search) {
                let id = urls.search.split('id=')[1];
                drive.drive().then(e => {
                   drive.loadFile(e, id).then(e=> {
                       res.json({ type: 'success', data: 'Файл успешно загружен на сервер' })
                   }).catch(() => {
                        res.json({ type: 'error', data: 'Ощибка при загрузке файла' })                       
                   })
                }) 
        } else {
            res.json({ type: 'error', data: 'Не правильная ссылка' })
        }
    });

    app.post('/api/users/statistic/reload', (req, res) => {
        let sheet = Number(req.body.sheet);
        let rows = {
            x: req.body.rowsX,
            y: req.body.rowsY
        };
        // Проверяем файл на существование...
        fs.stat('./file/index.xls', (err) => {
            if (!err) {
                loadExelFile(sheet, rows, db).then((e) => {
                    console.log(e)
                    res.send(e)
                })
            }
            else if (err.code === 'ENOENT') {
                res.json({ type: 'error', message: 1, data: 'Файл не найден на сервере, загрузите его.' })
            }
        });
    });

    app.get('/api/users/statistics/delete', (req, res) => {
        db.query('UPDATE wp_users SET user_ball=? ', [0], (err, result) => {
            if (err) {
                console.log(err)
                res.json({ type: 'error', message: 1, data: 'Произошла ощибка при обновлении статистики'})
            }
            res.json({ type: 'success', message: 1, data: 'Статистика успешно обнулилась'})
        });
    });


    app.get('/api/get-wp-post/:col', (req, res) => {
        let col = req.params.col;
        db.query(`SELECT post_title, ID FROM wp_posts WHERE post_type=? ORDER BY id DESC LIMIT ${col}`, ['revision'], (err, result) => {
            if(err) throw err
            res.send(result)
        })
    })

    app.get('/api/get-post-by/:id', (req, res) => {
        let id = req.params.id;

        db.query('SELECT post_content FROM wp_posts WHERE ID=?', [id], (_, result) => {
            if(_) throw _
            let photo = [];
            let data = [];
                let $ = cheerio.load(result[0].post_content);
                $('.wp-block-gallery img').each((i, elem) => {
                    photo.push($(elem).attr('src'))
                    if(i === $('.wp-block-gallery img').length - 1) {
                        data.push({text: $('p').text(), photo })
                        res.send(data)
                    }
                })
        })
    })
        // Обнновление статистики пользователей по боям
    app.get('/reload-statistic-batl-user', (req, res) => {
        
        db.query('SELECT user_url, ID FROM wp_users', (err, result) => {
            if(err) throw err
            onloadUserser(result, db, res)
        })
    })
    
    app.post('/reload-batl/statistic/balls/url', (req, res) => {
        let url = req.body.url;
        loadBall.onloadStatisticBall(url, db)
        .then(message => {
            res.send({ type: 'success', data: message})    
        })
        .catch(err => {
            res.send({type: 'error', data: err})
        })
    })
}   

const onloadUserser = (data, db, res) => {
    data.forEach((element, index, arr) => {
        if(element.user_url) {
            axios.get(`${element.user_url}`).then((res) => {
                let $ = cheerio.load(res.data)
                let dats = []
                $('#features1-108>.container>.row>.col-md-8 .player-info-row>div').find('.playerinfo-value').each((i, el)=> {
                    if(i < 11) {
                      dats.push($(el).text())
                    }
                    if(i == 11) serverReloadUserParse(dats, element.ID, db) 
                })
            }).catch((err) => {
                res.send('!!! Не можем связаться с сайтом и извлечь статистику. !!!')//'Не можем связаться с сайтом и извлечь статистику.')
            })
            if(index === arr.length - 1) {
                res.send('Статистика обновлена успешно');
                return
            } else {
                return 
            }
             
        }

        if(index === arr.length - 1) res.send('Статистика обновлена успешно');
    });
}

const serverReloadUserParse = (arr, ID, db) => {
    db.query('UPDATE wp_users SET glasses=?, win=?, plays=?, win_rate=?, killed=?, was_killed=?, hit=?, injured=?, accuracy=?, shots=?, kdr=? WHERE ID=?', [arr[0], arr[1], arr[2], arr[3],arr[4],arr[5],arr[6],arr[7],arr[8],arr[9],arr[10], ID])
}