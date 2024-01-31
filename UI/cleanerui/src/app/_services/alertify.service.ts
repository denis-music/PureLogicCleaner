import { Injectable } from '@angular/core';
import * as alertifyJs from 'alertifyjs'

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  confirm(message: string, okCallBak: () => any) {
    alertifyJs.confirm(message);
  }

  public successAlert(content: string) {
    alertifyJs.success(content);
  }

  public errorAlert(content: string) {
    alertifyJs.error(content);
  }

  public warningAlert(content: string) {
    alertifyJs.warning(content);
  }

  public messageAlert(content: string) {
    alertifyJs.message(content);
  }
}
