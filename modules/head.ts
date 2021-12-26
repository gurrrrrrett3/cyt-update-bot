import fetch from "node-fetch";
export default class Head {

    static async get(username: string) {

        const res = await fetch(`https://mc-heads.net/avatar/${username}/512/nohelm.png`)
        
    }

}