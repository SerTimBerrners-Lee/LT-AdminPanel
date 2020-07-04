//const multer  = require("multer");
const fileUpload = require('express-fileupload');

 module.exports = (app, db, fs) => {

    app.use(fileUpload());
    // ПОЛУЧАЕМ СЕКЦИИ 
     app.get('/api/get-section-store', (req, res) => {
         db.query('SELECT * FROM store_section_it_mobile', (err, result) => {
             if(err) throw err
            res.send(result);
         })
     });

     // ДОБАВЛЯЕМ СЕКЦИЮ 
     app.post('/add-section-store', (req, res, next) => {
         let name = req.body.name
         let popular = 1;
         db.query('INSERT INTO store_section_it_mobile (name, popular) VALUES (?, ?)', [name, popular], (err, result) => {
            if(err) throw err
            res.json( { name: name, data: result} );
         })
     })
     // УДАЛЯЕМ СЕКЦИЮ 
     app.get('/delete-section-store:id', (req, res) => {
         let id = req.params.id;
         console.log(id)
         db.query('DELETE FROM store_section_it_mobile WHERE id=?', [id], (err, result) => {
             if(err) throw err
             res.send(id)
         })
     })
     // Получаю секции для подсчета 
    app.get('/get-col-product-to-store', (req, res) => {
        db.query('SELECT section_id FROM store_product_it_mobile', (err, result) => {
            res.send(result)
        })
    })

     // ДОБАВЛЯЕМ НОВЫЙ ТОВАР 
    app.post("/add-product-store", function (req, res, next) {
        let name = req.body.name;
        let price = req.body.price;
        let discription = req.body.discription;
        let section_id = req.body.section_id;
        let parametr = req.body.parametr;
        var arr = [];
        if(req.files) {
            let promis = new Promise((resolve, reject) => {
                Object.values(req.files).map((el, index, array) => {
                    el.mv('./file/image/' + el.name, (err) => {
                        if(err) throw err
                    });
                    arr.push(`/image/${el.name}`)
                    if(index == array.length - 1) resolve()
                })
            })

            promis.then(() => toSend())
        }
        function toSend() {
            if(arr.length < 1) {
                db.query('INSERT INTO store_product_it_mobile (name, discription, price, photo, section_id, parametr) VALUES (?, ?, ?, ?, ?, ?)', [name, discription, price, 0, section_id, parametr], (err, result) => {
                    if(err) {
                        console.log(err)
                        return res.json({'type' : 'error', 'message': 'Ошибка при добавлении продукта'})
                    }
                    return res.send('Продукт добавлен')
                })
            } else {
                db.query('INSERT INTO store_product_it_mobile (name, discription, price, photo, section_id, parametr) VALUES (?, ?, ?, ?, ?, ?)', [name, discription, price, arr.join(' +|+ '), section_id, parametr], (err, result) => {
                    if(err) {
                        console.log(err)
                        return res.json({'type' : 'error', 'message': 'Ошибка при добавлении продукта'})
                    }
        
                    return res.send('Продукт добавлен')
                })
            }   
        }
    });
    // Получаем список товаров товар по ID для секций 
    app.get('/api/get-product-list:id', (req, res) => {
        let id = Number(req.params.id);
        db.query('SELECT * FROM store_product_it_mobile WHERE section_id=?', [id], (err, result) => {
            if(err) throw err

            res.send(result)
        })
    });
    // Получаем один товар по ID
    app.get('/api/get-product/:id', (req, res) => {
        let id = Number(req.params.id);
        db.query('SELECT * FROM store_product_it_mobile WHERE id=?', [id], (err, result) => {
            if(err) throw err

            res.send(result)
        })
    });

    app.get('/delete-product:id', (req, res) => {
        let id = Number(req.params.id);
        db.query('DELETE FROM store_product_it_mobile WHERE id=?', [id], (err, result) => {
            if(err) throw err

            res.json({ type: 'success', message: 'Продукт удален.'})
        })
    })

    // Обнулить статистику магазина 
    app.put('/delete-statistics/shops', (req, res) => {
        db.query('UPDATE store_section_it_mobile SET popular=1', (_, result) => {
            if(_) throw _
            res.send(result)
        })
    })

 }