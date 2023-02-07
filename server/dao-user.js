const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

const db = new sqlite.Database('memes.db', (err)=>{
    if(err) throw err;
});

// DAO operations for validating users

exports.getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err)
                reject(err); // DB error
            else if (row === undefined)
                resolve(false); // user not found
            else {
                const user = {id:row.id, username: row.username}
                bcrypt.compare(password, row.password).then(result => {
                    if (result) // password matches
                        resolve(user);
                    else
                        resolve(false); // password not matching
                }).catch((e) => {reject(e);})
            }
        });
    });
};

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
          if (err) 
            reject(err);
          else if (row === undefined)
            resolve({error: 'User not found.'});
          else {
            const user = {id: row.id, username: row.username}
            resolve(user);
          }
      });
    });
};