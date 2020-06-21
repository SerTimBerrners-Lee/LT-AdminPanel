


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
}
