# Kanbot

:clipboard: A lightweight Kanban board bot, for your Discord! <br /><br />

![logo](https://media.discordapp.net/attachments/449647907772170253/449770623187812362/kanbotcircle.png)

## Getting started 

This is a bot for your Discord, so if you dont already have a Discord
register and download [here](https://discordapp.com/) <br />

If you are not familiar with a kanban board [here](https://leankit.com/learn/kanban/kanban-board/) is a great description by *leankit*

### This repository

clone this repository

```
$ git clone git@git:seansylee/kanban-board-bot.git
```

install the necessary node modules

```
$ npm install
```

create a bot through the discord developer portal and add your token in a file labeled `botconfig.json`

start the server!

```
$ npm run watch
```

## Documentation

Type the commands following `$kanbot` into your Discord chat box to launch the app.

|Command| Usage|
| ------------- |:-------------:|
| `$kanbot`| displays current kanban board|
|||
| `-help` | displays possible commands |
| `-add <"item">` | adds "item" into 'backlog'|
| `-remove <"id">` | remove item with "id" from 'backlog'|
| `-start <"id">` | move item with "id" from 'backlog' to 'in-progress'|
| `-complete <"id">` | move item with "id" from 'in-progress' to 'backlog'|
| `-clear` | clears the current board *use with caution*|

## Examples

`$kanbot` to display the board <br /><br />
![board](https://i.imgur.com/KkAgFms.png)<br /><br />

`$kanbot -add "Enjoy cookies"` to add to the backlog <br /><br />
![add-to-board](https://i.imgur.com/D7VfZDI.png)<br />

Made with :heart:
