import Discord from "discord.js";

import commands from "./commands"



export function commandHandler(Client: Discord.Client, message: Discord.Message) {
  
    const split = message.content.slice(1).split(" ");
    const cmd = split[0].toLowerCase();
    const args = split.slice(1);

    const command = commands.find((c) => c.name == cmd || c.aliases.includes(cmd));

  if (command) {
    command.execute(Client, message, args);
  }
}
