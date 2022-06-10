import Discord, { Client, TextInputComponent } from "discord.js";

export default class ReportEmbed {
  public static send(channel: Discord.TextChannel) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Report A user")
      .setColor("#ff0000")
      .setDescription("Press the button below to report a user.");

    let row = new Discord.MessageActionRow().addComponents([
      new Discord.MessageButton().setLabel("Report").setStyle("DANGER").setCustomId("report"),
    ]);
    channel.send({
      embeds: [embed],
      components: [row],
    });
  }

  public static async openModal(interaction: Discord.ButtonInteraction) {
        const modal = new Discord.Modal()
        .setTitle("Report A user")
        .setCustomId("reportModal")    
    
        const userComponent = new TextInputComponent()
            .setCustomId("user")
            .setLabel("Username")
            .setPlaceholder("Gucci_Garrett or @Gucci Garrett#9211")
            .setRequired(true)
            .setStyle("SHORT")

        const reasonComponent = new TextInputComponent()
            .setCustomId("reason")
            .setLabel("Reason")
            .setPlaceholder("He is a bad person and should be reported")
            .setRequired(true)
            .setStyle("PARAGRAPH")

        const firstRow = new Discord.MessageActionRow<Discord.ModalActionRowComponent>().addComponents(userComponent)
        const secondRow = new Discord.MessageActionRow<Discord.ModalActionRowComponent>().addComponents(reasonComponent)

        modal.addComponents(firstRow, secondRow)
    await interaction.showModal(modal)
  }

    public static handle(interaction: Discord.ModalSubmitInteraction) {

        const user = interaction.fields.getTextInputValue("user")
        const reason = interaction.fields.getTextInputValue("reason")

        const embed = new Discord.MessageEmbed()
            .setTitle("Report A user")
            .setColor("#ff0000")
            .setDescription(`You have reported ${user} for ${reason}. This incident will be reviewed by the staff team. Thank you for your report.`)

        interaction.reply({embeds: [embed], ephemeral: true})

        interaction.client.users.cache.get("232510731067588608")?.send(`${user} has been reported for ${reason}, by ${interaction.user.tag}`)
    }
}
