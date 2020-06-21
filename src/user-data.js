const passwordHash = require('password-hash')


const signUser = (db, login, pass) => {
    return new Promise((res, rej) => {
        db.query('SELECT * FROM user_lt_mobile WHERE  login=?', [login], (err, result) => {
            if(err) return rej('Ошибка проверки пользователя')
            if(result.length < 1) return rej('Пользователь не найден')
            if(result[0].password) {
               let verify = passwordHash.verify(pass, result[0].password);
               if(verify) { 
                   if(result[0].activate) {
                    return res(result[0])
                   }
               } else {
                   return rej('Пароль не верный')
               }
            } else {
                return rej('Пользователь не найден')
            }
        })
    })
}
const registerUser = (db, login, pass, email) => {
    return new Promise((restor, rej) => {
        var password = passwordHash.generate(pass)
        db.query('SELECT id FROM user_lt_mobile WHERE  login=?', [login], (err, res) => {
            if(err) return rej('Ошибка проверки пользователя')
            if(Object.keys(res).length > 0) {
                return rej('Пользователь уже существует');
            }  else {
                db.query('INSERT INTO user_lt_mobile (login, password, email) VALUES  (?, ?, ?)', [login, password,email], (errs, _) => {
                    if(errs) {
                        return rej('Ошибка добавления пользователя ')
                    }
                    return restor('Ожидайте подтверждение администратора');
                })

            }
        })
    })
} 

module.exports = {
    registerUser: registerUser, 
    signUser: signUser
}