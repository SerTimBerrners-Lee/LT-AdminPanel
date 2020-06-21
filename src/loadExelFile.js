const xlsx = require('xlsx-populate');

const loadExelFile = function (sheet, rows, db) {
    return new Promise((result, reject) => {
        xlsx.fromFileAsync('./file/index.xls').then(workbook => {
                let columnX = workbook.sheet(Number(sheet - 1)).column(rows.x).columnNumber()
                let columnY = workbook.sheet(Number(sheet -1 )).column(rows.y).columnNumber()
                value = workbook.sheet(Number(sheet - 1)).usedRange().value();
                let row = {
                    x: columnX,
                    y: columnY
                }
                arrFilter(value, row, db).then(text => {
                    result(text)
                    console.log(text)
                });
        }) 
    })
}

// Фильтруем маасив и отправляем для проверки на сервер
function arrFilter(rows, pos, db) {
    return new Promise(resolve => {
        rows.forEach((el, index, arr) => {
            if(el[pos.x] == undefined || null) {
                resolve('Статистика обновлена')
                return;
            }
            
            uploadFileToServer(el[pos.x - 1], el[pos.y - 1], db)
        })
    })
}

function uploadFileToServer(rowNik, rowBall, db) { 
    db.query('UPDATE wp_users SET user_ball=?  WHERE user_login=?', [rowBall, rowNik], (err, result) => {
        if (err) throw err;
    })
}

module.exports = loadExelFile;