import Discord from "discord.js";

type Event = {
  name: string;
  execute: (Client: Discord.Client) => void;
};

const events: Event[] = [
  {
    name: "ready",
    execute: (Client: Discord.Client) => {
      console.log(`Ready, logged in as ${Client.user?.tag}`);
      Client.user?.setActivity({
        type: "PLAYING",
        name: `On CYT | craftyour.town | Waiting for first ping...`,
      });
    },
  },
  {
    name: "messageCreate",
    execute: (Client: Discord.Client) => {},
  },
];

export default events;

export function handleEvent(Event: string, Client: Discord.Client) {
  const event = events.find((e) => e.name === Event);

  if (event) {
    return event.execute(Client);
  }
}
