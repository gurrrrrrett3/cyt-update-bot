import { MessageEmbed } from "discord.js";
import { Client, CYT } from "..";

export const startTime = Date.now()

export async function update() {

    const embed = new MessageEmbed()
        .setTitle("CYT Live Data")
        .setDescription(`**Towns:** ${CYT.getTownCount()}\n**Players:** ${await CYT.getOnlineCount()}\n**Bot Uptime:** ${formatTime((Date.now() - startTime) / 1000)}`)
        .setTimestamp()
        .setThumbnail("https://cdn.discordapp.com/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png")

    Client.channels.cache.get("909839378086506497")?.fetch().then((channel) => {

        if (!channel.isText()) return

        let messageId = ""

        if (!channel.lastMessageId || !channel.lastMessage?.editable) {
            channel.messages.fetch().then((c) => c.forEach((m) => { m.delete() }))
            channel.send({ embeds: [embed] }).then((message) => {
                messageId = message.id
            })
        } else {
            messageId = channel.lastMessageId
        }

        channel.messages.cache.get(messageId)?.edit({ embeds: [embed] })

    })




}


export function formatTime(time: string | number) {
    time = parseInt(time.toString());

    const h = Math.floor(time / 3600);
    time = time % 3600;
    const m = Math.floor(time / 60);
    time = time % 60;

    return `${p(h)}:${p(m)}:${p(time)}`;
}

function p(s: number) {
    return s.toString().length == 1 ? `0${s}` : s
};