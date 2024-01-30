import { Injectable } from '@angular/core';

declare let alertify:any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

confirm(message:string,okCallBak:()=>any)
{
  alertify.confirm(message);
}

public successAlert(content:string){
  alertify.success(content);
}

public errorAlert(content:string){
  alertify.error(content);
}

public warningAlert(content:string){
  alertify.warning(content);
}

public messageAlert(content:string)
{
  alertify.message(content);
}
}
