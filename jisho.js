import JishoAPI from "unofficial-jisho-api";
import { text, help } from "./utils.js"
import inquirer from 'inquirer';
import axios from "axios";
import { getSettings } from "./settings.js";
import { readFileSync, readdirSync } from "fs"
import { flashcard_init, Card, update_flashcard_points } from "./flashcard.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

var colors = require("colors");

const jisho = new JishoAPI();
const settings = getSettings();

const actions = {

    "0": async function () { await kanji_meaning(); },
    "1": async function () { await word_search(); },
    "2": async function () { await word_search_japanese(); },
    "3": async function () { await sentence_search() },
    "4": async function () { await list_kanji() },
    "5": async function () { await list_words() },
    "6": async function () { await jlpt_sentence_words() },
    "7": async function () { await show_flashcards() },
    "9": async function () { help(); },
    "10": async function () { print_settings(); }
}

function print_settings() {

    console.log("\nCurrent session's settings:".magenta);
    console.log(
        "############################################################################################################################################\n"
            .magenta);

    console.log(
        ("Maximum of words showed in JLPT study and vocabulary List: " + settings.max_words)
            .magenta);
    console.log(
        ("Maximum of words kanjis on kanji list: " + settings.max_kanji)
            .magenta);
    console.log(
        ("Clears screen after one program cycle? " + settings.clear_after_search)
            .magenta);
    console.log(
        ("Maximum number of sentences showed on JLPT study (doesn't change efficiency) (shouldn't be above 17 for safety reasons): " + settings.max_sentence_per_word)
            .magenta);
    console.log(
        ("Number of flashcard per day: " + settings.flashcards_per_day)
            .magenta);

    console.log(
        "\n############################################################################################################################################"
            .magenta);
    console.log("*restart the app when settings are changed*\n".magenta);
}

async function kanji_meaning() {

    let ans = await inquirer.prompt([{
        name: 'name',
        message: "Kanji? "
    }]);

    let kanji_data = await jisho.searchForKanji(ans.name);

    if (kanji_data.found) {

        show_kanji(ans.name, kanji_data);
    } else {

        console.log("----------------------------------------------------------------------------------------------------");
        console.log("Kanji not found");
        console.log("----------------------------------------------------------------------------------------------------");
    }
}

async function word_search() {

    let ans = await input("Word? ");

    //Perform a self search from the json web api
    const url = "https://jisho.org/api/v1/search/words?keyword=" + ans;
    const response = await (await axios.get(url)).data;

    //Get first response
    var word_data = response["data"][0];

    try {
        word_data.slug;

        show_word(ans.name, word_data);

    } catch (error) {

        console.log("----------------------------------------------------------------------------------------------------".red);
        console.log("Word not found".red);
        console.log("----------------------------------------------------------------------------------------------------".red);
    }

}

async function word_search_japanese() {

    let ans = await input("Word? ");

    let words_search = await jisho.searchForPhrase(ans);

    try {

        let word_data = words_search.data[0];
        word_data.slug;

        show_word(ans, word_data);

    } catch (error) {

        console.log("----------------------------------------------------------------------------------------------------".red);
        console.log("Word not found".red);
        console.log("----------------------------------------------------------------------------------------------------".red);
        console.error(error);
    }

}

