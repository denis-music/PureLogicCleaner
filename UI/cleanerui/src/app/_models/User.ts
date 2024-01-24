import { DateTime } from "@syncfusion/ej2-angular-charts";

export class User {

    public FirstName : string; 
    public LastName : string;
    public Username : string;
    public Password : string;
    public Email : string;
    public Adrress : string;
    public Age : number;

    constructor(firstname : string, lastname : string, username : string, password : string, salt : string, email : string, adrress : string, age: number)
    {
        this.FirstName = firstname;
        this.LastName = lastname;
        this.Username = username;
        this.Password = password;
        this.Email = email;
        this.Adrress = adrress;
        this.Age = age;
    }
}
