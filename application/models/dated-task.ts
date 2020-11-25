import { Status, Task } from "./task";

export class DatedTask extends Task {

    readonly _createdDate: Date;
    private _addToColumnDate: Date;

    constructor(name: string,
        creator?: string,
        status?: Status,
        taskId?: number,
        assignee?: string,
        createdDate: Date = new Date(),
        addToColumnDate: Date = new Date()) {

        super(name, creator, status, taskId, assignee);
        this._createdDate = createdDate;
        this._addToColumnDate = addToColumnDate;
    }
    
    public get createdDate() : Date { return this._createdDate; }
    public get addToColumnDate() : Date { return this._addToColumnDate; }
}