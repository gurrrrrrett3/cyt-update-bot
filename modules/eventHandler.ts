import Discord from "discord.js";
import { commandHandler } from "./commandHandler";

type Event = {
  name: string;
  execute: (Client: Discord.Client, args?: any) => void;
};

const events: Event[] = [
  {
    name: "ready",
    execute: (Client: Discord.Client) => {
      console.log(`Ready, logged in as ${Client.user?.tag}`);
      Client.user?.setActivity({
        type: "STREAMING",
        name: `data from zion.craftyourtown.com | Waiting for first ping...`,
      });
    },
  },
  {
    name: "messageCreate",
    execute: (Client: Discord.Client, message: Discord.Message) => {

      commandHandler(Client, message);

    },
  },
];

export default events;

export function handleEvent(Event: string, Client: Discord.Client, ...[]) {
  const event = events.find((e) => e.name === Event);

  if (event) {
    return event.execute(Client, ...[]);
  }
}
