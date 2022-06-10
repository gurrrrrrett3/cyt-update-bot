import Discord from "discord.js";
import Bot from "./modules/bot/bot";
import auth from "./auth.json";
import UUIDManager from "./modules/data/player/uuidManager";
import PlayerSessionManager from "./modules/data/player/playerSessionManager";
import fs from "fs";
import path from "path";
import AreaLogManager from "./modules/map/areaLog/areaLogManager";
import AreaLog from "./modules/map/areaLog/areaLog";
import Util from "./modules/bot/util";

const Client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_VOICE_STATES",
    "GUILD_MESSAGE_TYPING",
    "GUILD_INTEGRATIONS",
  ],
  partials: ["REACTION"],
});

export const bot = new Bot(Client);

Client.login(auth.BOT_TOKEN);

//Preform startup repair...
const uuids = UUIDManager.openFile();

let amount = 0;
let broken: string[] = [];

uuids.forEach((uuid) => {
  const u = uuid.UUID;
  let data = PlayerSessionManager.getPlayerSessions({
    amount: -1,
    uuid: u,
  });
  let b = 0;
  data.forEach((s, i) => {
    if (s.logout.time == 0) {
      data.splice(i, 1);
      amount++;
      b++;
    }
  });
  if (b > 0) {
    broken.push(uuid.username);
    fs.writeFileSync(path.resolve(`./data/players/${u}/session.json`), JSON.stringify(data));
  }
});

console.log(`Removed ${amount} broken sessions`);

bot.Client.once("ready", () => {
  let alm = new AreaLogManager();
  let al = new AreaLog("RADIUS", "Red base", "world_nether", { x: -7353, z: 8184 }, 100);
  alm.addAreaLog(al);
  al.addAlert("232510731067588608");

  
});