async function list_kanji() {

    console.log("\n----------------------------------------------------------------------------------------------------");

    const ans = await input("What JLPT(1-5)? ");

    console.log("\n----------------------------------------------------------------------------------------------------");

    try {

        let option = parseInt(ans);

        if (option > 5 || option < 1) {

            console.log("----------------------------------------------------------------------------------------------------".red);
            console.log("Invalid JLPT level".red);
            console.log("----------------------------------------------------------------------------------------------------".red);
            return;
        }

        const data = await get_kanji_jlpt(option.toString());
        var offset = await input("Offset? ");

        search_op:
        if (!isNaN(offset)) {

            offset = parseInt(offset);
        } else {

            for (let i = 0; i < data.kanjis.length; i++) {

                if (data.kanjis[i].split(" ")[0] == offset) {

                    offset = i;
                    break search_op;
                }
            }

            console.log("No offset match was found".red);
            return;
        }

        if ((offset + settings.max_kanji) >= data.kanjis.length) {
            console.log("----------------------------------------------------------------------------------------------------".red);
            console.log("Invalid offset".red);
            console.log("----------------------------------------------------------------------------------------------------".red);
            return;
        }

        for (let i = offset; i < offset + settings.max_kanji; i++) {

            let response = await jisho.searchForKanji(data.kanjis[i]);
            show_kanji(data.kanjis[i], response);
        }

    } catch (error) {

        console.log("----------------------------------------------------------------------------------------------------".red);
        console.log("Error processing".red);
        console.log("----------------------------------------------------------------------------------------------------".red);
        console.error(error.message);
    }
}

async function list_words() {

    console.log("\n----------------------------------------------------------------------------------------------------");

    const ans = await input("What JLPT(1-5)? ");
    console.log("\n----------------------------------------------------------------------------------------------------");

    try {

        let option = parseInt(ans);

        if (option > 5 || option < 1) {

            console.log("----------------------------------------------------------------------------------------------------".red);
            console.log("Invalid JLPT level".red);
            console.log("----------------------------------------------------------------------------------------------------".red);
            return;
        }

        const data = await get_words_jlpt(option.toString());
        var offset = await input("Offset? ");

        search_op:
        if (!isNaN(offset)) {

            offset = parseInt(offset);
        } else {

            for (let i = 0; i < data.words.length; i++) {

                if (data.words[i].split(" ")[0] == offset) {

                    offset = i;
                    break search_op;
                }
            }

            console.log("No offset match was found".red);
            return;
        }

        if ((offset + settings.max_words) >= data.words.length) {
            console.log("----------------------------------------------------------------------------------------------------".red);
            console.log("Invalid offset".red);
            console.log("----------------------------------------------------------------------------------------------------".red);
            return;
        }

        for (let i = offset; i < offset + settings.max_words; i++) {

            let keyword = data.words[i].split(" ")[0];

            let response = await jisho.searchForPhrase(keyword);
            let word_data = response['data'][0];

            //console.log(response);
            show_word(keyword, word_data);
        }

    } catch (error) {

        console.log("----------------------------------------------------------------------------------------------------".red);
        console.log("Error processing".red);
        console.log("----------------------------------------------------------------------------------------------------".red);
        console.error(error.message);
    }
}

async function sentence_search() {

    let ans = await input("Word to contain in sentences: ");

    const sentence_data = await jisho.searchForExamples(ans);

    if (sentence_data.results.length == 0) {

        console.log("----------------------------------------------------------------------------------------------------");
        console.log("No sentences were found");
        console.log("----------------------------------------------------------------------------------------------------");
        return;
    }

    console.log("############################################################################################################################################");

    show_sentence(sentence_data.results);

    console.log("############################################################################################################################################");
}

