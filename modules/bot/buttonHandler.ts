import { ButtonInteraction, Client } from "discord.js";
import ReportEmbed from "./embeds/reportEmbed";
import SessionsViewer from "./viewers/sessionsViewer";
import TeleportViewer from "./viewers/teleportViewer";
import TeleportRankViewer from "./viewers/trankViewer";

export default class ButtonHandler {
  public client: Client;

  constructor(client: Client) {
    this.client = client;

    client.on("interactionCreate", (interaction) => {
      if (interaction.isButton()) {
        this.handleButtonInteraction(interaction);
      }
    });
  }

  private handleButtonInteraction(interaction: ButtonInteraction) {
    const options = interaction.customId.split("-");
    const [comm, arg1, arg2, arg3] = options;
    
    console.log(options)

    switch (comm) {
      case "sessions":
        SessionsViewer.editOnButtonInteraction(interaction, interaction.customId);
        break;
      case "teleport":
        TeleportViewer.editOnButtonInteraction(interaction, interaction.customId)
        break;
      case "trank":
        TeleportRankViewer.editOnButtonInteraction(interaction, interaction.customId)
        break;
     
      case "report":
        ReportEmbed.openModal(interaction)
      default:
        break;
    }
  }
}


