import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient
  ) {}

  private url = environment.url + '/transporte';
  private userZulema = new BehaviorSubject<any | null>(null);

  registerZulema(user: {
    name: string;
    lastname: string;
    email: string;
    password: string;
    roles: string[];
  }) {
    return this.http
      .post(this.url + '/register', user)
      .pipe(catchError((err) => of(err)));
  }

  loginZulema(user: { email: string; password: string }) {
    const userTest = {
      usuarioEmail: user.email,
      usuarioPassword: user.password,
    };
    return this.http
      .post(this.url + '/login', userTest)
      .pipe(tap((x: any) => localStorage.setItem('jwt', x.token)))
      .pipe(tap((x: any) => this.userZulema.next(jwtDecode(x.token))));
    // .pipe(
    //   catchError((err: any) => {
    //     if (err.status === 0) {
    //       return of({ error: { internal: "Something went wrong" } });
    //     }
    //     return of(err);
    //   })
    // );
  }
  getAuthToken() {
    return localStorage.getItem('jwt');
  }

  getClaimsFromToken() {
    const token = this.getAuthToken();
    if (token) {
      return this.getClaims(token);
    } else {
      return null;
    }
  }

  getClaims(token: string) {
    const decodedToken = jwtDecode(token);
    const claims = decodedToken as { userId: number; roles: string[] };
    return claims;
  }

  getEmail() {
    const token = this.getAuthToken();
    const decodedToken = jwtDecode(token!);
    const email = decodedToken as { sub: string };
    return email.sub;
  }

  refreshToken() {
    return this.http.get<string>(this.url + '/refreshtoken');
  }

  logoutZulema() {
    localStorage.removeItem('jwt');
  }
}
