//@typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
import Discord, { MessageEmbed } from "discord.js";
import cyt from "./modules/cyt";
import { makeMapLink, update } from "./modules/infochannels";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TOKEN;

export const CYT = new cyt();

export const Client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_WEBHOOKS",
    "GUILD_MESSAGES",
  ],
});

Client.login(token);

Client.once("ready", () => {
  console.log(`Ready, logged in as ${Client.user?.tag}`);
  Client.user?.setActivity({
    type: "PLAYING",
    name: `On CYT | craftyour.town | Waiting for first ping...`,
  });

  setInterval(() => {
    update();

    Client.user?.setActivity({
      type: "PLAYING",
      name: `On CYT | craftyour.town | ${
        CYT.townCount
      } towns | ${CYT.getOnlineCount()} players`,
    });
    //10 seconds
  }, 10000);
});

//Fires on new message
Client.on("messageCreate", async (message) => {
  if (message.author.bot || message.channel.type != "GUILD_TEXT") return;

  if (!message.content.startsWith("-")) return;

  const content = message.content.slice(1);
  const split = content.split(" ");
  const command = split[0].toLowerCase();
  const args = split.slice(1);
  
  //check if commands are enabled

  if (!CYT.isReady()) {

    message.reply("Commands aren't ready yet, please wait while the bot starts up.");
    return;
  }

  if (command == "pos") {
    const data = await CYT.getPos(args[0]);

    console.log(data);

    if (data.name == "Error") {
      message.reply({
        content: "Error, could not find player",
      });
    } else {
      const embed = new MessageEmbed()
        .setTitle(`Position of ${data?.name}`)
        .setURL(
          makeMapLink(
            data?.world == "earth" ? "earth" : "world",
            data?.x,
            data?.z
          )
        );

      //   if (data.world == "world" || data.world == "earth") {
      embed.setDescription(
        `**World:** ${data?.world}\n**X:** ${data?.x}\n**Z:** ${data?.z}`
      );
      //   } else {
      //     embed.setDescription(`**World:** ${data?.world}\n**X:** No data available\n**Z:** No data available`)
      //   }

      //They broke their code again, so the above block is unneccessary
      //Why can't they keep a bug fixed for more than a day?

      message.reply({
        embeds: [embed],
      });
    }
  } else if (command == "town") {


  const data = await CYT.getTown(args.join(" "));

  if (!data) {

    message.reply("Error, could not find town");

  }

  const embed = new MessageEmbed()

  .setTitle(`Town of ${data?.name}`)
  .setURL(
    makeMapLink(
      data?.world == "earth" ? "earth" : "world",
      data?.coords.x ?? 0,
      data?.coords.z ?? 0,
    )
  )
  .setDescription(
    `**World:** ${data?.world}\n**X:** ${data?.coords.x ?? 0}\n**Z:** ${data?.coords.z ?? 0}`
  )
.addField("Mayor", `\`${data?.mayor}\`` ?? "No data available")
.addField("Pvp", data?.pvp ? "`Enabled`" : "`Disabled`" ?? "No data available")
.addField("Assistants", `\`${data?.assistants.join(", ")}\`` ?? "No data available")
.addField("Residents", `\`${data?.residents.length.toString()}\`` ?? "No data available")
.addField("Resident List", `\`${data?.residents.join("\n")}\`` ?? "No data available")

.setTimestamp()
  message.reply({
    embeds: [embed],
  });
  
} else if (command == "online") {
    message.reply({
      content: `There are: ${CYT.getOnlineCount()} players online!`,
    });
  } 
});
