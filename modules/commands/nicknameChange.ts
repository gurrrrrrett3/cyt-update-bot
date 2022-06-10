import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";
import Linking from "../bot/linking";

const Command = {
  data: new SlashCommandBuilder()
    .setName("allnickname")
    .setDescription("OWNER COMMAND: Change all nicknames")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("nickname")
        .setDescription("The nickname to set.  Type 'reset' to reset all nickames")
        .setRequired(true)
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    if (interaction.user.id != "232510731067588608") return;
    interaction.deferReply()

    const name = interaction.options.getString("nickname", true);

    let count = 0;

    interaction.guild?.members
      .fetch({
        limit: 100,
      })
      .then((members) => {
        const promises: Promise<any>[] = [];

        if (name != "reset") {
          members.forEach((member) => {
            promises.push(
              member.setNickname(name).catch((err) => {
                console.log(err);
              })
            );
            count++;
          });
        } else {
          members.forEach((member) => {
            const linkName = Linking.getLinkByID(member.id);
            if (linkName == undefined) {
              promises.push(
                member.setNickname(null).catch((err) => {
                  console.log(err);
                })
              );
            } else {
              promises.push(
                member.setNickname(linkName.ign).catch((err) => {
                  console.log(err);
                })
              );
            }
            count++;
          });
        }
        Promise.all(promises).then(() => {
          interaction.editReply(`Changed ${count} nicknames.`);
        });
      });
  },
};
module.exports = Command;
