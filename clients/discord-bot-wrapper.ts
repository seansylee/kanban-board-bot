import Discord from 'discord.js';
import { KanbotConfiguration } from '../application/kanbot-configuration';
import { KanbotClient } from './kanbot-client';

interface DiscordBot {
    setupBot(): void;
    login(): void;
}

export class KanbanBot implements DiscordBot {
    
    private kanbotClient: KanbotClient;

    constructor(configuration: KanbotConfiguration, discordClient: Discord.Client) {
        this.kanbotClient = new KanbotClient(configuration, discordClient);
    }
    
    setupBot() {
        this.kanbotClient.handleReady();
        this.kanbotClient.handleMessage();
    }

    login() {
        this.kanbotClient.handleLogin();
    }
}