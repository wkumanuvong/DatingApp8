import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [RouterOutlet, NavComponent, HomeComponent, NgxSpinnerComponent],
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
