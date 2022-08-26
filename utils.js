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

    console.log("########################################################");
    console.log("#------------------------------------------------------#");
    console.log("# (0): Given a kanji input (kanji only) outputs infor- #");
    console.log("# mation on the kanji's meaning, readings, and more.   #");
    console.log("#                                                      #");
    console.log("# (1): Given a keyword (kana, kanji, english), outputs #");
    console.log("#  information on the word's meanings, readings, kanji #");
    console.log("#  forms, etc.                                         #");
    console.log("#                                                      #");
    console.log("# (2): Given a keyword (kana, kanji, romaji, english), #");
    console.log("# outputs sentences that contain that very same word / #");
    console.log("# expression, limited to the amount of sentences in t- #");
    console.log("# he database and if there are a lot of examples the   #");
    console.log("# default limit is around 17 sentences.                #");
    console.log("#------------------------------------------------------#");
    console.log("# (3)(4): Lists kanji/vocabulary from a specific jlpt. #");
    console.log("# The word/kanji limit is defaulted to 20, it can be   #");
    console.log("# changed in the settings.                             #");
    console.log("#------------------------------------------------------#");
    console.log("# (5): Lists example sentences alogside JLPT vocabula- #");
    console.log("# ry to help students understand the context in which  #");
    console.log("# the words can be used.                               #");
    console.log("#                                                      #");
    console.log("# (6): Flashcards are a popular tool in language lear- #");
    console.log("# ning, they are used to remember vocabulary in an e-  #");
    console.log("# fficient and interactive way. The default flashcard  #");
    console.log("# packs contain only jlpt words, you might be able to  #");
    console.log("# create your own flash cards on a future version of   #");
    console.log("# the app.                                             #");
    console.log("#------------------------------------------------------#");
    console.log("# (7): Displays app usage information.                 #");
    console.log("#                                                      #");
    console.log("# (8): Ends the program.                               #");
    console.log("#                                                      #");
    console.log("# (9): Displays and allows changes to the program's s- #");
    console.log("# ettings                                              #");
    console.log("#                                                      #");
    console.log("########################################################");
}