async function jlpt_sentence_words() {

    console.log("\n----------------------------------------------------------------------------------------------------");

    const ans = await input("What JLPT(1-5)? ");

    console.log("\n----------------------------------------------------------------------------------------------------");

    try {

        let option = parseInt(ans);

        if (option > 5 || option < 1) {

            console.log("----------------------------------------------------------------------------------------------------".red);
            console.log("Invalid JLPT level".red);
            console.log("----------------------------------------------------------------------------------------------------".red);
            return;
        }

        let words_showing = settings.max_words;

        console.log("Displaying words from the (offset)th term to the (offset + " + words_showing + ")th term");
        const offsetinq = await input("Offset? ");

        var offset = parseInt(offsetinq);

        //Get word list
        const words_obj = await get_words_jlpt(option.toString());


        if ((offset + settings.max_words) >= words_obj.words.length) {
            console.log("----------------------------------------------------------------------------------------------------".red);
            console.log("Invalid offset".red);
            console.log("----------------------------------------------------------------------------------------------------".red);
            return;
        }

        const sentences_show = settings.max_sentence_per_word;

        let i = 0;
        for (i = 0; i < words_obj.words.length; i++) {

            if (i >= offset) {

                if (i == (offset + words_showing)) { return; }

                //display words
                console.log("----------------------------------------------------------------------------------------------------");
                console.log((i + 1).toString() + ": " + words_obj.words[i]);
                //Show sentences
                let keyword = words_obj.words[i].split(" ")[0];

                await jisho.searchForExamples(keyword).then(sentence => {

                    let j = 0;
                    for (j = 0; j < sentences_show; j++) {

                        try {

                            const arr = sentence["results"][j];
                            console.log();
                            console.log(arr.kanji + "\n " + arr.kana + "\n " + arr.english);

                        } catch (error) { }
                    }
                });

                console.log("----------------------------------------------------------------------------------------------------\n");
            }
        }

    } catch (error) {
        console.log("----------------------------------------------------------------------------------------------------".red);
        console.log("Error processing".red);
        console.log("----------------------------------------------------------------------------------------------------".red);

        console.error(error);
    }

}

async function show_flashcards() {

    console.log("\n----------------------------------------------------------------------------------------------------");
    console.log("FLASH CARDS");

    const flashfolder = readdirSync("flashcard_packs");
    var databases = [];

    let i = 0, ii = 0;
    for (i = 0; i < flashfolder.length; i++) {

        if (flashfolder[i].includes(".db")) {

            console.log("(" + ii + ") " + flashfolder[i].split(".")[0]);
            databases.push(flashfolder[i].split(".")[0]);

            ii++;
        }
    }

    if (databases.length == 0) {

        console.log("No databases found");
        return;
    }

    const ans = await inquirer.prompt([{
        name: 'name',
        message: "Choose a flashcard pack"
    }]);

    try {

        const opt = parseInt(ans.name);

        if (opt < 0 || opt >= databases.length) {

            console.log("----------------------------------------------------------------------------------------------------".red);
            console.log("Error processing".red);
            console.log("----------------------------------------------------------------------------------------------------".red);
            return;
        } else {

            //Show flashcards
            //Receive settings.flashcards.per.day cards that havent been seen from the data base
            const cards = await flashcard_init(databases[opt], settings.flashcards_per_day);


            //Fetch card information
            await cards.forEach(async (element) => {

                //Get word data
                const word_data = await jisho.searchForPhrase(element.word);
                const sentence_example = await jisho.searchForExamples(element.word);

                var sentence_list = [];
                let i = 0;
                for (i = 0; i < settings.max_flashcard_examples; i++) {
                    sentence_list.push(sentence_example.results[i]);
                }

                var english_meaning = [];

                word_data['data'][0].senses.forEach(element => {

                    english_meaning.push(element.english_definitions);
                });

                element.addMeaningReadingExample(english_meaning, word_data['data'][0].japanese[0].reading, sentence_list);
            });

            //Display the first flashcard
            let current_card = 0;
            let done = false, cycle = 0;

            while (!done) {

                //Display cards
                console.log("######################################################################\n");
                console.log("Do you recognise this word?");

                console.log(cards[current_card].word + "\n");

                const ans = await inquirer.prompt([{
                    name: 'name',
                    message: "y/n "
                }]);

                if (ans.name == "y") {

                    //Points += 1;

                    if (cards[current_card].points == -9999) {
                        cards[current_card].points = 0;
                    } else {

                        cards[current_card].points++;
                    }
                } else {

                    //Points += -1: doesn't know
                    cards[current_card].showCard();
                }

                //Repeat the cycle until all words have points > 0 
                cycle++;

                if (cycle == 3) {
                    break;
                }
                done = cycle_control(cards);
                current_card++;

                if (current_card == cards.length) {

                    let index = 0;
                    cards.forEach(function (element) {

                        if (element.points < 1) {
                            current_card = index;
                            return;
                        }

                        index++;
                    });
                }
            }

            //Apply local changes to the flashcard pack to the physical database
            update_flashcard_points(databases[opt], cards);

            console.log("############################ Daily flashcards complete ############################");

        }

    } catch (err) {

        console.error(err.message);

        console.log("----------------------------------------------------------------------------------------------------".red);
        console.log("Error processing".red);
        console.log("----------------------------------------------------------------------------------------------------".red);
    }
}

