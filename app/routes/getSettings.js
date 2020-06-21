

module.exports = (app, db, fs) => {
    app.get('/get-weapon-list', (req, res) => {
        db.query('SELECT * FROM weapon', (err, result) => {
            if(err) throw err

            res.send(result)
        })
    })
    app.get('/get-location-list', (req, res) => {
        db.query('SELECT * FROM battl_location', (err, result) => {
            if(err) throw err

            res.send(result)
        })
    }) 
    app.post('/add-weapon-item', (req, res) => {
        let weaponName = req.body.weaponName;
        let weaponCol = Number(req.body.weaponCol) < 1 ? 1 : Number(req.body.weaponCol);
        db.query('INSERT INTO weapon (weaponName, weaponCol) VALUES (?, ?)', [weaponName, weaponCol], (err, result) => {
            if(err) throw err
            let id = result.insertId
            res.send({weaponName, weaponCol, id, type: 'weapon'})  
        })
    })
    app.post('/add-location-item', (req, res) => {
        let locationName = req.body.locationName;
        let locationParametr = req.body.locationParametr;
        db.query('INSERT INTO battl_location (locationName, locationParametr) VALUES (?, ?)', [locationName, locationParametr], (err, result) => {
            if(err) throw err
            let id = result.insertId
            res.send({locationName, locationParametr, id, type: 'location'})
        })
    });
    
    app.delete('/delete-weapon/:id', (req, res) => {
        let id = Number(req.params.id);
        db.query('DELETE FROM weapon WHERE id=? ', [id], (err, result) => {
            if(err) throw err

            res.send(result)
        })
    })
    app.delete('/delete-location/:id', (req, res) => {
        let id = Number(req.params.id);
        db.query('DELETE FROM battl_location WHERE id=? ', [id], (err, result) => {
            if(err) throw err

            res.send(result)
        })
    })

    app.get('/api/get-post/scale/', (req, res) => {
    	db.query('SELECT * FROM scale', (err, result) => {
    		if(err) throw err
    			res.send(result)
    	})
    })

    app.put('/update/post/scale', (req, res) => {
    	let title = req.body.title;
    	let text = req.body.text;

    	db.query('UPDATE scale SET title=?, text=? WHERE id=?', [title, text, 1], (err, result) => {
    		if(err) throw err

    			res.send('Раздел Акции изменен');
    	})
    })

    app.get('/api/get/restore-sectionturnir', (req, res) => {
        db.query('SELECT articles FROM turnir_teble_mobile ORDER BY id DESC LIMIT 1', (err, result) => {
            if(err) throw err
                res.send(result[0])
            
        })
    })

    app.post("/restore-sectionturnir", function (req, res, next) {
        let title = req.body.title;
        let text = req.body.text;
        var arr = [];
        if(req.files) {
            let promis = new Promise((resolve, reject) => {
                Object.values(req.files).map((el, index, array) => {
                    el.mv('./file/image/content/turnir/' + el.name, (err) => {
                        if(err) throw err
                    });
                    arr.push(`/image/content/turnir/${el.name}`)
                    if(index == array.length - 1) resolve()
                })
            })
            promis.then(() => toSend())
        } else {
            toSend()
        }

        function toSend() {
            let article = {
                title: title,
                text: text,
                image: arr
            }
            db.query('INSERT INTO turnir_teble_mobile (articles) VALUES (?)', [JSON.stringify(article)], (err, result) => {
                if(err) {
                    console.log(err)
                    return res.json({'type' : 'error', 'message': 'Ошибка при добавлении продукта'})
                }
                    return res.send('Продукт добавлен')
            }) 
        }
    });

    // Получить статью поездки 

     app.get('/api/get/restore-section/poezdci', (req, res) => {
         db.query('SELECT articles FROM poezdki_teble_mobile ORDER BY id DESC LIMIT 1', (err, result) => {
             if(err) throw err
                 res.send(result[0])
            
         })
     })

    app.post("/restore-section/poezdki", function (req, res, next) {
        let title = req.body.title;
        let text = req.body.text;
        var arr = [];
        if(req.files) {
            let promis = new Promise((resolve, reject) => {
                Object.values(req.files).map((el, index, array) => {
                    el.mv('./file/image/content/poezdki/' + el.name, (err) => {
                        if(err) throw err
                    });
                    arr.push(`/image/content/poezdki/${el.name}`)
                    if(index == array.length - 1) resolve()
                })
            })
            promis.then(() => toSend())
        } else {
            toSend()
        }

        function toSend() {
            let article = {
                title: title,
                text: text,
                image: arr
            }

            db.query('INSERT INTO poezdki_teble_mobile (articles) VALUES (?)', [JSON.stringify(article)], (err, result) => {
                if(err) {
                    console.log(err)
                    return res.json({'type' : 'error', 'message': 'Ошибка при добавлении продукта'})
                }
                    return res.send('Продукт добавлен')
            }) 
        }
    });
}