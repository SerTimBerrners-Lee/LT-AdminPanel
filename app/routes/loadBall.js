const cheerio = require('cheerio');
const axios = require('axios');

const onloadStatisticBall = (url, db) => {
    
    return new Promise((resolve, reject) => {
    
        let teamOne = [];
        let teamTwo = [];
        let vins  = {
            one: [],
            two: []
        }
        let bool = false;
        
        
    axios.get(url)
    .then((res) => {
        
        let $ = cheerio.load(res.data);
        $('tbody').children().each((index, element) => {
            if($(element).attr('style')) {
                bool = !bool
                return 
            } else if(bool){
                let user = $(element).find('a')
                let lvl =  Number(element.children[2].children[0].data);
                let href = $(user).attr('href');
                let nikename = $(user).text().trim()
                teamOne.push({href: href, nikename: nikename, lvl :lvl})
            } else {
                let user = $(element).find('a')
                let lvl =  Number(element.children[2].children[0].data);
                let href = $(user).attr('href');
                let nikename = $(user).text().trim()
                //{href: href, nikename: nikename, lvl :lvl}
                teamTwo.push({href: href, nikename: nikename, lvl :lvl})
            }
            if(index === $('tbody').children().length - 1) {
                let count = teamOne.length + teamTwo.length;
                let teamOneVins, teamTwoVins;
                if(count <= 6) {
                    teamOneVins = 1;
                    teamTwoVins = 1;
                } else if(count > 6 && count <= 8) {
                    teamOneVins = 2;
                    teamTwoVins = 2;
                } else {
                    teamOneVins = 3;
                    teamTwoVins = 3;
                }
                
                for(let i = 0; i < teamOneVins; i ++) {
                    let max = null;
                    
                    teamOne.map((team, indexTeam, arrTeam) => {
                        if(!max) { 
                            max = team
                        } else if(max.lvl < team.lvl) {
                            max = team
                        }
                        
                        if(indexTeam === arrTeam.length - 1) {
                            teamOne = teamOne.filter(e => e.nikename !== max.nikename)
                            vins.one.push(max)
                        }
                    })
                    
                    if(i == teamOneVins -1) {
                        parseBallUser(vins.one, db)
                    }
                    
                }
                
                for(let i = 0; i < teamTwoVins; i ++) {
                    let max = null;
                    
                    teamTwo.map((team, indexTeam, arrTeam) => {
                        if(!max) { 
                            max = team
                        } else if(max.lvl < team.lvl) {
                            max = team
                        }
                        
                        if(indexTeam === arrTeam.length - 1) {
                            teamTwo = teamTwo.filter(e => e.nikename !== max.nikename)
                            vins.two.push(max)
                        }
                    })
                    
                    if(i == teamTwoVins -1) {
                       
                        parseBallUser(vins.two, db).then((resss) =>  resolve(resss))
                    }
                    
                }
            }
        })
        }).catch(err => reject({data: 'не можем связаться с сайтом статистики'}))  
    })
   
}

const parseBallUser = (arrVins, db) => {
    return new Promise((resolve, reject) => {
        arrVins.forEach((element, index, arr) => {
            axios.get(element.href)
            .then(res => {
                let $ = cheerio.load(res.data)
                let arrayItems = []
                
                $('.mbr-article .player-info-row').find('div').each((indexDiv, div) => {
                    arrayItems.push($(div).find('strong').text())
                    if(indexDiv === $('.mbr-article .player-info-row').find('div').length - 1) {
                        let ball = Math.round((Number(arrayItems[1]) + Number(arrayItems[3]) / 2 ) / Number(arrayItems[2]))
                        db.query('SELECT user_ball FROM wp_users WHERE user_login=?', [element.nikename], (err, result) => {
                            if(err) {
                                throw err; 
                            }
                            if(result[0]) {
                                let currentBall = result[0].user_ball;  
                                db.query('UPDATE wp_users SET user_ball=? WHERE user_login=?', [Math.round(ball) + Number(currentBall), element.nikename], (_, r) => {
                                    if(_) throw _
                                    resolve('Успешно обновлено')
                                })  
                            } else { 
                                resolve('Успешно обновлено')
                            }        
                            
                        })
                    }
                })
            })
        })  
    })

}


module.exports = {
    onloadStatisticBall 
}