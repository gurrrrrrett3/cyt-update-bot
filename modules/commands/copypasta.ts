import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";
import RedditClient from "../bot/reddit/client";
import reddit from "snoowrap";

const Command = {
  data: new SlashCommandBuilder()
    .setName("copypasta")
    .setDescription("WARNING: NSFW | Returns a random copypasta, or a copypasta by search.")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("search")
        .setRequired(false)
        .setDescription("The search term to search for.")
    )
    .addBooleanOption(new SlashCommandBooleanOption()
      .setName("nsfw")
      .setDescription("Whether or not to search for NSFW copypastas. Defaults to false.")
    )
    ,
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const nsfw = interaction.options.getBoolean("nsfw") ?? false;
    const search = interaction.options.getString("search");
    if (search) {
      //@ts-ignore
      const post = (await RedditClient.getRandomPostBySearch("copypasta", search, nsfw)) as reddit.Submission;
      interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle(post.title)
            .setURL(post.url)
            .setDescription(post.selftext)
            .setColor("#0099ff")
            .setTimestamp(post.created_utc * 1000)
            .setFooter({ text: `Posted by ${post.author.name}` }),
        ],
      });
    } else {
      //@ts-ignore
      const post = (await RedditClient.getRandomPost("copypasta", nsfw)) as reddit.Submission;
      interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle(post.title)
            .setURL(post.url)
            .setDescription(post.selftext)
            .setColor("#0099ff")
            .setTimestamp(post.created_utc * 1000)
            .setFooter({ text: `Posted by ${post.author.name}` }),
        ],
      });
    }
  },
};
module.exports = Command;
