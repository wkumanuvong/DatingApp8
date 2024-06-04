import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  // An object to hold login credentials (User).
  model: any = {};
 
  constructor(public accountService: AccountService) {}

  // Decorators for defining Angular components and lifecycle hooks.
  ngOnInit(): void {
  }

  // Called when the user submits the login form
  login() {
    // Calls the login() method of the AccountService with the login credentials stored in the model object.
    this.accountService.login(this.model).subscribe({
      // The next callback handles the successful login response (User)
      next: (response) => {
        console.log(response);
      },
      // The error callback handles any errors that occur during the login process.
      error: (error) => console.log(error),
    });
  }

  // Called when the user clicks a logout button or triggers a logout action.
  logout() {
    // Calls the logout() method of the AccountService
    this.accountService.logout();
  }
}
