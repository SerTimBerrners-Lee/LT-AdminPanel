const QR = require('qrcode');

module.exports = (app, db, fs) => {
    
    app.post('/api/new-product-message', (req, res) => {
        let body = JSON.parse(JSON.stringify(req.body))
        console.log(body)
        let id;
        let products;
        let login;
        let ball_user;
        let price;
        Object.keys(body).map(obj => {
            id = JSON.parse(obj).id
            login = JSON.parse(obj).login
            products = JSON.parse(obj).products
            ball_user = JSON.parse(obj).ball_user
            price = JSON.parse(obj).price

            for (const iterator of JSON.parse(products)) {
                db.query('SELECT popular FROM store_section_it_mobile WHERE id=?', [iterator.idSection], (err, result) => {
                    if(err) throw err
                    let popular = result[0].popular;

                    db.query('UPDATE store_section_it_mobile SET popular=? WHERE id=?', [popular + 1, iterator.idSection], (_, r) => {
                        if(_) throw _
                        console.log(r)
                    })
                }) 
            } 
        })

        let r = Number(Math.floor(Math.random() * Math.floor(34234234234)));
        QR.toFile(`./file/qrcode/${r}.png`, `http://lt-admin.uxp.ru:8000/api/render/qrcode/${r}`)
        // // Обновить баллы у пользователя    
        db.query('UPDATE wp_users SET user_ball=? WHERE ID = ?', [ball_user, id], (err, result) => {
            if(err) throw err
            return;
            
        })
        // Добавляем новую запись в таблицу покупок 
        db.query(`INSERT INTO purchase_it_mobile (purchase, id_user, login_user, qrcode, price, random) VALUES (?, ?, ?, ?, ?, ?)`, [products, id, login, `/qrcode/${r}.png`, price, r], (err, result) => {
            if(err) throw err
            res.send(`/qrcode/${r}.png`)
        })
    })

    app.get('/api/list-product-message', (req, res) => {
        db.query('SELECT * FROM purchase_it_mobile', (err, result) => {
            if(err) throw err
            res.send(result)
        })
    })

    app.delete('/api/delete-product-message/:id', (req, res) => {
        let id = req.params.id
        db.query('DELETE FROM purchase_it_mobile WHERE id=?', [id], (err, result) => {
            if(err) throw err

            res.send('Запись удалена')
        })
    })

    app.get('/api/render/qrcode/:id', (req, res) => {
        let id = req.params.id;
        db.query('SELECT * FROM purchase_it_mobile WHERE random=?', [id], (err, result) => {
            if(err) throw err
            let dateTime = JSON.stringify(result[0].time).split('"')[1];
            res.render('qrender', {
                login_user: result[0].login_user,
                id_user: result[0].id_user,
                purchase: result[0].purchase,
                price: result[0].price,
                date: dateTime.split('T')[0],
                time: dateTime.split('T')[1].split('.')[0]
            })
        })
    })

    // уведомления 
    app.post('/api/user/token', (req, res) => {
        let body = JSON.parse(JSON.stringify(req.body))
        let id;
        let token;
            Object.keys(body).map(el => {
                let data = JSON.parse(el)
                token = data.data;
                id = data.id
                db.query('UPDATE wp_users SET token=? WHERE id=?', [token, id], (err, result) => {
                    if(err) throw err
                    res.send(result)
                })
            })
    })

    // Изменения логина 

    app.post('/api/changes-user/login', (req, res) => {
        let body = JSON.parse(JSON.stringify(req.body))
        Object.keys(body).map(el => {
            let data = JSON.parse(el)
            // Проверяем логин на существование в базе данных 
            db.query('SELECT user_login FROM wp_users WHERE user_login=?', [data.value], (err, result) => {
                if(err) throw err
                if(result.length > 0) {
                    return res.send('Такой логин уже зарегестрирован')
                }
                db.query('SELECT user_id FROM user_changes WHERE user_id=?', [data.user], (err, result) => {
                    if(err) throw err
                    if(result.length > 0) {
                        return res.send('Дождитесь одобрения предыдущего запроса на изменение')
                    }

                    db.query('INSERT INTO user_changes (login, discription, user_id, other_login, other_discription) VALUES (?, ?, ?, ?, ?)', [data.value, data.discription, data.user, data.other_login, data.other_discription], (err, result) => {
                        if(err) throw err
                        return res.send('Ждите одобрение администратора')
                    })
                })
            })

        })
    })
    app.post('/api/changes-user/discription', (req, res) => {
        let body = JSON.parse(JSON.stringify(req.body))
        Object.keys(body).map(el => {
            let data = JSON.parse(el)

            db.query('SELECT user_id FROM user_changes WHERE user_id=?', [data.user], (err, result) => {
                if(err) throw err
                if(result.length > 0) {
                    return res.send('Дождитесь одобрения предыдущего запроса на изменение')
                }
                db.query('INSERT INTO user_changes (discription, login, user_id, other_login, other_discription) VALUES (?, ?, ?, ?, ?)', [data.value, data.login, data.user, data.other_login, data.other_discription], (err, result) => {
                    if(err) throw err
                    return res.send('Ждите одобрение администратора на изменение биографии')
                })
            })
        })
    })

    app.get('/api/changes-user/all', (req, res) => {
        db.query('SELECT * FROM user_changes', (_, result) => {
            if(_) throw _

            res.send(result)
        })
    })

    app.post('/api/changes-user/true', (req, res) => {
        let login = req.body.login;
        let discription = req.body.discription;
        let id = req.body.id;
        let postId = Number(req.body.postId);

        db.query('DELETE FROM user_changes WHERE id=?', [postId], (err, resulter) => {
            if(err) throw err
            db.query('UPDATE wp_users SET user_login=?, user_discription=? WHERE ID=?', [login, discription, id], (_, result) => {
                if(_) throw _ 
                res.send(result)
            })  
        })
    }),
    app.delete('/api/changes-user/false', (req, res) => {
        let id =  Number(req.body.postId);
        db.query('DELETE FROM user_changes WHERE id=?', [id], (err, result) => {
            if(err) throw err
            
            res.send(result)
        })
    })
}       