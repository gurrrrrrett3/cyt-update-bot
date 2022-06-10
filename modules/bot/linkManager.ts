import { Client, CommandInteraction, Interaction, MessageEmbed } from "discord.js";
import MapInterface from "../map/mapInterface";
import Blocks, { Block } from "../resources/block";
import Linking from "./linking";
import Util from "./util";

//Actual code to handle linking

export default class LinkManager {
  public codes: {
    interaction: CommandInteraction;
    id: string;
    ign: string;
    block: {
      x: number;
      z: number;
      block: string;
    };
    check: NodeJS.Timer;
    expire: NodeJS.Timeout;
  }[];

  constructor(private client: Client) {
    this.codes = [];
  }

  /**
   * Actually starts the Linking process
   * @param interaction The CommandInteraction recived from Discord
   * @param ign The Player's In Game Name
   * @returns void, replies to the CommandInteraction
   */
  public newLink(interaction: CommandInteraction, ign: string) {
    const id = interaction.user.id;

    //a random block from the block list, and coordnates
    const block = Blocks.pick();

    //Codes are just info about stuff the bot needs to complete the link.
    this.codes.push({
      interaction,
      id,
      ign,
      block,
      check: this.getCheck(ign, block, interaction),
      expire: this.getExpire(id),
    });

    //Actually send the embed that gives info on the linking process
    const embed = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("Almost there!")
      .setDescription(`Go to \`/nation spawn\` on the server and stand on the \n\n**${block.block}**\n\nThe bot will DM you when you do it, so make sure your DMs are open!`);

      if (interaction.replied) return
    interaction.reply({ embeds: [embed] });
  }

  /**
   * Triggers when the bot knows that the user is on the correct block
   * @param ign The Player's In Game Name
   * @param interaction The CommandInteraction recived from Discord
   * @returns void
   */
  private triggerLink(ign: string, interaction: CommandInteraction) {
    //Grab the correct link data
    const link = this.codes.find((code) => code.ign.toLowerCase() === ign.toLowerCase());
    if (!link) return;
    
    //Get the discord user
    const user = this.client.users.cache.get(link.id);
    if (!user) return;

    //Gemerate and send the embed to the user
    const embed = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("Linked!")
      .setDescription(
        `Your discord account (${user.tag}) has been linked to your Minecraft account (${ign})`
      );

      //Snd the embed to the user, but if the user has their DMs closed, just send it in the channel they ran the command in
    user.send({ embeds: [embed] }).catch(() => {
      link.interaction.channel?.send({ embeds: [embed] });
    });

    //Save the linking data
    Linking.newLink(link.id, ign);

    //Clear check and expire timers
    clearInterval(link.check);
    clearTimeout(link.expire);

    //Remove the code
    this.codes = this.codes.filter((code) => code.id !== link.id);

    //ROLE MANAGEMENT

    //Get the Member from the discord
    const member = interaction.guild?.members.cache.get(link.id);

    //Set their nickname to their IGN
    member?.setNickname(ign).catch(() => {
      console.log(`Failed to set nickname for ${ign}`);
    });

    //Add Linked role
    member?.roles.add(interaction.guild?.roles.cache.find((r) => r.name === "Linked")!).catch(() => {
      console.log(`Failed to add role for ${ign}`);
    });

    //TOWN ROLES

    //only add fancy town roles if they are in the Nation
    const town = Util.getUserTown(link.ign);
    if (!town || town.nation != "Broglands") return;

    //Get their ranks
    const rank = Util.getUserRank(link.ign);

    //Give the correct role based on rank

    switch (rank) {
      case "mayor":
        member?.roles.add(interaction.guild?.roles.cache.find((r) => r.name === "Mayor")!).catch(() => {
            console.log(`Failed to add role for ${ign}`);
        });
      case "assistant":
        member?.roles
          .add(interaction.guild?.roles.cache.find((r) => r.name === "Town Assistant")!)
          .catch(() => {
            console.log(`Failed to add role for ${ign}`);
          });
      default:
        //User isn't in a town, so don't add any roles
        break;
    }

    const guild = member?.guild
    if (!guild) return;

    //EMOJI ADDING

    //if the emoji already exists, don't add it again
          
    if (guild.emojis.cache.find((e) => e.name === ign)) return;

    //create the emoji
    guild.emojis.create(`https://mc-heads.net/avatar/${ign}`, `${ign}`).catch(() => { 
      console.log(`Failed to create emoji for ${ign}`);
    });
  }

  /**
   * get the check function
   * @param ign Player's In Game Name
   * @param block Block and coord data
   * @param interaction CommandInteraction
   * @returns An interval that checks weather the player is on the correct block
   */
  private getCheck(ign: string, block: Block, interaction: CommandInteraction): NodeJS.Timer {
    
    return setInterval(async () => {
      //Get the list of players from the map
      MapInterface.getPlayers().then((players) => {
        //Find a player that matches IGN
        const player = players.find((p) => p.name === ign);
        if (player) {
          //Get their location and check if their coords match the block coords
          const coords = player.getLocation();
          if (coords.x === block.x && coords.z === block.z) {

            //Trigger the linking process
            this.triggerLink(ign, interaction);
          }
        }
      });
      //checks every 5 seconds
    }, 5000);
  }

  /**
   * Get the exprire timeout function
   * @param id User ID
   * @returns A timeout that will remove the timers in 5 minutes
   */
  private getExpire(id: string): NodeJS.Timeout {
    //expires in 5 minutes
    return setTimeout(() => {
      this.codes = this.codes.filter((code) => code.id !== id);
    }, 300000);
  }
}
