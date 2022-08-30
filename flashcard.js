import { createRequire } from "module";
import { readFileSync } from "fs";
import { url } from "inspector";
const require = createRequire(import.meta.url);

//Objecto Carta que representa a informação relevante para flashcards de um registo da base de dados
export class Card {

    constructor(word, points) {

        this.word = word;
        this.points = points;
    }

    changePoints(value) {

        this.points = value;
    }

    addMeaningReadingExample(meaning, reading, examples) {

        this.meaning = meaning;
        this.reading = reading;
        this.examples = examples;
    }

    showCard() {

        console.log("-----------------------------------------------------------------------------");
        console.log(this.word + " (" + this.reading + ")");

        this.meaning.forEach(element => {

            console.log("   " + element);
        });

        console.log();

        this.examples.forEach(element => {

            console.log("   " + element.kanji + "\n " + element.kana + "\n " + element.english);
            console.log("*************************");
        });
        console.log("-----------------------------------------------------------------------------");
    }
}

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

        let sql = "INSERT INTO cards(id, word, points) VALUES(" + index + ", '" + element.split(" ")[0] + "', -9999)"

        db.run(sql);
        index++;
    });
}

var data = [];
export async function flashcard_init(name, max) {

    const db = new sqlite3.Database("flashcard_packs/" + name + ".db", sqlite3.OPEN_READWRITE, (err) => {

        if (err) { return console.error(err.message); }
    });

    let sql = "SELECT * FROM cards ORDER BY points ASC LIMIT " + max.toString();

    //A função preenche a variavel de scope global que é reutilizada com uma nova call desta chamada. Não é pog mas é o que é
    data = [];
    await db_get(sql, db);

    return data;
}

//Pega nos primeiros X elementos da base de dados com pontos = 0
async function db_get(query, db) {

    return new Promise(function (resolve, reject) {
        db.each(query, function (err, rows) {

            data.push(new Card(rows.word, rows.points));

            if (err) { return reject(err); }
            resolve(rows);
        });
    });
}

export function update_flashcard_points(name, replacement) {

    const db = new sqlite3.Database("flashcard_packs/" + name + ".db", sqlite3.OPEN_READWRITE, (err) => {

        if (err) { return console.error(err.message); }
    });

    let i = 0;
    for (i = 0; i < replacement.length; i++) {

        let sql = `UPDATE cards SET points = ${replacement[i].points} WHERE word = '${replacement[i].word}'`;

        db.run(sql);
    }
}