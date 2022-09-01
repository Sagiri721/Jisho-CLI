import JishoAPI from "unofficial-jisho-api";
import { text } from "./utils.js";
import inquirer from "inquirer";
import axios from "axios";
import { getSettings } from "./settings.js";
import { help } from "./utils.js";
import { readFileSync, readdirSync } from "fs";
import { flashcard_init } from "./flashcard.js";

const jisho = new JishoAPI();
const settings = getSettings();

async function kanji_meaning() {
    let ans = await inquirer.prompt([
        {
            name: "name",
            message: "Kanji? ",
        },
    ]);

    let kanji_data = await jisho.searchForKanji(ans.name);

    if (kanji_data.found) {
        show_kanji(ans.name, kanji_data);
    } else {
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
        console.log("Kanji not found");
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
    }
}

async function word_search() {
    let ans = await inquirer.prompt([
        {
            name: "name",
            message: "Word? ",
        },
    ]);

    //Perform a self search from the json web api
    const url = `https://jisho.org/api/v1/search/words?keyword=${ans.name}`;
    const word_data = await axios.get(url).data;

    try {

        word_data.slug;
        show_word(ans.name, word_data);
    } catch (error) {
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
        console.log("Word not found");
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
    }
}

async function list_kanji() {
    console.log(
        "\n----------------------------------------------------------------------------------------------------"
    );

    const ans = await inquirer.prompt([
        {
            name: "name",
            message: "What JLPT(1-5)? ",
        },
    ]);

    console.log(
        "\n----------------------------------------------------------------------------------------------------"
    );

    try {
        let option = ans.name;

        if (+option > 5 || +option < 1) {
            console.log(
                "----------------------------------------------------------------------------------------------------"
            );
            console.log("Invalid JLPT level");
            console.log(
                "----------------------------------------------------------------------------------------------------"
            );
            return;
        }
    } catch (error) {
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
        console.log("Error processing");
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
    }
}

async function list_words() {
    console.log(
        "\n----------------------------------------------------------------------------------------------------"
    );

    const ans = await inquirer.prompt([
        {
            name: "name",
            message: "What JLPT(1-5)? ",
        },
    ]);

    console.log(
        "\n----------------------------------------------------------------------------------------------------"
    );

    try {
        let option = ans.name;

        if (+option > 5 || option < 1) {
            console.log(
                "----------------------------------------------------------------------------------------------------"
            );
            console.log("Invalid JLPT level");
            console.log(
                "----------------------------------------------------------------------------------------------------"
            );
            return;
        }

        let page = 1,
            word_count = 0,
            relative_word_count = 0;
        const url = `https://jisho.org/api/v1/search/words?keyword=%23jlpt-n${option}&page=${page}`;

        const { data: pagedata } = await axios.get(url).data;
        while (word_count < settings.max_words) {
            try {
                show_word(null, pagedata[relative_word_count]);
            } catch (error) {
                //Check for error type
                if (word_count < settings.max_words) {
                    //Goto next page

                    page++;
                    const newurl = `https://jisho.org/api/v1/search/words?keyword=%23jlpt-n${option}&page=${page}`;

                    pagedata = await axios.get(newurl).data;
                    relative_word_count = 0;
                }
            }

            relative_word_count++;
            word_count++;
        }
    } catch (error) {
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
        console.log("Error processing");
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
    }
}

async function sentence_search() {
    let ans = await inquirer.prompt([
        {
            name: "name",
            message: "Word to contain in sentences:  ",
        },
    ]);

    const sentence_data = await jisho.searchForExamples(ans.name);

    if (sentence_data.results.length == 0) {
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
        console.log("No sentences were found");
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
        return;
    }

    console.log(
        "############################################################################################################################################"
    );

    show_sentence(sentence_data.results);

    console.log(
        "############################################################################################################################################"
    );
}

async function jlpt_sentence_words() {
    console.log(
        "\n----------------------------------------------------------------------------------------------------"
    );

    const ans = await inquirer.prompt([
        {
            name: "name",
            message: "What JLPT(1-5)? ",
        },
    ]);

    console.log(
        "\n----------------------------------------------------------------------------------------------------"
    );

    try {
        let option = parseInt(ans.name);

        if (option > 5 || option < 1) {
            console.log(
                "----------------------------------------------------------------------------------------------------"
            );
            console.log("Invalid JLPT level");
            console.log(
                "----------------------------------------------------------------------------------------------------"
            );
            return;
        }

        let words_showing = settings.max_words;

        console.log(
            "Displaying words from the (offset)th term to the (offset + " +
            words_showing +
            ")th term"
        );
        const offsetinq = await inquirer.prompt([
            {
                name: "name",
                message: "Offset? ",
            },
        ]);

        var offset = parseInt(offsetinq.name);

        //Get word list
        const words_obj = await get_words_jlpt(option.toString());
        const sentences_show = settings.max_sentence_per_word;

        let i = 0;
        for (i = 0; i < words_obj.words.length; i++) {
            if (i >= offset) {
                if (i == offset + words_showing) {
                    return;
                }

                //display words
                console.log(
                    "----------------------------------------------------------------------------------------------------"
                );
                console.log((i + 1).toString() + ": " + words_obj.words[i]);
                //Show sentences
                let keyword = words_obj.words[i].split(" ")[0];

                await jisho.searchForExamples(keyword).then((sentence) => {
                    let j = 0;
                    for (j = 0; j < sentences_show; j++) {
                        try {
                            const arr = sentence["results"][j];
                            console.log();
                            console.log(arr.kanji + "\n " + arr.kana + "\n " + arr.english);
                        } catch (error) { }
                    }
                });

                console.log(
                    "----------------------------------------------------------------------------------------------------\n"
                );
            }
        }
    } catch (error) {
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
        console.log("Error processing");
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );

        console.error(error);
    }
}

