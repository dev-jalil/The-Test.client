import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, throwError } from 'rxjs';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SignupRequestPayload } from '../signup/signup-request.payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginPath = environment.apiUrl + 'identity/login';
  private signupPath = environment.apiUrl + 'identity/register';

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  // refreshTokenPayload = {
  //   refreshToken: this.getRefreshToken(),
  //   username: this.getUserName(),
  // };

  constructor(
    private httpClient: HttpClient,
    private localStorage: LocalStorageService
  ) {}

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post(this.signupPath, signupRequestPayload, {
      responseType: 'text',
    });
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient
      .post<LoginResponse>(this.loginPath, loginRequestPayload)
      .pipe(
        map((data) => {
          this.localStorage.store(
            'authenticationToken',
            data.authenticationToken
          );

          this.loggedIn.emit(true);
          //this.username.emit(data.username);
          return true;
        })
      );
  }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  // refreshToken() {
  //   return this.httpClient
  //     .post<LoginResponse>(
  //       'https://analysethistendanceapispring.azurewebsites.net/api/auth/refresh/token',
  //       this.refreshTokenPayload
  //     )
  //     .pipe(
  //       tap((response) => {
  //         this.localStorage.clear('authenticationToken');
  //         this.localStorage.clear('expiresAt');

  //         this.localStorage.store(
  //           'authenticationToken',
  //           response.authenticationToken
  //         );
  //         this.localStorage.store('expiresAt', response.expiresAt);
  //       })
  //     );
  // }

  logout() {
    // this.httpClient
    //   .post(
    //     'https://analysethistendanceapispring.azurewebsites.net/api/auth/logout',
    //     this.refreshTokenPayload,
    //     {
    //       responseType: 'text',
    //     }
    //   )
    //   .subscribe(
    //     (data) => {
    //       console.log(data);
    //     },
    //     (error) => {
    //       throwError(error);
    //     }
    //   );
    this.localStorage.clear('authenticationToken');
    // this.localStorage.clear('username');
    // this.localStorage.clear('refreshToken');
    // this.localStorage.clear('expiresAt');
  }

  // getUserName() {
  //   return this.localStorage.retrieve('username');
  // }
  // getRefreshToken() {
  //   return this.localStorage.retrieve('refreshToken');
  // }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }
}
