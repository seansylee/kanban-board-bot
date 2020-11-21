import botconfig from './util/botconfig.json';
import help from './util/commands.json';
import Discord, { ClientOptions, Message } from 'discord.js';

const clientOptions: ClientOptions = { disableEveryone: true };
const bot: Discord.Client = new Discord.Client(clientOptions);
const prefix: string = botconfig.prefix;

// Fields
var backlog: string[] = [];
var inProgress: string[] = [];
var complete: string[] = [];
var commandList = ['add', 'remove', 'help', 'start', 'complete', 'clear'];

// Signifies Launch
bot.on('ready', async () => {
    console.log(`${bot.user.username} is online! `);
});

bot.on('message', async (message: Message) => {
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;

    // Parse command, and check.
    let commands = message.content.split(' -');
    let cmd = [];
    //kanban command
    cmd[0] = commands[0];
    // what comes after.
    if (commands.length > 1) cmd[1] = commands[1].split(' ')[0];
    let args = commands.slice(1);

    //Error Handling.
    if (!commandList.includes(cmd[1]) && cmd.length > 1) {
        return message.channel.send(errorHandle(message));
    }
    //Add add to Node.JS
    if (cmd[1] == commandList[0]) {
        addToBacklog(message, commands[1]);
    }
    //Help (display list of commands)
    if (cmd[1] == commandList[2]) {
        return message.channel.send(helpList(message));
    }
    //Remove from Backlog.
    if (cmd[1] == commandList[1]) {
        removeItem(message, commands[1]);
    }
    //Move item from backlog to in-progress
    if (cmd[1] == commandList[3]) {
        startItem(message, commands[1]);
    }
    //Move item from in-progress to complete.
    if (cmd[1] == commandList[4]) {
        completeItem(message, commands[1]);
    }
    //Move item into new index.
    if (cmd[1] == commandList[5]) {
        clear(message);
    }
    // to be implemented.
    // if (cmd[1] == commandList[5]) {up(message, commands[1])}clearclearclearclearclear

    //display board
    if (cmd[0] === `${prefix}kanbot` && commands.length == 1) {
        console.log('I made it to server info');
        let serverembed = new Discord.RichEmbed()
            .setDescription('Kanbot-Bot!')
            .setColor('#0074E7')
            .addField('Project Backlog ', `\`\`\`${displayColumn(backlog)}\`\`\``)
            .addField('In Progress ', `\`\`\`${displayColumn(inProgress)}\`\`\``)
            .addField('Completed Tasks', `\`\`\`${displayColumn(complete)}\`\`\``)
            .addField("I've been called by ", message.member);
        return message.channel.send(serverembed);
    }
})

function displayColumn(from: string | any[]) {
    var display = '';
    console.log(from.length);
    for (var i = 0; i < from.length; i++) {
        display += `${i + 1} - ${from[i]}\n`;
    }
    return display;
}

function errorHandle(message: Discord.Message) {
    let errorHandle = new Discord.RichEmbed()
        .setColor('#800000')
        .addField(
            'Please enter a valid Command!',
            `enter '$kanban help' for list of commands`
        );
    console.log(message);
    return errorHandle;
}

function addToBacklog(message: Discord.Message, item: string) {
    console.log('Here to add to backlog.');
    var content = item.split('"')[1];
    message.channel.send({
        embed: {
            color: 3447003,
            description:`${content} has been added to the Backlog by ${message.author.username}`
        }
    });
    backlog.push(`"${content}" added by: ${message.author.username}`);
    console.log(backlog);
}

function helpList(message: Discord.Message) {
    let Help = new Discord.RichEmbed()
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

function removeItem(message: Discord.Message, item: string): Promise<Discord.Message | Discord.Message[]> {
    const content: number = parseInt(item.split('"')[1]);
    let desc = '';
    if (backlog[content - 1]) {
        desc = `${backlog[content - 1].substring(0, backlog[content].lastIndexOf('"') + 1)} removed by ${message.member}`;
        backlog.splice(content - 1, 1);
    } else {
        desc = 'Please enter a valid ID value.';
    }
    return message.channel.send({
        embed: {
            color: 3447003,
            description: desc
        }
    });
}

function startItem(message: Discord.Message, item: string) {
    forward(item, backlog, inProgress, message);
    console.log(`inprogress = ${inProgress}`);
}

function completeItem(message: Discord.Message, item: string) {
    forward(item, inProgress, complete, message);
    console.log(`complete = ${complete}`);
}

function forward(item: string, from: string[], to: string[], message: Discord.Message) {
    const content = parseInt(item.split('"')[1]);
    if (from[content - 1]) {
        message.channel.send({
            embed: {
                color: 3447003,
                description:`${from[content - 1]} Moved by: ${message.author.username}`
            }
        });
        let temp = from[content - 1];
        const member = message.author.username;

        temp = temp.substring(0, temp.lastIndexOf('"') + 1);
        to.push(`${temp} added by: ${member}`);
        from.splice(content - 1, 1);
    }
}

// To implement some time
// function up(message, item, newIndex) {
//   var sawItem = false;
//   sawItem = searchList(item, newIndex, backlog)
//             || searchList(item, newIndex, inProgress)
//             || searchList(item, newIndex, complete);

//   if (!sawItem) {
//     message.channel.send({embed: {
//       color: 3447003,
//       description: "Task not found"
//     }});
//     return;
//   }
// }

// function searchList(item, newIndex, list) {
//   if (newIndex < list.length) {
//     for (var i = 0; i < list.length; i++) {
//       if (list[i] == item) {
//         list.splice(newIndex, 0, item);
//         list.pop();
//         return true;
//       }
//     }
//   }

//   return false;
// }

function clear(message: Discord.Message) {
    backlog = [];
    inProgress = [];
    complete = [];

    message.channel.send({
        embed: {
            color: 3447003,
            description: `Board cleared by: ${message.member}`
        }
    });
}

bot.login(botconfig.token).then(value => console.log(value));
