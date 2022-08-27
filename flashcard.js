import { createRequire } from "module";
import { readFileSync } from "fs";
const require = createRequire(import.meta.url);

const sqlite3 = require("sqlite3").verbose();

export function create_flashcard_db(name) {

    const db = new sqlite3.Database("flashcard_packs/" + name + ".db", sqlite3.OPEN_READWRITE, (err) => {

        if (err) { return console.error(err.message); }
    });

    let sql = "CREATE TABLE cards(id INTEGER PRYMARY KEY, word TEXT, points INTEGER);"
    db.run(sql);
}

export function add_words_to_database(name, file) {

    const db = new sqlite3.Database("flashcard_packs/" + name + ".db", sqlite3.OPEN_READWRITE, (err) => {

        if (err) { return console.error(err.message); }
    });

    let obj = JSON.parse(readFileSync(file));

    let index = 0;
    obj.words.forEach(element => {

        let sql = "INSERT INTO cards(id, word, points) VALUES(" + index + ", '" + element.split(" ")[0] + "', 0)"

        db.run(sql);
        index++;
    });
}

export async function flashcard_init(name, max) {

    const db = new sqlite3.Database("flashcard_packs/" + name + ".db", sqlite3.OPEN_READWRITE, (err) => {

        if (err) { return console.error(err.message); }
    });

    let sql = "SELECT * FROM cards WHERE points = 0 LIMIT " + max.toString();

    var data = [];
    db.each(sql, (err, row) => {

        data.push(row);
    });

    return data;
}