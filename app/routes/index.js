const getUsers = require('./getUsers');
const getStatic = require('./getStatic');
const getBattle = require('./getBattle');
const getPush = require('./getPush');
const getStore = require('./getStore');
const getSettings = require('./getSettings');
const getMessage = require('./getMessage');

module.exports = (app, db, fs) => {
    getUsers(app, db, fs)
    getStatic(app, db, fs)
    getBattle(app, db)
    getPush(app, db)
    getStore(app, db, fs)
    getSettings(app, db, fs)
    getMessage(app, db, fs)
}