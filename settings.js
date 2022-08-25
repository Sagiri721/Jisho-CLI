import { readFileSync } from "fs"

export function getSettings() {

    let rawData = readFileSync("settings.json");
    let setting = JSON.parse(rawData);

    return setting;
}