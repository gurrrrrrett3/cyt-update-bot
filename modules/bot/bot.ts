import Dicord from "discord.js";
import TownDataManager from "../data/townDataManager";
import MapUpdate from "../map/mapUpdate";
import CommandHandler from "./commandHandler";
import EmbedManager from "./embedManager";
import KickManager from "./kickmanager";
import LinkManager from "./linkManager";
import UpdateEmbed from "./updateEmbed";
import playerUpdate from "../map/playerUpdate";
import Util from "./util";
import ButtonHandler from "./buttonHandler";
import TimerManager from "./timerManager";
import MapInterface from "../map/mapInterface";
import ShopManager from "../shop/shopManager";
import SelectMenuHandler from "./selectMenuHandler";
import Logger from "./logger";
import ReportEmbed from "./embeds/reportEmbed";
import ModalHandler from "./modalHandler";
import fs from "fs";

import child_process from "child_process";

let channels = new Map<string, Dicord.TextChannel>();

//A container for all the submodules.
export default class Bot {
  public Client: Dicord.Client;
  public CommandHandler: CommandHandler;
  public kickmanager: KickManager;
  public embedManager: EmbedManager;
  public mapUpdate: MapUpdate;
  //@ts-ignore
  public townDataManager: TownDataManager;
  //@ts-ignore
  public updateEmbedManager: UpdateEmbed;
  public linkManager: LinkManager;
  public playerUpdate: playerUpdate;
  public buttonHandler: ButtonHandler;
  public modalHandler: ModalHandler;
  public selectMenuHendler: SelectMenuHandler;
  public timerManager: TimerManager;
  //public shopManager: ShopManager;
  public Logger: Logger;

  constructor(client: Dicord.Client) {
    this.Client = client;
    this.CommandHandler = new CommandHandler(client);
    this.kickmanager = new KickManager(client);
    this.embedManager = new EmbedManager(client);
    this.mapUpdate = new MapUpdate();
    this.linkManager = new LinkManager(client);
    this.playerUpdate = new playerUpdate();
    this.buttonHandler = new ButtonHandler(client);
    this.modalHandler = new ModalHandler(client);
    this.selectMenuHendler = new SelectMenuHandler(client);
    this.timerManager = new TimerManager();
    //this.shopManager = new ShopManager();
    this.Logger = new Logger(client);

    this.timerManager.on("5", () => {
      this.embedManager.updateEmbeds();
      this.setStatus();
    });

    this.timerManager.on("1", async () => {
      this.playerUpdate.update(await MapInterface.getPlayers());
    });

    this.Client.on("ready", () => {
      console.log(`Logged in as ${this.Client.user?.tag}`);

      this.updateEmbedManager = new UpdateEmbed(client);

      //Register Embeds
      /* Promise.all([this.embedManager.registerEmbed("playerlist", "953652154579681380", "playerlist")]).then(
        () => {
          this.embedManager.updateEmbeds();
          
        }
      ); */
      this.townDataManager = new TownDataManager();

      //Register Channels
      Promise.all([
        channels.set("voiceLog", this.Client.channels.cache.get("958551703966339092") as Dicord.TextChannel),
        channels.set("welcome", this.Client.channels.cache.get("953651821673582662") as Dicord.TextChannel),
      ]).then(() => {
        console.log("Channels Registered");
      });
    });

    this.Client.on("voiceStateUpdate", (os, ns) => {
      if (!os.member || !ns.member) {
        console.log("No member");
        return;
      }
      if (ns.channel && !os.channel) {
        const channel = channels.get("voiceLog");
        if (channel) {
          channel.send(`${ns.member.displayName} has joined ${ns.channel.name}`);
        }
      } else if (os.channel && !ns.channel) {
        const channel = channels.get("voiceLog");
        if (channel) {
          channel.send(`${os.member.displayName} has left ${os.channel.name}`);
        }
      } else if (os.channel && ns.channel) {
        const channel = channels.get("voiceLog");
        if (channel) {
          if (ns.selfDeaf != os.selfDeaf) {
            channel.send(
              `${ns.member.displayName} has ${ns.selfDeaf ? "deafened" : "undeafened"} in ${ns.channel.name}`
            );
          } else if (ns.selfMute != os.selfMute) {
            channel.send(
              `${ns.member.displayName} has ${ns.selfMute ? "muted" : "unmuted"} in ${ns.channel.name}`
            );
          } else if (ns.serverDeaf != os.serverMute) {
            channel.send(
              `${ns.member.displayName} has been ${ns.deaf ? "deafened" : "undeafened"} in ${ns.channel.name}`
            );
          } else if (ns.serverMute != os.serverMute) {
            channel.send(
              `${ns.member.displayName} has been ${ns.mute ? "muted" : "unmuted"} in ${ns.channel.name}`
            );

            if (ns.member.id == "232510731067588608") {
              ns.setMute(false);
            }
          } else if (ns.streaming != os.streaming) {
            channel.send(
              `${ns.member.displayName} has ${ns.streaming ? "started streaming" : "stopped streaming"} in ${
                ns.channel.name
              }`
            );
          } else if (ns.channel.name != os.channel.name) {
            channel.send(`${ns.member.displayName} has moved from ${os.channel.name} to ${ns.channel.name}`);
          }
        }
      }
    });

    this.Client.on("guildMemberAdd", (member) => {
      if (this.kickmanager.kicklist.includes(member.id)) return;
      const embed = new Dicord.MessageEmbed()
        .setColor("#00ff00")
        .setTitle("Welcome to the server!")
        .setDescription(
          `Welcome to the server, ${member.displayName}!\n\nIf you have any questions, feel free to ask!`
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

      const channel = channels.get("welcome");
      channel?.send({ embeds: [embed] });

      member.roles.add(member.guild.roles.cache.find((r) => r.name === "Nation Member")!);
    });

    this.Client.on("messageReactionAdd", (reaction, user) => {
      if (user.id == "206653000855322624") reaction.remove();
    });

    this.Client.on("messageCreate", (message) => {
      /* if (message.mentions.members && message.mentions.members.get("232510731067588608")) {
        const d = new Date();
        console.log(d.getHours());
        if (d.getHours() >= 2 && d.getHours() < 9) {
          message.reply(
            "Hey, I'm most likely asleep right now, and won't see your message until the morning when I wake up. Sorry about that!"
          );
        }
      } */

      if (message.author.id == "232510731067588608") {
        if (message.content == "Rules embed") {
          ReportEmbed.send(message.channel as Dicord.TextChannel);
          message.delete();
        }
      }
    });
  }

  /**
   * Update bot status
   */
  public setStatus() {
    const players = Util.getPlayerFile();
    this.Client.user?.setActivity(
      `in dev mode - last commit: ${child_process.execSync("git rev-parse --short HEAD").toString().trim()}`,
      { type: "PLAYING" }
    );
  }
}
