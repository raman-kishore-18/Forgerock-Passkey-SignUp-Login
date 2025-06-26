import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauthcallback',
  imports: [],
  templateUrl: './oauthcallback.component.html',
  styleUrl: './oauthcallback.component.css'
})
export class OauthcallbackComponent {
  private clientId: string = 'demo-mfe-sso';
  private redirectUri: string = 'http://localhost:4202/callback';
  private codeVerifier: string = '';
  private tokenEndpoint = 'https://openam-informa-trial.forgeblocks.com:443/am/oauth2/alpha/access_token';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.codeVerifier = sessionStorage.getItem('code_verifier') || '';
    this.route.queryParamMap.subscribe(params => {
      const code = params.get('code');
      if (!code) {
        console.error('No authorization code found in URL');
        return;
      }
      this.exchangeCodeForToken(code);
    });
  }

  private exchangeCodeForToken(code: string) {
    let body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', this.redirectUri)
      .set('client_id', this.clientId);

    if (this.codeVerifier) {
      body = body.set('code_verifier', this.codeVerifier);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post(this.tokenEndpoint, body.toString(), { headers }).subscribe({
      next: (tokens) => {
        console.log('Tokens received:', tokens);
        // Save tokens in localStorage/sessionStorage or a service
        // Redirect to dashboard or other page
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Token exchange failed', err);
      },
    });
  }
}
