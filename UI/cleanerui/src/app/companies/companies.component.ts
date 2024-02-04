import { Component, OnInit } from '@angular/core';
import { CleaningHistory } from '../model/cleaningHistory.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openEmail(email: string) {
    const subject = 'Inquiry';
    let body = '';

    const item = localStorage.getItem("cleaning");
    if (item) {
      const ch: CleaningHistory = JSON.parse(item);

      if (ch && ch.date) {
        const dateObj = new Date(ch.date);

        if (!isNaN(dateObj.getTime())) { 
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1;
          const day = dateObj.getDate();

          const formattedMonth = month < 10 ? `0${month}` : month;
          const formattedDay = day < 10 ? `0${day}` : day;

          const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

          const body = `Hello, I would like to inquire about your services. I would like you to schedule cleaning on day: ${formattedDate}. Thank you.`;
          const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

          window.location.href = mailtoLink;
          this.router.navigate(['/home'])
        } else {
          console.error('Invalid date format');
        }
      }
    }
  }

  close() {
    this.router.navigate(['/home'])
  }
}
