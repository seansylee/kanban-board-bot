import { trim } from "lodash";

export enum KanbotCommands {
    ADD,
    CLEAR,
    COMPLETE,
    HELP,
    REMOVE,
    START
}

function getKanbotCommand(command: string): KanbotCommands {
    switch (command) {
        case 'add':
            return KanbotCommands.ADD;
        case 'clear':
            return KanbotCommands.CLEAR;
        case 'complete':
            return KanbotCommands.COMPLETE;
        case 'remove':
            return KanbotCommands.REMOVE;
        case 'start':
            return KanbotCommands.START;
        case 'help':
        default:
            return KanbotCommands.HELP;
    }
}

export interface KanbotRequest {
    command: KanbotCommands;
    taskName: string;
}

export class KanbotRequest implements KanbotRequest {

    constructor(command: KanbotCommands, taskName: string) {
        this.command = command;
        this.taskName = taskName;
    }

    public static parseString(input: string): KanbotRequest {
        const request: string[] = input.split(' ');
        const command: KanbotCommands = getKanbotCommand(request[0]);
        const taskName: string = `${trim(request[1], '"')}`;

        return new KanbotRequest(command, taskName);
    }
}