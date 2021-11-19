import fs from "fs";

const backupFolder = "./data/backups/"
const townFile = "./data/towns.json"

export default async function dailyUpdate() {

    //This runs daily, at midnight EST, give or take 5 seconds

    //Create backup file

    const D = new Date()

    const backupFileName = `${D.getFullYear()}_${D.getMonth()}_${D.getDate()}` 

    const townData = fs.readFileSync(townFile)

    fs.writeFileSync(backupFolder + backupFileName + ".json", townData)


}