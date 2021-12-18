import { CYT } from "..";
import { sendPinataMessage } from "./infochannels";
import staticData from "./staticData";
import fs from "fs";

const pinataDataFile = "./data/pinata.json";

export default class Pinata {
    
    public static update() {

        if (CYT.getOnlineCount() ?? 0 >= staticData.pinataPlayerCount) {

            //Playercount is high enough to start pinata, check if it happened today

            if (!this.checkIfPinataHappenedToday()) {

                //Pinata hasn't happened today, start timer

                this.startTimer();

            }

        }

    }

    private static checkIfPinataHappenedToday() {

        const d = new Date();

        const data = JSON.parse(fs.readFileSync(pinataDataFile).toString());

        if (data[`${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`]) {

            return false;

        } else return true;
    }

    private static async startTimer() {

        const timeout = setTimeout(this.onFinish, 120000);

        let data = JSON.parse(fs.readFileSync(pinataDataFile).toString());

        const d = new Date();

        data[`${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`] = true

        fs.writeFileSync(pinataDataFile, JSON.stringify(data, null, 4));

    }

    private static onFinish() {

        sendPinataMessage()

    }


}