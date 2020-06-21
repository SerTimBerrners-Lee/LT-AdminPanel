const { Expo } = require('expo-server-sdk');
const expo = new Expo();
const axios = require('axios');

module.exports = (app, db) => {
    // Получить все уведомления
    app.get('/api/push', (req, res) => {
        db.query('SELECT * FROM push ORDER BY id DESC', (err, result) => {
            if(err) throw err;
            res.send(result)
        });
    })

    app.delete('/api/push/:id', (req, res) => {
        let id = req.params.id;
        db.query('DELETE FROM push WHERE id=?',[id], (err, result) => {
            if(err) throw err;
            res.send(result)
        });
    })

    app.delete('/api/push', (req, res) => {
        db.query('DELETE FROM push', (err, result) => {
            if(err) throw err;
            res.send({ type: 'success', message: 1, data: 'История уведомлений удалена'})
        });
    })
 
    // Добавить новое уведомление
    app.post('/api/push', (req, res) => {
        let name = req.body.name;
        let mess = req.body.message;
        let resId;
        db.query('INSERT INTO push (name, message) VALUES  (?, ?)', [name, mess], (err, result) => {
            if(err) throw err;
            resId = result.insertId
        });
        // получаем все токены у пользователей
        let arrToken = []
        db.query('SELECT token FROM wp_users', (err, result) => {
            if(err) throw err

            let somePushToken = result
            let promis = new Promise((resolve, reject) => {
                somePushToken.forEach((element, index, arr) => {
                    if (element.token.length > 3) {
                        arrToken.push(element.token)
                    }
                    if(index === arr.length - 1) resolve()
                });
            })
            
            promis.then(() => {
               
               arrToken.forEach((el, index, arr) => {
                    axios.post('https://exp.host/--/api/v2/push/send', {
                            to: el,
                            title: name,
                            body: mess
                    })
                    if(index === arr.length - 1) res.send({ name, mess, resId})  
               })
       

            })
           
        })
    })
} 