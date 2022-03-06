import dotenv from 'dotenv';
import CommandClient from './modules/commandClient';
import EmbedHandler from './modules/embedHandler';

dotenv.config();

const Client = new CommandClient(process.env.TOKEN as string, process.env.APPLICATION_ID as string);

Client.login(process.env.TOKEN);

Client.once('ready', () => {
    new EmbedHandler(Client);

    Client.user?.setActivity('on craftyour.town', {type: 'PLAYING'});
    });