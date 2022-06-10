import { SelectMenuInteraction, Client } from "discord.js";
import SessionsViewer from "./viewers/sessionsViewer";
import TeleportViewer from "./viewers/teleportViewer";
import TeleportRankViewer from "./viewers/trankViewer";

export default class SelectMenuHandler {
  public client: Client;

  constructor(client: Client) {
    this.client = client;

    client.on("interactionCreate", (interaction) => {
      if (interaction.isSelectMenu()) {
        this.handleSelectMenuInteraction(interaction);
      }
    });
  }

  private handleSelectMenuInteraction(interaction: SelectMenuInteraction) {
    const options = interaction.customId.split("-");
    const [comm, arg1, arg2, arg3] = options;
    
    console.log(options)

    switch (comm) {
     
      default:
        break;
    }
  }
}


