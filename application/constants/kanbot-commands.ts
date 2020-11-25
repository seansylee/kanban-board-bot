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
        // split on first space - won't work if we allow commands to have multiple arguments
        const spaceIndex: number = input.indexOf(' ');
        const command: KanbotCommands = getKanbotCommand(input.substring(0, spaceIndex));
        const taskName: string = `${trim(input.substring(spaceIndex + 1, input.length), '"')}`;

        return new KanbotRequest(command, taskName);
    }
}