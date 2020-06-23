


module.exports = (app, db) => {
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
    db.query('SELECT user_login, glasses FROM wp_users ', (err, result) => {
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
      
      
     // console.log(ARRAY_SORT.length)
    })
    
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
