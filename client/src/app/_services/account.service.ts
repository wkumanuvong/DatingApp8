import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';

// @Injectable decorator enables Angular's dependency injection system to provide the AccountService instance to other components as needed.
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';
  // A BehaviorSubject that holds the currently logged-in user information.
  // It starts with null to indicate no initial user
  private currentUserSource = new BehaviorSubject<User | null>(null);
  // An observable stream derived from currentUserSource.
  // It provides access to the current user data for other components that subscribe to it.
  currentUser$ = this.currentUserSource.asObservable();

  // Initializes the HttpClient for making HTTP requests.
  constructor(private http: HttpClient) {}

  login(model: any) {
    // Makes a POST request to the account/login API endpoint with the provided login credentials (model).
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      // Uses map operator to transform the response (if successful) into a User object.
      map((response: User) => {
        const user = response;
        // If a user object is returned
        if (user) {
          // Stores the user information in local storage (JSON-stringified).
          localStorage.setItem('user', JSON.stringify(user));
          // Updates the currentUserSource with the user object, notifying subscribers.
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(model: any) {
    // makes a POST request to the account/register endpoint for user registration.
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          // Stores the registered user data in local storage and updates
          localStorage.setItem('user', JSON.stringify(user));
          // Updates the currentUserSource with the provided user object.
          this.currentUserSource.next(user);
        }
      })
    );
  }

  // Allows direct setting of the current user, bypassing authentication requests.
  setCurrentUser(user: User) {
    // Updates the currentUserSource with the provided user object.
    this.currentUserSource.next(user);
  }

  logout() {
    // Clears the user information from local storage.
    localStorage.removeItem('user');
    // Updates the currentUserSource with null to indicate no logged-in user.
    this.currentUserSource.next(null);
  }
}
