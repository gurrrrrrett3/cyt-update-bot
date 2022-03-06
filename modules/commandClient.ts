import { Client, Collection } from "discord.js";
import fs from "fs";
import { REST } from "@discordjs/rest";
import { ButtonFile, Command, SelectMenuFile } from "./types";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v9";

export default class CommandClient extends Client {
  public commands: Collection<any, Command>;
  public buttons: Collection<any, ButtonFile>;
  public selectMenus: Collection<any, SelectMenuFile>;

  constructor(token: string, applicationId: string) {
    super({
      intents: ["GUILDS", "GUILD_INTEGRATIONS", "GUILD_VOICE_STATES"],
      partials: ["CHANNEL", "MESSAGE"],
    });
    this.commands = new Collection();
    this.buttons = new Collection();
    this.selectMenus = new Collection();
    this.login(token);

    this.once("ready", () => {
      console.log("Logged in as " + this.user?.tag);
      this.deployAllCommands(applicationId);

      //Not using buttons or select menus

      //this.getButtons();
      //this.getSelectMenus();
    });

    this.on("interactionCreate", (interaction) => {
      if (!interaction.isCommand()) {
        if (interaction.isButton()) {
          const button = this.buttons.get(interaction.customId);
          if (button) {
            button.data.execute(interaction).catch((err) => {
              console.error(err);
            });
          }
          return;
        } else if (interaction.isSelectMenu()) {
          const selectMenu = this.selectMenus.get(interaction.customId);
          if (selectMenu) {
            selectMenu.data.execute(interaction).catch((err) => {
              console.error(err);
            });
          }
          return;
        } else return;
      }
      const command = this.commands.get(interaction.commandName);
      if (!command) {
        console.error(`Command ${interaction.commandName} not found`);
        return;
      }
      command.execute(interaction);
    });
  }

  private async deployAllCommands(applicationId: string): Promise<void> {
    let commandsToDeploy: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const commandFiles = fs.readdirSync("./dist/commands").filter((file) => file.endsWith(".js"));

    console.log(`Deploying ${commandFiles.length} commands`);

    for (const file of commandFiles) {
      console.log(`Deploying ${file}`);
      const command: Command = require(`../commands/${file}`);
      this.commands.set(command.data.name, command);
      commandsToDeploy.push(command.data.toJSON());
    }

    const rest = new REST({ version: "9" }).setToken(this.token ?? "");

    rest
      .put(Routes.applicationGuildCommands(this.user?.id ?? applicationId, "909808939045113887"), {
        body: commandsToDeploy,
      })
      .then(() => {
        console.log("Deployed all commands!");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private getButtons(): void {
    const buttonFiles = fs.readdirSync("./dist/buttons").filter((file) => file.endsWith(".js"));
    console.log(`Loading ${buttonFiles.length} responses to buttons`);
    for (const file of buttonFiles) {
      const button: ButtonFile = require(`../buttons/${file}`);
      this.buttons.set(button.data.customId, button);
    }
  }

  private getSelectMenus(): void {
    const selectMenuFiles = fs.readdirSync("./dist/selectMenus").filter((file) => file.endsWith(".js"));
    console.log(`Loading ${selectMenuFiles.length} responses to select menus`);
    for (const file of selectMenuFiles) {
      const selectMenu: SelectMenuFile = require(`../selectMenus/${file}`);
      this.selectMenus.set(selectMenu.data.customId, selectMenu);
    }
  }
}
