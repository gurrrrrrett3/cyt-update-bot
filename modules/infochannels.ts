import { MessageEmbed } from "discord.js";
import { Client, CYT } from "..";
import Town from "./cytmarker";
import Discord from "discord.js";

export const roles = {
  townFall: "Town Fall Notifications",
  pinata: "Pinata",
  daily: "Daily Server Updates",
};

export const startTime = Date.now();

//update the live embed every 10 seconds
export async function update() {
  //make the embed
  const embed = new MessageEmbed()
    .setTitle("CYT Live Data")
    .setDescription(
      `**Towns:** ${CYT.getTownCount()}\n**Players:** ${await CYT.getOnlineCount()}\n**Bot Uptime:** ${formatTime(
        (Date.now() - startTime) / 1000
      )}`
    )
    .setTimestamp()
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png"
    );

  //get the live info channel
  Client.channels.cache
    .get("909839378086506497")
    ?.fetch()
    .then((channel) => {
      if (!channel.isText()) return;

      let messageId = "";

      //delete old embeds on bot startup

      if (!channel.lastMessageId || !channel.lastMessage?.editable) {
        channel.messages.fetch().then((c) =>
          c.forEach((m) => {
            m.delete();
          })
        );
        channel.send({ embeds: [embed] }).then((message) => {
          messageId = message.id;
        });
      } else {
        messageId = channel.lastMessageId;
      }

      //edit the embed
      channel.messages.cache.get(messageId)?.edit({ embeds: [embed] });
    });
}

/**
 * Sends an embed to the town update channel, with the town's name, coordanates, and mayor.
 * @param town Town object
 * @param action Action to take
 */
export async function townUpdate(town: Town, action: "CREATE" | "DELETE") {
  //Create an embed
  const embed = new MessageEmbed()
    .setTitle(`${town.name} was ${action == "CREATE" ? "Created" : "Deleted"}!`)
    .setDescription(
      `**X**: ${town.coords.x}\n**Z**: ${town.coords.z}\n**World**: ${town.world}\n **Mayor**: ${town.mayor}\n **Residents**: ${town.residents.length}`
    )
    .setColor(action == "CREATE" ? "GREEN" : "RED")
    .setURL(makeMapLink(town.world, town.coords.x, town.coords.z))
    .setTimestamp();

  //Get the town update channel
  Client.channels.cache
    .get("909811232792510464")
    ?.fetch()
    .then(async (channel) => {
      if (!channel.isText()) return;

      //Send the embed
      channel.send({
        embeds: [embed],
        content: action == "DELETE" ? await mentionRole(roles.townFall) : "",
      });
    });
}

export async function mentionRole(role: string) {
  //Get the role
  const foundRole = Client.guilds.cache
    .get("909808939045113887")
    ?.roles.cache.find((r) => r.name == role);

  if (!foundRole) return;

  //return the role mention
  return `<@&${foundRole.id}>`;
}

/**
 * Formats a number of seconds into a human readable time string
 * @param time Time in seconds
 * @returns String of the time in the format of "HH:MM:SS"
 */
export function formatTime(time: string | number) {
  time = parseInt(time.toString());

  const h = Math.floor(time / 3600);
  time = time % 3600;
  const m = Math.floor(time / 60);
  time = time % 60;

  return `${p(h)}:${p(m)}:${p(time)}`;
}

function p(s: number) {
  return s.toString().length == 1 ? `0${s}` : s;
}

/**
 * Creates a link to the map at the given world, coordnates, and zoom
 * @param world World to get the link for
 * @param x X coord
 * @param z Z coord
 * @param zoom OPTIONAL | Zoom level, default is 4
 * @returns String of the map link
 */
export function makeMapLink(
  world: string,
  x: number,
  z: number,
  zoom?: 1 | 2 | 3 | 4 | 5
) {
  // if (world == "world" || world == "earth") {

  return `https://zion.craftyourtown.com/?world=${world}&zoom=${
    zoom ?? 4
  }&x=${x}&z=${z}`;
  // } else {
  //     return "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  // }

  //COMMENTED OUT FOR NOW AS THEY PROCEEDED TO BREAK THIS AGAIN LMAO
}

export async function sendPinataMessage() {

  Client.channels.cache.get("909811204057350165")?.fetch().then(async (channel) => {

    if (!channel.isText()) return

    const embed = new MessageEmbed()
      .setTitle("Pinata Starts Now!")
      .setDescription("Pinata is now starting!\n/warp event")
      .setColor("#ffff00")
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png")

    channel.send({ embeds: [embed], content: await mentionRole(roles.pinata) })
  })
}