// src/app/services/auth.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config, FRAuth, FRCallback, FRLoginFailure, FRLoginSuccess, FRStep, FRUser, NameCallback, PasswordCallback, Step, TokenManager, OAuth2Client } from '@forgerock/javascript-sdk';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  private baseUrl = 'https://openam-informa-trial.forgeblocks.com/am';

  constructor(private http: HttpClient) {
    Config.set({
      serverConfig: {
        baseUrl: this.baseUrl,
        timeout: 5000,
      },
      realmPath: '/alpha',
      tree: ''
    });
  }

  setConfig(tree: string) {
    Config.set({
      serverConfig: {
        baseUrl: this.baseUrl,
        timeout: 5000,
      },
      realmPath: '/alpha',
      tree: tree
    });
  }
  async startJourney(tree: string): Promise<FRStep> {
    this.setConfig(tree);
    const result = await FRAuth.next();
    if (result instanceof FRStep) {
      return result;
    } else {
      throw new Error('Authentication flow did not return a step.');
    }
  }

  async submitStep(step: FRStep): Promise<FRStep | undefined> {
    const result = await FRAuth.next(step);
    if (result instanceof FRStep) {
      return result;
    } else {
      return undefined;
    }
  }

  checkSession(): Observable<boolean> {
    const url = `${this.baseUrl}/json/realms/root/realms/alpha/sessions?_action=getSessionInfo`;

    const headers = new HttpHeaders({
      'Accept-API-Version': 'resource=2.1',
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(url, {}, { headers, withCredentials: true }).pipe(
      map((response) => {
        console.log('✅ Session info:', response);
        return true;
      }),
      catchError((error) => {
        console.warn('⛔ Session invalid or not logged in', error);
        return of(false);
      })
    );
  }

  checkisLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  setLoggedIn(value: boolean): void {
    this.isLoggedIn = value;
  }

  async logout(): Promise<void> {
    await FRUser.logout();
    this.isLoggedIn = false;
    console.log('Logged out');
  }


}
