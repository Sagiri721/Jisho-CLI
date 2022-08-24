import JishoAPI from "unofficial-jisho-api";
import { text } from "./utils.js"
import inquirer from 'inquirer';
import axios from "axios";
import { message } from "prompt";

const jisho = new JishoAPI();

async function kanji_meaning() {

    let ans = await inquirer.prompt([{
        name: 'name',
        message: "Kanji? "
    }]);

    let kanji_data = await jisho.searchForKanji(ans.name);

    if (kanji_data.found) {


        console.log("KANJI DETAILS");
        console.log("############################################################################################################################################");
        console.log("#　Kanji: " + ans.name);
        console.log("#　Reading: \n" + "#　音読み　⊳ " + kanji_data.onyomi + "\n#　訓読み　⊳ " + kanji_data.kunyomi);
        console.log("#　Meaning: " + kanji_data.meaning);
        console.log("#　Level: JLPT " + kanji_data.jlptLevel + " | Newspaper frequency " + kanji_data.newspaperFrequencyRank + " | Taught in " + kanji_data.taughtIn);
        console.log("#　Strokes: " + kanji_data.strokeCount);
        console.log("############################################################################################################################################");

    } else {

        console.log("----------------------------------------------------------------------------------------------------");
        console.log("Kanji not found");
        console.log("----------------------------------------------------------------------------------------------------");
    }
}

async function word_search() {

    let ans = await inquirer.prompt([{
        name: 'name',
        message: "Word? "
    }]);

    //Perform a self search from the json web api
    const url = "https://jisho.org/api/v1/search/words?keyword=" + ans.name;
    const response = await (await axios.get(url)).data;

    //Get first response
    var word_data = response["data"][0];

    if (true) {

        try {
            word_data.slug;

            console.log("WORD DETAILS");
            console.log("############################################################################################################################################");
            console.log("#  Word: " + ans.name + "\n#  " + (ans.name + word_data.is_common ? "\n#  Common Word" : ""));
            console.log("#  Common form: " + word_data.slug);
            console.log("#  JLPT level: " + (word_data.jlpt.length != 0 ? word_data.jlpt[0] : "NOT IN THE JLPT"));

            console.log("#  Readings: ");
            word_data.japanese.forEach(element => {

                console.log("#    > Kanji conjugation: " + element.word + " | Reading: " + element.reading);
            });

            console.log("#  Meaning: ");
            word_data.senses.forEach(element => {

                console.log("#     " + element.english_definitions);
            })
            console.log("############################################################################################################################################");

        } catch (error) {

            console.log("----------------------------------------------------------------------------------------------------");
            console.log("Word not found");
            console.log("----------------------------------------------------------------------------------------------------");
        }
    }
}

async function list_kanji() {

    console.log("\n----------------------------------------------------------------------------------------------------");

    const ans = await inquirer.prompt([{
        name: 'name',
        message: "What JLPT? "
    }]);

    const url = "";
}

async function sentence_search() {

    let ans = await inquirer.prompt([{
        name: 'name',
        message: "Word to contain in sentences:  "
    }]);

    const sentence_data = await jisho.searchForExamples(ans.name);

    if (sentence_data.results.length == 0) {

        console.log("----------------------------------------------------------------------------------------------------");
        console.log("No sentences were found");
        console.log("----------------------------------------------------------------------------------------------------");
        return;
    }

    console.log("############################################################################################################################################");

    sentence_data.results.forEach(element => {

        console.log(element.kanji + "\n " + element.kana + "\n " + element.english);
        console.log("----------------------------------------------------------------------------------------------------");
    })

    console.log("############################################################################################################################################");
}

console.clear();
console.log(text);
console.log("----------------------------------------------------------------------------------------------------");

async function app_loop() {

    while (true) {

        console.log(`//Search//
        (0) 漢字検索　～　Kanji search
        (1) 語彙検索　～　Vocab search
        (2) 文章検索　～　Sentence search

//List//
        (3)　漢字リスト　～　Kanji list
        (4)　語彙リスト　～　Vocab list

//Study//
        (5)  Study JLPT with examples　～　JLPTを例文で学んで

//Other//
        (6)  援助　～　Help
        (7)  終了　～　Exit
        `);

        const ans = await inquirer.prompt([
            {
                name: 'option',
                message: 'Input an option: '
            },
        ]);

        let answer = parseInt(ans.option);

        if (answer >= 0 && answer <= 7) {

            switch (answer) {
                case 0:

                    //Kanji meaning
                    await kanji_meaning();
                    break;
                case 1:

                    //Word meaning
                    await word_search();
                    break;
                case 2:

                    //Sentence from word
                    await sentence_search();
                    break;
                case 3:

                    await list_kanji();
                    break;
                case 4:

                    break;
                case 5:

                    break;
                case 6:

                    break;
                case 7: return;
            }

        } else {

            console.log("Bad input");
        }
    }
}

app_loop();

