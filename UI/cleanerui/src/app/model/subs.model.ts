export class Subscription {
    id: string;
    name: string;
    price: number;
    sensorsIncluded: boolean;
    durationInDays: number;
    description?: string;
  
    constructor(id: string, name: string, price: number, sensorsIncluded: boolean, durationInDays: number, description?: string) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.sensorsIncluded = sensorsIncluded;
      this.durationInDays = durationInDays;
      this.description = description;
    }
  }
  