function cycle_control(cards) {

    let i = 0;
    for (i = 0; i < cards.length; i++) {

        if (cards[i].points < 0) return false;
    }

    return true;
}

async function get_words_jlpt(jlpt) {

    let rawdata = readFileSync("words/" + jlpt + ".json");

    return JSON.parse(rawdata);
}

async function get_kanji_jlpt(jlpt) {

    let rawdata = readFileSync("kanji/" + jlpt + ".json");

    return JSON.parse(rawdata);
}

async function input(question) {

    let ans = await inquirer.prompt([{
        name: 'name',
        message: question
    }]);

    return ans.name;
}

console.clear();
console.log(text.yellow);
console.log("----------------------------------------------------------------------------------------------------");

async function app_loop() {

    while (true) {

        console.log(`//Search//\n
        (0) 漢字検索　～　Kanji search
        (1) 語彙検索　(英語とローマ字) ～　Vocab search (English / romaji) 
        (2) 語彙検索 （日本語）～　Vocab search (Japanese) 
        (3) 文章検索　～　Sentence search

        //List//\n
        (4)　漢字リスト　～　Kanji list
        (5)　語彙リスト　～　Vocab list

        //Study//\n
        (6)  JLPTを例文で学んで　～　Study JLPT with examples
        (7)  フラシュカード　～　Flashcards

        //Other//\n
        (8)  援助　～　Help
        (9)  終了　～　Exit
        (10)  設定を調整する  ～ Tweak settings
        `);

        const ans = await inquirer.prompt([
            {
                name: 'option',
                message: 'Input an option: '
            },
        ]);

        let answer = parseInt(ans.option);

        if (answer >= 0 && answer <= 10) {

            if (answer == 8) return;
            await actions[answer.toString()]();

        } else {

            console.log("Bad input".red);
        }

        await inquirer.prompt([{ name: 'name', message: 'Press enter to continue' },]);

        if (settings.clear_after_search) {
            console.clear();
        }
    }
}

function show_word(name = null, word_data) {

    if (name == null) name = word_data.slug;

    console.log("WORD DETAILS");
    console.log("############################################################################################################################################");
    console.log("#  Word: " + name + "\n#  " + (name + word_data.is_common ? "\n#  Common Word" : ""));
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
}

function show_kanji(name, kanji_data) {

    console.log("KANJI DETAILS");
    console.log("############################################################################################################################################");
    console.log("#　Kanji: " + name);
    console.log("#　Reading: \n" + "#　音読み　⊳ " + kanji_data.onyomi + "\n#　訓読み　⊳ " + kanji_data.kunyomi);
    console.log("#　Meaning: " + kanji_data.meaning);
    console.log("#　Level: JLPT " + kanji_data.jlptLevel + " | Newspaper frequency " + kanji_data.newspaperFrequencyRank + " | Taught in " + kanji_data.taughtIn);
    console.log("#　Strokes: " + kanji_data.strokeCount);
    console.log("############################################################################################################################################");
}

function show_sentence(results) {

    results.forEach(element => {

        console.log(element.kanji + "\n " + element.kana + "\n " + element.english);
        console.log("----------------------------------------------------------------------------------------------------");
    })
}
await app_loop();
console.log("######################################################### Execution End #########################################################".bgBlue);