async function show_flashcards() {
    console.log(
        "\n----------------------------------------------------------------------------------------------------"
    );
    console.log("FLASH CARDS");

    const flashfolder = readdirSync("flashcard_packs");
    var databases = [];

    let i = 0,
        ii = 0;
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

    const ans = await inquirer.prompt([
        {
            name: "name",
            message: "Choose a flashcard pack",
        },
    ]);

    try {
        const opt = parseInt(ans.name);

        if (opt < 0 || opt >= databases.length) {
            console.log(
                "----------------------------------------------------------------------------------------------------"
            );
            console.log("Error processing");
            console.log(
                "----------------------------------------------------------------------------------------------------"
            );
            return;
        } else {
            //Show flashcards
            //Receive settings.flashcards.per.day cards that havent been seen from the data base
            const cards = await flashcard_init(
                databases[opt],
                settings.flashcards_per_day
            );

            console.log(cards);
        }
    } catch (err) {
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
        console.log("Error processing");
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
    }
}

async function get_words_jlpt(jlpt) {
    let rawdata = readFileSync("words/" + jlpt + ".json");

    return JSON.parse(rawdata);
}

console.clear();
console.log(text);
console.log(
    "----------------------------------------------------------------------------------------------------"
);

function print_settings() {

    console.log("\nCurrent session's settings:");
    console.log(
        "############################################################################################################################################\n"
    );

    console.log(
        "Maximum of words showed in JLPT study and vocabulary List: " + settings.max_words
    );
    console.log(
        "Maximum of words kanjis on kanji list: " + settings.max_kanji
    );
    console.log(
        "Clears screen after one program cycle? " + settings.clear_after_search
    );
    console.log(
        "Maximum number of sentences showed on JLPT study (doesn't change efficiency) (shouldn't be above 17 for safety reasons): " + settings.max_sentence_per_word
    );
    console.log(
        "Number of flashcard per day: " + settings.flashcards_per_day
    );

    console.log(
        "\n############################################################################################################################################"
    );
    console.log("*restart the app when settings are changed*\n");
}

async function app_loop() {

    while (true) {
        console.log(`//Search//

        (0) 漢字検索　～　Kanji search
        (1) 語彙検索　～　Vocab search (English / romaji) 
        (2) 文章検索　～　Sentence search

        //List//

        (3)　漢字リスト　～　Kanji list
        (4)　語彙リスト　～　Vocab list

        //Study//

        (5)  JLPTを例文で学んで　～　Study JLPT with examples
        (6)  フラシュカード　～　Flashcards

        //Other//

        (7)  援助　～　Help
        (8)  終了　～　Exit
        (9)  設定を調整する  ～ Tweak settings
        `);

        const ans = await inquirer.prompt([
            {
                name: "option",
                message: "Input an option: ",
            },
        ]);

        let answer = parseInt(ans.option);

        const actions = {

            "0": async function () { await kanji_meaning(); },
            "1": async function () { await word_search(); },
            "2": async function () { await sentence_search() },
            "3": async function () { await list_kanji() },
            "4": async function () { await list_words() },
            "5": async function () { await jlpt_sentence_words() },
            "6": async function () { await show_flashcards() },
            "7": async function () { help(); },
            "9": async function () { print_settings(); }
        }

        if (answer >= 0 && answer <= 9) {

            if (answer == 8) return;
            await actions[answer.toString()]();
        } else {
            console.log("Bad input");
        }

        await inquirer.prompt([
            { name: "name", message: "Press enter to continue" },
        ]);

        if (settings.clear_after_search) {
            console.clear();
        }
    }
}

function show_word(name = null, word_data) {
    if (name == null) name = word_data.slug;

    console.log("WORD DETAILS");
    console.log(
        "############################################################################################################################################"
    );
    console.log(
        "#  Word: " +
        name +
        "\n#  " +
        (name + word_data.is_common ? "\n#  Common Word" : "")
    );
    console.log("#  Common form: " + word_data.slug);
    console.log(
        "#  JLPT level: " +
        (word_data.jlpt.length != 0 ? word_data.jlpt[0] : "NOT IN THE JLPT")
    );

    console.log("#  Readings: ");
    word_data.japanese.forEach((element) => {
        console.log(
            "#    > Kanji conjugation: " +
            element.word +
            " | Reading: " +
            element.reading
        );
    });

    console.log("#  Meaning: ");
    word_data.senses.forEach((element) => {
        console.log("#     " + element.english_definitions);
    });
    console.log(
        "############################################################################################################################################"
    );
}

function show_kanji(name, kanji_data) {
    console.log("KANJI DETAILS");
    console.log(
        "############################################################################################################################################"
    );
    console.log("#　Kanji: " + name);
    console.log(
        "#　Reading: \n" +
        "#　音読み　⊳ " +
        kanji_data.onyomi +
        "\n#　訓読み　⊳ " +
        kanji_data.kunyomi
    );
    console.log("#　Meaning: " + kanji_data.meaning);
    console.log(
        "#　Level: JLPT " +
        kanji_data.jlptLevel +
        " | Newspaper frequency " +
        kanji_data.newspaperFrequencyRank +
        " | Taught in " +
        kanji_data.taughtIn
    );
    console.log("#　Strokes: " + kanji_data.strokeCount);
    console.log(
        "############################################################################################################################################"
    );
}

function show_sentence(results) {
    results.forEach((element) => {
        console.log(element.kanji + "\n " + element.kana + "\n " + element.english);
        console.log(
            "----------------------------------------------------------------------------------------------------"
        );
    });
}

await app_loop();
console.log(
    "######################################################### Execution End #########################################################"
);