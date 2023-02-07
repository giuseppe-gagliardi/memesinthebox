const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('memes.db', (err) => {
  if (err) throw err;
});

exports.listMemes = (id_creator) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Memes WHERE creator=?;';
    db.all(sql, [id_creator], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const memes = rows.map((e) => ({ id: e.id, title: e.title, image: e.image, top: e.top, center: e.center, bottom: e.bottom, font: e.font, color: e.color, visibility: e.visibility, creator: e.creator }));
      resolve(memes);
    });
  });
};

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Memes';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const memes = rows.map((e) => ({ id: e.id, title: e.title, image: e.image, top: e.top, center: e.center, bottom: e.bottom, font: e.font, color: e.color, visibility: e.visibility, creator: e.creator }));
      resolve(memes);
    });
  });
};

exports.createMeme = (meme) => {
  return new Promise((resolve, reject) => {
    newId = -1;
    db.get('SELECT MAX(id) FROM Memes', [], (err, val) => {
      if (err) {
        reject(err);
        return;
      }
      newId = val ? val['MAX(id)'] + 1 : 1;
      const sql = 'INSERT INTO Memes(id, title, image, top, center, bottom, font, color, visibility, creator) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.run(sql, [newId, meme.title, meme.image, meme.top, meme.center, meme.bottom, meme.font, meme.color, meme.visibility, meme.creator], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });

  });
};

exports.deleteMeme = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Memes WHERE id = ?';
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}
