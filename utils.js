import { createRequire } from "module";

const require = createRequire(import.meta.url);

var colors = require("colors");

export const text = `
    /$$$$$ /$$           /$$                                                                        
   |__  $$|__/          | $$                                                                        
      | $$ /$$  /$$$$$$$| $$$$$$$   /$$$$$$                                                         
      | $$| $$ /$$_____/| $$__  $$ /$$__  $$                                                        
 /$$  | $$| $$|  $$$$$$ | $$  \\ $$| $$  \\ $$                                                        
| $$  | $$| $$ \\____  $$| $$  | $$| $$  | $$                                                        
|  $$$$$$/| $$ /$$$$$$$/| $$  | $$|  $$$$$$/                                                        
 \\______/ |__/|_______/ |__/  |__/ \\______/                                                         
                                                                                                    
                                                                                                    
                                                                                                    
  /$$$$$$  /$$                             /$$      /$$$$$$  /$$                             /$$    
 /$$__  $$| $$                            | $$     /$$__  $$| $$                            | $$    
| $$  \\__/| $$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$  | $$  \\__/| $$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$  
| $$      | $$__  $$ /$$__  $$ |____  $$|_  $$_/  |  $$$$$$ | $$__  $$ /$$__  $$ /$$__  $$|_  $$_/  
| $$      | $$  \\ $$| $$$$$$$$  /$$$$$$$  | $$     \\____  $$| $$  \\ $$| $$$$$$$$| $$$$$$$$  | $$    
| $$    $$| $$  | $$| $$_____/ /$$__  $$  | $$ /$$ /$$  \\ $$| $$  | $$| $$_____/| $$_____/  | $$ /$$
|  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$  |  $$$$/
 \\______/ |__/  |__/ \\_______/ \\_______/   \\___/   \\______/ |__/  |__/ \\_______/ \\_______/   \\___/  
`;

export function help() {

    console.log("########################################################".yellow);
    console.log("#------------------------------------------------------#".yellow);
    console.log("# (0): Given a kanji input (kanji only) outputs infor- #".yellow);
    console.log("# mation on the kanji's meaning, readings, and more.   #".yellow);
    console.log("#                                                      #".yellow);
    console.log("# (1): Given a keyword (kana, kanji, english), outputs #".yellow);
    console.log("#  information on the word's meanings, readings, kanji #".yellow);
    console.log("#  forms, etc.                                         #".yellow);
    console.log("#                                                      #".yellow);
    console.log("# (2): Given a keyword (kana, kanji, romaji, english), #".yellow);
    console.log("# outputs sentences that contain that very same word / #".yellow);
    console.log("# expression, limited to the amount of sentences in t- #".yellow);
    console.log("# he database and if there are a lot of examples the   #".yellow);
    console.log("# default limit is around 17 sentences.                #".yellow);
    console.log("#------------------------------------------------------#".yellow);
    console.log("# (3)(4): Lists kanji/vocabulary from a specific jlpt. #".yellow);
    console.log("# The word/kanji limit is defaulted to 20, it can be   #".yellow);
    console.log("# changed in the settings.                             #".yellow);
    console.log("#------------------------------------------------------#".yellow);
    console.log("# (5): Lists example sentences alogside JLPT vocabula- #".yellow);
    console.log("# ry to help students understand the context in which  #".yellow);
    console.log("# the words can be used.                               #".yellow);
    console.log("#                                                      #".yellow);
    console.log("# (6): Flashcards are a popular tool in language lear- #".yellow);
    console.log("# ning, they are used to remember vocabulary in an e-  #".yellow);
    console.log("# fficient and interactive way. The default flashcard  #".yellow);
    console.log("# packs contain only jlpt words, you might be able to  #".yellow);
    console.log("# create your own flash cards on a future version of   #".yellow);
    console.log("# the app.                                             #".yellow);
    console.log("#------------------------------------------------------#".yellow);
    console.log("# (7): Displays app usage information.                 #".yellow);
    console.log("#                                                      #".yellow);
    console.log("# (8): Ends the program.                               #".yellow);
    console.log("#                                                      #".yellow);
    console.log("# (9): Displays and allows changes to the program's s- #".yellow);
    console.log("# ettings                                              #".yellow);
    console.log("#                                                      #".yellow);
    console.log("########################################################".yellow);
}