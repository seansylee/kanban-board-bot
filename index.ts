import botconfig from './config/botconfig.json';
import Discord, { ClientOptions } from 'discord.js';
import { KanbanBot } from './clients/discord-bot-wrapper';
import { KanbotConfiguration } from './application/kanbot-configuration';
import { KanbanBoard } from './application/kanban-board';
import { Task } from './application/models/task';

const configuration: KanbotConfiguration = new KanbotConfiguration(botconfig.botName, botconfig.token, botconfig.prefix, 'kanbot');
const clientOptions: ClientOptions = { disableEveryone: true };
const discordClient: Discord.Client = new Discord.Client(clientOptions);
const bot: KanbanBot = new KanbanBot(configuration, discordClient);
bot.setupBot();
bot.login();

// const kanbotClient: KanbotClient = new KanbotClient(configuration, discordClient);

// const kanbanBoard: KanbanBoard = new KanbanBoard();
// kanbanBoard.addToBacklog(new Task('"test"'));
// console.log(kanbanBoard.backlog.getTasks());
// console.log(kanbanBoard.containsTask('"test"'));
// console.log(kanbanBoard.containsTask(new Task('"test"')));