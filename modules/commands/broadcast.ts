import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";

const Command = {
  data: new SlashCommandBuilder()
    .setName("broadcast")
    .setDescription("ADMIN COMMAND: Broadcast as the a webhook for announcement message")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("message")
        .setDescription("The message to broadcast")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("title")
        .setDescription("The title of the embed")
        .setRequired(false)
    ),

  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    if (!interaction.memberPermissions?.has("ADMINISTRATOR")) return;

    const message = interaction.options.getString("message", true);
    const title = interaction.options.getString("title", false) ?? "Announcement";
    const channel = interaction.guild?.channels.cache.find(
      (c) => c.name === "nation-announcements"
    ) as Discord.TextChannel;
    if (channel.type != "GUILD_TEXT") return;

    const embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setColor("#0099ff")
      .setDescription(message);

    let hook = await channel.fetchWebhooks().then((webhooks) => webhooks.find((w) => w.name === "Broglands"));
    if (!hook) {
      hook = await channel.createWebhook("Broglands", {
        avatar:
          "https://cdn.discordapp.com/avatars/854556241564139560/8e19f12a055eca6a0ad0581e8a12030c.png?size=1024",
        reason: "Broglands webhook",
      });
    }
    hook.send({ embeds: [embed] });
    interaction.reply({ content: `<#${channel.id}>`, ephemeral: true });
  },
};
module.exports = Command;
