const fileUpload = require('express-fileupload');

module.exports = (app, db, fs) => {

  app.use(fileUpload());
    app.get('/api/get-statistic-section', (req, res) => {
        db.query('SELECT name, popular FROM store_section_it_mobile', (err, result) => {
            if(err) throw error;

           res.send(result) 
        });
    })
    
    app.get('/api/get-statistic/users', (req, res) => {
        // Выбираем данные из DB по ключам експо 
        db.query('SELECT token FROM wp_users', (err, result) => {
            if(err) throw err
            let arraues = []
            result.forEach((el, index, arrs) => {
                if(Object.values(el) != "") {
                    arraues.push(el)
                }
                if(index === arrs.length -1) res.send({length: arraues.length})
            })
        })
    })

  app.get('/api/get-statistic-raiting/user-raiting', (req, res) => {
    db.query('SELECT ID, user_login, glasses FROM wp_users ', (err, result) => {
      if(err) throw err;
      let ARRAY_SORT = [];
      let format = new Promise((resolve) => {
        result.forEach((e, index, arr) => {
          e.glasses = Number(e.glasses);
          ARRAY_SORT.push(e)
          if (index == arr.length - 1) {
            resolve()
          }
        })
      })
      
      let i = 0;
      // Сортируем 
      new Promise(resolve => {
        format.then(() => {
          while (i < ARRAY_SORT.length) {
            reverse(ARRAY_SORT);
            i++;
            if(i == ARRAY_SORT.length - 1) {
              resolve()
            }
          }
          
        })
      }).then((e) => {
        res.send(ARRAY_SORT);
      })
    })
    
  })

  // Загружаем аватарку пользователя
  app.post('/api/load/avatar/user', (req, res) => {

    if(!req.files) {
      res.send('req.files not found');
      return 0; 
    } 
    let filest = Object.values(req.files)[0];
    let name = filest.name.split('_')[0];

    fs.stat('./file/image/avatar', err => {

      if(err && err.code && err.code === 'ENOENT') {
        fs.mkdirSync('./file/image/avatar');
      } else {

        fs.readdir('./file/image/avatar', (error,  items) => {
          if(error) {
            res.send('photo items not found ');
            return 0;
          }
        
          if(items.length == 0) {
            saveAve(filest, name);
            return 0;
          }
          items.forEach((el, index, arr) => {
            if(el.split('_')[0] == name){
              fs.unlink(`./file/image/avatar/${el}`, (erri) => {
                if(erri) {
                  res.send('no delete photo');
                  return 0;
                }
              });
            };
            if(index == arr.length - 1) {
              saveAve(filest, name);
            }
          })
        })
      }
    })
    // Ищем аватарки с этим ID если есть удаляем
    const saveAve = (file, id) => {
      console.log(id)
      file.mv(`./file/image/avatar/${file.name}`, er => {
        if(er) {
          res.send(er);
          return 0;
        }

        // Делаем запрос в базу данных 
        db.query('UPDATE wp_users SET avatar_uri=? WHERE ID=?', [`image/avatar/${file.name}`, id],  (_, result) => {
          if(_) throw _;
          res.send('true');
        })
      });
    }
  })
}

const reverse = async (array) => {
  array.forEach((el, index, arr) => {
    if(array.length > (index + 1)) {
     
      if(array[index].glasses > array[index + 1].glasses) {
          let v = array[index];
          array[index] = array[index + 1];
          array[index + 1] = v;
      }
      
    }

  })

  return array;
}
