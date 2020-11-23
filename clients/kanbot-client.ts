import Discord from 'discord.js';
import { KanbotCommands, KanbotRequest } from '../application/constants/kanbot-commands';
import { KanbanBoard } from '../application/kanban-board';
import { KanbotConfiguration } from '../application/kanbot-configuration';
import { Task } from '../application/models/task';
import { Kanban } from '../application/namespaces/kanban-board';
import * as help from '../util/commands.json';

export class KanbotClient {

    private signal: string;
    private botName: string;
    private token: string;

    constructor(kanbotConfiguration: KanbotConfiguration,
        private discordClient: Discord.Client,
        private board: KanbanBoard = new KanbanBoard()) {
        
        this.signal = kanbotConfiguration.signal;
        this.botName = kanbotConfiguration.botName;
        this.token = kanbotConfiguration.token;
    }

    /**
     * handleLogin
     */
    public handleLogin(): void {
        this.discordClient.login(this.token).then(value => console.log(value));
    }

    /**
     * handleReady
     */
    public handleReady(): void {
        this.discordClient.on('ready', () => console.log(`${this.botName} is online!`));
    }

    public handleMessage(): void {
        this.discordClient.on('message', (message: Discord.Message) => this.handleRequest(message));
    }

    /**
     * handleRequest
     * @param message DiscordMessage
     */
    public handleRequest(message: Discord.Message): void {
        const channel = message.channel;
        const caller: string = message.author.username;

        if (message.author.bot) return;
        if (channel.type === 'dm') return;

        // Parse command, and check.
        const inputs: string[] = message.content.split(' -');
        if (inputs[0] !== this.signal) return;

        // display board
        if (inputs.length === 1) {
            this.displayBoard(message, caller);
            return;
        }

        console.warn(inputs[1]);

        const request: KanbotRequest = KanbotRequest.parseString(inputs[1]);
        switch (request.command) {
            case KanbotCommands.ADD:
                this.addToBacklog(message, request.taskName);
                break;
            case KanbotCommands.HELP:
                message.channel.send(this.helpList(message));
                break;
            case KanbotCommands.REMOVE:
                this.removeItem(message, request.taskName);
                break;
            case KanbotCommands.START:
                this.startItem(message, request.taskName);
                break;
            case KanbotCommands.COMPLETE:
                this.completeItem(message, request.taskName);
                break;
            case KanbotCommands.CLEAR:
                this.board.clearBoard();
                channel.send({
                    embed: {
                        color: 3447003,
                        description: `Board cleared by: ${message.author.username}`
                    }
                });
                break;
            default:
                channel.send({
                    embed: {
                        color: 3447003,
                        description: `Invalid request: ${request.command} ${request.taskName}`
                    }
                });
                break;
        }
    }

    private displayBoard(message: Discord.Message, caller: string) {
        message.channel.send(new Discord.RichEmbed({
            color: 3447003,
            description: `${this.botName}!`
        })
        .addField('Project Backlog ', `\`\`\`${this.displayColumn(this.board.backlog.getTasks())}\`\`\``)
        .addField('In Progress ', `\`\`\`${this.displayColumn(this.board.inProgress.getTasks())}\`\`\``)
        .addField('Completed Tasks', `\`\`\`${this.displayColumn(this.board.complete.getTasks())}\`\`\``)
        .addField("I've been called by ", caller));
    }

    private displayColumn(from: Task[]) {
        return from.map(task => task.toString()).join('\n');
    }

    private addToBacklog(message: Discord.Message, taskName: string) {
        const author: string = message.author.username;
        if (this.board.containsTask(taskName)) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    description: `Not adding task ${taskName} because it already exists in the kanban board.`
                }
            });
            return;
        }

        message.channel.send({
            embed: {
                color: 3447003,
                description: `${taskName} has been added to the Backlog by ${author}`
            }
        });
        this.board.addToBacklog(new Task(taskName, author));
    }

    private helpList(message: Discord.Message) {
        const Help = new Discord.RichEmbed()
            .setColor('#0074E7')
            .setTitle('List of Board Commands')
            .addField(`${help.view.command}`, `${help.view.desc}`)
            .addField(`${help.add.command}`, `${help.add.desc}`)
            .addField(`${help.remove.command}`, `${help.remove.desc}`)
            .addField(`${help.clearTask.command}`, `${help.clearTask.desc}`)
            .addField(`${help.startTask.command}`, `${help.startTask.desc}`)
            .addField(`${help.completeTask.command}`, `${help.completeTask.desc}`);
        console.log(message);
        return Help;
    }

    private async removeItem(message: Discord.Message, item: string): Promise<Discord.Message | Discord.Message[]> {
        try {
            const match: Task = await this.board.findMatch(item);
            this.board.remove(match);
            return message.channel.send({
                embed: {
                    color: 3447003,
                    description: `Removed ${item} by ${message.author.username}`
                }
            });
        } catch (error) {
            console.log(error);
            return message.channel.send({
                embed: {
                    color: 3447003,
                    description: 'No matching item found, nothing removed.'
                }
            });
        }
    }

    private startItem(message: Discord.Message, item: string) {
        this.forward(item, this.board.backlog, this.board.inProgress, message);
    }

    private completeItem(message: Discord.Message, item: string) {
        this.forward(item, this.board.inProgress, this.board.complete, message);
    }

    private forward(item: string, from: Kanban.Board.Column, to: Kanban.Board.Column, message: Discord.Message) {
        const task: Task | undefined = from.findMatch({ name: item } as Task);

        if (task instanceof Task) {
            from.remove(task);
            to.add(task);
            message.channel.send({
                embed: {
                    color: 3447003,
                    description: `${item} moved from "${from.getName()}" to "${to.getName()}" by: ${message.author.username}`
                }
            });
        }
    }
}