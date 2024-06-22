import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';

// @Injectable decorator enables Angular's dependency injection system to provide the AccountService instance to other components as needed.
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private likeService = inject(LikesService);
  baseUrl = environment.apiUrl;
  // A BehaviorSubject that holds the currently logged-in user information.
  // It starts with null to indicate no initial user
  //private currentUserSource = new BehaviorSubject<User | null>(null);
  // An observable stream derived from currentUserSource.
  // It provides access to the current user data for other components that subscribe to it.
  //currentUser$ = this.currentUserSource.asObservable();
  currentUser = signal<User | null>(null);
  roles = computed(() => {
    const user = this.currentUser();
    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    }
    return [];
  });
  

  login(model: any) {
    // Makes a POST request to the account/login API endpoint with the provided login credentials (model).
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      // Uses map operator to transform the response (if successful) into a User object.
      map((user) => {
        // If a user object is returned
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any) {
    // makes a POST request to the account/register endpoint for user registration.
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  // Allows direct setting of the current user, bypassing authentication requests.
  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);

    // Stores the registered user data in local storage and updates
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.likeService.getLikeIds();
  }

  logout() {
    // Clears the user information from local storage.
    localStorage.removeItem('user');
    // Updates the currentUser with null to indicate no logged-in user.
    this.currentUser.set(null);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
