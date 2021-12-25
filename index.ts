import Discord from 'discord.js';
import dotenv from 'dotenv';

import events, {handleEvent} from './modules/eventHandler';

dotenv.config();

const Client = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGE_REACTIONS', 'GUILD_WEBHOOKS', 'GUILD_MESSAGES']});

Client.login(process.env.TOKEN);

events.forEach(event => {
    Client.on(event.name, handleEvent.bind(null, event.name, Client));
});