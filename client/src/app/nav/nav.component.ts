import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  // An object to hold login credentials (User).
  model: any = {};

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // Decorators for defining Angular components and lifecycle hooks.
  ngOnInit(): void {}

  // Called when the user submits the login form
  login() {
    // Calls the login() method of the AccountService with the login credentials stored in the model object.
    this.accountService.login(this.model).subscribe({
      next: () => this.router.navigateByUrl('/members'),
      // The error callback handles any errors that occur during the login process.
      //error: (error) => this.toastr.error(error.error),
    });
  }

  // Called when the user clicks a logout button or triggers a logout action.
  logout() {
    // Calls the logout() method of the AccountService
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
