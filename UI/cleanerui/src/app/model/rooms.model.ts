export class Rooms {
    id!: string;
    name!: string;
    customName!: string;

    constructor(name: string, customName: string) {
        this.name = name;
        this.customName = customName;
    }
}