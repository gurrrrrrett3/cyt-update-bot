import Discord from 'discord.js';
import dotenv from 'dotenv';
import { commandHandler } from './modules/commandHandler';
import EmbedHandler from './modules/embedHandler';

import events, {handleEvent} from './modules/eventHandler';

dotenv.config();

const Client = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGE_REACTIONS', 'GUILD_WEBHOOKS', 'GUILD_MESSAGES']});

Client.login(process.env.TOKEN);

Client.on('ready', () => {
    handleEvent('ready', Client);
    new EmbedHandler(Client);

    Client.user?.setActivity('on craftyour.town', {type: 'PLAYING'});
    });

    Client.on('messageCreate', (message) => {
        commandHandler(Client, message);
    });