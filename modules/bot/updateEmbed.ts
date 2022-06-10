import Discord from "discord.js";
import MapInterface from "../map/mapInterface";
import Player from "../resources/player";
import Town from "../resources/town";
import Util from "./util";

export default class UpdateEmbed {

    public static readonly townInfoChannelId = "984683645203779584";
    public static readonly joinLeaveChannelId = "984683631379357716";

    public townInfoChannel: Discord.TextChannel;
    public joinLeaveChannel: Discord.TextChannel;

    constructor (public client: Discord.Client) {

        this.townInfoChannel = this.client.channels.cache.get(UpdateEmbed.townInfoChannelId) as Discord.TextChannel;
        this.joinLeaveChannel = this.client.channels.cache.get(UpdateEmbed.joinLeaveChannelId) as Discord.TextChannel;

    }

    public newTown(town: Town): void {
        const embed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setTitle("New Town")
            .setDescription(`${town.name} has been founded by ${Util.formatPlayer(town.mayor)}`)
            .addField("Location", `x: \`${town.coords.x}\`\nz: \`${town.coords.z}\`\nWorld: \`${town.world}\`\n[View on map](${MapInterface.generateMapLink(town.getLocation(), 3)})`, true)
            .setTimestamp();

        this.townInfoChannel.send({embeds: [embed]});

    }

    public updateTown(town: Town, title: string, desc: string): void {
        const embed = new Discord.MessageEmbed()
            .setColor("#ffff00")
            .setTitle(title)
            .setDescription(desc)
            .addField("Location", `x: \`${town.coords.x}\`\nz: \`${town.coords.z}\`\nWorld: \`${town.world}\`\n[View on map](${MapInterface.generateMapLink(town.getLocation(), 3)})`, true)
            .setTimestamp();

        this.townInfoChannel.send({embeds: [embed]});
    }

    public removeTown(town: Town): void {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Town Removed")
            .setDescription(`${town.name} has been removed\n[View on map](${MapInterface.generateMapLink(town.getLocation(), 3)})`)
            .addField("Location", `x: \`${town.coords.x}\`\nz: \`${town.coords.z}\`\nWorld: \`${town.world}\``, true)
            .setTimestamp();

        this.townInfoChannel.send({embeds: [embed]});
    }

    public playerJoin(player: Player): void {
        const embed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setTitle("Player Joined")
            .setDescription(`${player.getName()} has joined the server`)
            .setThumbnail(`https://mc-heads.net/head/${player.name}`)
            .addField("Location", `x: \`${player.x}\`\nz: \`${player.z}\`\nWorld: \`${player.world}\`\n[View on map](${MapInterface.generateMapLink(player.getLocation(), 3)})`, true)
            .setTimestamp();

        this.joinLeaveChannel.send({embeds: [embed]});
    }

    public playerLeave(player: Player): void {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Player Left")
            .setDescription(`${player.getName()} has left the server`)
            .setThumbnail(`https://mc-heads.net/head/${player.name}`)
            .addField("Location", `x: \`${player.x}\`\nz: \`${player.z}\`\nWorld: \`${player.world}\`\n[View on map](${MapInterface.generateMapLink(player.getLocation(), 3)})`, true)
            .setTimestamp();

        this.joinLeaveChannel.send({embeds: [embed]});
    }

}