const DT = require('luxon')

module.exports = (app, db) => {
    // Получает Активные или не активные бои
    app.get('/api/battle/:bool', (req, res) => {
        let bool = req.params.bool;
        if(bool == 'true') {
            db.query('SELECT * FROM battl WHERE active=? ORDER BY id DESC', [true], (err, result) => {
                if(err) throw err;
                res.send(result)
            });
        } else if(bool == 'false') {
            db.query('SELECT * FROM battl WHERE active=? ORDER BY id DESC', [false], (err, result) => {
                if(err) throw err;
                res.send(result)
            });
        }
    });
    
    app.get('/api/battle/get-battl/:id', (req, res) => {
        let id = req.params.id;
        
        db.query('SELECT * FROM battl WHERE id=?', [id], (err, result) => {
            if(err) throw err
            
            res.send(result)
        })
    })
    
    // Создает бой
    app.post('/api/battle', (req, res) => {
        let location_name = req.body.location_name;
        let date = req.body.date;
        let time = req.body.time;
        let location_adress = req.body.location_adress;
        let locationParametr = req.body.locationParametr;
        let phone = req.body.phone;
        let discription = req.body.discription;
        let col_places = req.body.col_places;
        let weapon = req.body.weapon;
        let active = true;   
        let date_create =  DT.DateTime.local()
        
        db.query('INSERT INTO battl (location_name, date, time, location_adress, locationParametr,  phone, discription, col_places, active, weaponList) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [location_name, date,time,location_adress, locationParametr,  phone,discription,col_places,active, weapon], (err, result) => {
            if(err) throw err;
            let weaponList = weapon
            res.send({location_name, date,time,location_adress, locationParametr, phone,discription, col_places, active, date_create, weaponList})
        });
    });

    // Обновляет бой
    app.put('/api/update-batle/:id', (req, res) => {
        let id = req.params.id;
        let location_name = req.body.location_name;
        let date = req.body.date;
        let time = req.body.time;
        let locationParametr = req.body.locationParametr;
        let location_adress = req.body.location_adress;
        let phone = req.body.phone;
        let discription = req.body.discription;
        let col_places = req.body.col_places;
        let current_places = req.body.current_places;
        let weapon = req.body.weapon;

        db.query('UPDATE battl SET location_name=?, date=?, time=?, location_adress=?, locationParametr=?,  phone=?, discription=?, col_places=?, current_places=?, weaponList=? WHERE id=?', [location_name, date,time,location_adress, locationParametr, phone,discription, col_places, current_places, weapon, id], (err, result) => {
            if(err) throw err;
            res.json({type: 'success', message: 'Бой обновлен'})
        });
    });

    // Обновляет бой - АКТИВНЫЙ/НЕ АКТИВНЫЙ
    app.put('/api/battle/:id/:bool', (req, res) => {
        let id = req.params.id;
        let bool;
        req.params.bool == 'false' ? bool = true : bool = false
        db.query('UPDATE battl SET active=? WHERE id=?', [bool, id], (err, result) => {
            if(err) throw err;
            res.send(result)
        });
    });

    // Удаляет бой 
    app.delete('/api/battle/:id', (req, res) => {
        let id = req.params.id;
        db.query('DELETE FROM battl WHERE id=?', [id], (err, result) => {
            if(err) throw err;
            res.send(result)
        });
    })
    // Удаляет все бои
    app.delete('/api/battle/delete/all', (req, res) => {
        db.query('DELETE FROM battl WHERE active=?', [false], (err, result) => {
            if(err) throw err;
            res.send({ type: 'success', message: 1, data: 'Все не активные бои удалены' })
        });
    })


    // Пользователь подписывается на бой
    app.post('/api/subscribe-batll', (req, res) => {
        let body = JSON.parse(JSON.stringify(req.body))
        let data;
        Object.keys(body).map((obj) => {
            data = JSON.parse(obj);
        })
        let login = data.login;
        let idUser = data.idUser;
        let idBattl = data.idBattl;
        let weapon = data.weapon;

        db.query('SELECT * FROM battl WHERE id=? ', [idBattl], (err, result) => {
            if(err) throw err
            let weaponList = JSON.parse(result[0].weaponList)
            let promis = new Promise((resolve, reject) => {
                Object.entries(weaponList).map((el, index, arr) => {
                    if(weapon == el[0] || el[1] > 0) {
                       return resolve()
                    } else {
                        return res.json({type: 'error', message: 'Выбранное оружие занято, выберети другое'})
                    }
                })
            })

            promis.then(() => {
                if(Number(result[0].current_places) < Number(result[0].col_places)) {
                    let active = Number(result[0].col_places) - Number(result[0].current_places) == 1 ? 0 : 1;
                    return UpdateBattle(res, db, login, idUser, idBattl, weapon, result[0].weaponList, active, Number(result[0].current_places), result[0].login_player)
                } else {
                    return res.json({type: 'error', message: 'Свободных мест на этот бой больще нет'})
                }
            })
        })
    })
    // Отписываемся от бой
    // Для этого нужно получить бой, найти в нем текущего пользователя
    // Найти и сохранить оружие выбранное этим пользователем 
    // 1. Удалить пользователя
    // 2. Уменьшить текушее число подписавщихся 
    // 3. Найти оружие в батле и увеличть его если оно есть, если нет - создать 
    
    app.post('/api/on-subscribe-batll', (req, res) => {
        let body;
        if(req.body) {
            body = JSON.parse(JSON.stringify(req.body))
        } else {
            res.send('ss')
            return ; 
        }
        
        let promis = new Promise((resolve, reject) => {
            Object.keys(body).map((obj) => {
                resolve(JSON.parse(obj));
            })
        })

        promis.then((data) => {
            db.query('SELECT * FROM battl WHERE id=?', [data.idBatl], (err, result) => {
                if(err) throw err 
                let curPlaces = result[0].current_places;
                
                let newPlayer = [];
                let OldWeapon;
                
                Object.keys(JSON.parse(result[0].login_player)).map((user, index, arr) => {
                    if(data.login !== user) {
                        newPlayer.push(user);
                    }
                    if(index === arr.length - 1) {
                        OldWeapon = JSON.parse(result[0].login_player)[`${data.login}`].weapon;
                        let weaponList =  result[0].weaponList ? JSON.parse(result[0].weaponList) : null;

                        if(OldWeapon) {
                            if(weaponList) {
                                // Нахожим оружие и увеличиваем его если нет - создаем
                                weaponList[`${OldWeapon}`] ? weaponList[`${OldWeapon}`] = weaponList[`${OldWeapon}`] + 1 : weaponList[`${OldWeapon}`] = 1
                            } else {
                                // Создаем новое оружие
                                weaponList[`${OldWeapon}`] = 1
                            }
                            db.query("UPDATE battl SET weaponList=?, login_player=?, current_places=? WHERE id=?", [JSON.stringify({...weaponList}), JSON.stringify({...newPlayer}), curPlaces - 1, result[0].id], (err, result) => {
                                if(err) throw  err 
                                res.send('ok')
                            })
                        } else {
                             
                            db.query("UPDATE battl SET weaponList=?, login_player=?, current_places=? WHERE id=?", [JSON.stringify({...weaponList}), JSON.stringify({...newPlayer}), curPlaces - 1, result[0].id], (err, result) => {
                                if(err) throw  err 
                                res.send('ok')
                            })
                        }
                    }
                });
             })
        })


    })
}


