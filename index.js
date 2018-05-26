const botconfig = require("./util/botconfig.json");
const help = require('./util/commands.json');
const Discord = require("discord.js");

const bot = new Discord.Client({disabledEveryone: true});
const prefix = botconfig.prefix;

// Fields
var backlog = [];
var inProgress = [];;
var complete= [];
var commandList = ['add', 'remove', 'help', 'start', 'complete', 'clear'];

// Signifies Launch
bot.on("ready", async () =>{
  console.log(`${bot.user.username} is online! Time to get shit done!`);
});

bot.on("message", async message => {
  if(message.author.bot) return ;
  if(message.channel.type == "dm") return;

  // Parse command, and check.
  let commands = message.content.split(" -");
  let cmd = [];
  //kanban command
  cmd[0] = commands[0];
  // what comes after.
  if(commands.length > 1)
    cmd[1] = commands[1].split(" ")[0];
  let args = commands.slice(1);

  //Error Handling.
  if (!commandList.includes(cmd[1]) && cmd.length > 1){return message.channel.send(errorHandle(message));}
  //Add add to Node.JS
  if (cmd[1] == commandList[0]) {addToBacklog(message, commands[1])}
  //Help (display list of commands)
  if (cmd[1] == commandList[2]) {return message.channel.send(helpList(message));}
  //Remove from Backlog.
  if (cmd[1] == commandList[1]) {removeItem(message, commands[1])}
  //Move item from backlog to in-progress
  if (cmd[1] == commandList[3]) {startItem(message, commands[1])}
  //Move item from in-progress to complete.
  if (cmd[1] == commandList[4]) {completeItem(message, commands[1])}
  //Move item into new index.
  if (cmd[1] == commandList[5]) {clear(message)} 
  // to be implemented.
  // if (cmd[1] == commandList[5]) {up(message, commands[1])}clearclearclearclearclear

  //display board
  if (cmd[0] === `${prefix}kanbot` && commands.length == 1){
    console.log("I made it to server info");
    let serverembed = new Discord.RichEmbed()
    .setDescription("Kanbot-Bot!")
    .setColor("#0074E7")
    .addField("Project Backlog ",
      "```" + displayColumn(backlog) + "```")
    .addField("In Progress ",
    "```" + displayColumn(inProgress) + "```")
    .addField("Completed Tasks",
      "```" + displayColumn(complete) + "```")
   .addField("I've been called by ",  message.member );
    return message.channel.send(serverembed);
  }
})

function displayColumn (from){
  var display = "";
  console.log(from.length);
  for(var i = 0; i < from.length; i++) {
    display += (i + 1)+ " - "  + from[i] + "\n";
  }
  return display;
}

function errorHandle(message) {
  let errorHandle = new Discord.RichEmbed()
  .setColor('#800000')
  .addField("Please enter a valid Command!", "enter `" +" $kanban help"+ " `" + " for list of commands");
  return errorHandle;
}

function addToBacklog(message, item) {
  console.log("Here to add to backlog.");
  var content = item.split("\"")[1];
  message.channel.send({embed: {
    color: 3447003,
    description:"` "+ content + " `" + " has been added to the Backlog by " + message.member
  }});
  backlog.push("\"" + content + "\"" + " added by: " + message.member.displayName);
  console.log(backlog);
}

function helpList(message) {
  let Help = new Discord.RichEmbed()
    .setColor("#0074E7")
    .setTitle("List of Board Commands")
    .addField(`${help.viewAll.command}`, `${help.viewAll.desc}`)
    .addField(`${help.backlog.command}`, `${help.backlog.desc}`)
    .addField(`${help.inprogress.command}`, `${help.inprogress.desc}`)
    .addField(`${help.completed.command}`, `${help.completed.desc}`)
    .addField(`${help.add.command}`, `${help.add.desc}`)
    //needs to be remove.
    .addField(`${help.delete.command}`, `${help.delete.desc}`)
    // ^-- update
    .addField(`${help.edit.command}`, `${help.edit.desc}`)
    .addField(`${help.forward.command}`, `${help.forward.desc}`)
    .addField(`${help.backward.command}`, `${help.backward.desc}`)
    .addField(`${help.up.command}`, `${help.up.desc}`)
    .addField(`${help.down.command}`, `${help.down.desc}`);
  return Help;
}

function removeItem(message, item) {
  var content = item.split("\"")[1];
  var desc = ""
  if (backlog[content - 1]) {
    desc = backlog[content-1].substring(0, backlog[content].lastIndexOf("\"") + 1) + "  removed by   " + message.member; 
    backlog.splice(content - 1, 1);
  } else {
    desc = "Please enter a valid ID value.";
  }
  return message.channel.send({embed: {
    color: 3447003,
    description: desc
  }});
}

function startItem(message, item) {
  forward(item, backlog, inProgress, message);
  console.log("inprogress = "+ inProgress);
}

function completeItem(message, item) {
  forward(item, inProgress, complete, message);
  console.log("complete = "+ complete);
}

function forward(item, from, to, message) {
  var content = item.split("\"")[1];
  if (from[content - 1]) {
    message.channel.send({embed: {
      color: 3447003,
      description: "`" + from[content-1]+ "`" + " Moved by : "+ message.member.toString()
    }});
    var temp = from[content - 1];
    var member = message.member.displayName;
    
    temp = temp.substring(0, temp.lastIndexOf("\"") + 1);
    to.push(temp + " added by: " + member);
    from.splice(content -1, 1);
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

function clear(message) {
  backlog = [];
  inProgress = [];
  complete = [];

  message.channel.send({embed: {
    color: 3447003,
    description: "Board cleared by: " + message.member
  }});
}


bot.login(botconfig.token);