const UpdateBattle = (res, db, login, idUser, idBattl, weapon, weaponList, active, places, players) => {
    let dataPlayers;
    let current_places = places + 1;
    // Получаем полный список 
    let newWeapon = JSON.parse(weaponList);

    if(players) {
        let data = JSON.parse(players)
        data[login] = {idUser, weapon}
        dataPlayers = data
    } else {
        let data = {};
        data[login] = { idUser, weapon }
        dataPlayers = data;
    }

    if(weapon) {
        newWeapon = {}
        var promis = new Promise((resolve, reject) => {
            let dataWeapon = JSON.parse(weaponList);
            console.log(dataWeapon, 'Data Weapon Map')
                Object.entries(dataWeapon).map((el, index, arr) => {
                    if(el[0] !== weapon) {
                        newWeapon[el[0]] = el[1]
                    } else if(el[1] - 1 == 0){
                        // Удаляем оружие
                    } else {
                        newWeapon[el[0]] = el[1] - 1
                    }
                    if(index === arr.length -1) resolve()
                })
        })
        promis.then(() => {
            update(newWeapon, dataPlayers, current_places)
        })
    } else {
        update(newWeapon, dataPlayers, current_places)
    }

    function update(newWeapon, dataPlayers, current_places) {
        db.query('UPDATE battl SET login_player=?, current_places=?, weaponList=?, active=? WHERE id=?', [JSON.stringify(dataPlayers), current_places, JSON.stringify(newWeapon), active, idBattl], (err, result) => {
            if(err) throw err
            res.send({type: 'success', message: 'Вы зарегестрировались на бой'})
        })
    }

}