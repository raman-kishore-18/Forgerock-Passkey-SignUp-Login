import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CallbackType, FRStep } from '@forgerock/javascript-sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) { }

  step!: FRStep;
  formData = {
    username: '',
    givenName: '',
    lastName: '',
    email: '',
    promotions: false,
    updates: false,
    terms: false,
  };
  isLoggedIn = false;

  ngOnInit() {
    // Initialize the login component
    this.isLoggedIn = this.authService.checkisLoggedIn();
  }

  async onSignIn() {
  if (!this.step) {
    this.step = await this.authService.startJourney('PassKeyLogin2');
  }

  // Fill username
  const callbacks = this.step.callbacks;
  callbacks.forEach((cb) => {
    const type = cb.getType();
    if (type === CallbackType.NameCallback) {
      cb.setInputValue(this.formData.username);
    }
  });

  const nextStep = await this.authService.submitStep(this.step);

  if (!nextStep) {
    return;
  }

  const nextCallbacks = nextStep.callbacks;
  const textOutputCb = nextCallbacks.find(cb => cb.getType() === CallbackType.TextOutputCallback);
  const hiddenCb = nextCallbacks.find(cb => cb.getType() === CallbackType.HiddenValueCallback);

  if (textOutputCb && hiddenCb) {
    const jsCode = textOutputCb.getOutputByName<string>('message', '');

    // Extract WebAuthn publicKey options from the JS string
    const optionsMatch = jsCode.match(/options\s*=\s*({[\s\S]*?});/);
    if (!optionsMatch) {
      console.error('PublicKey options not found in JS');
      return;
    }

    try {
      // Reconstruct the publicKey object by evaluating cleaned code
      const fixed = optionsMatch[1]
        .replace(/new Int8Array\((\[.*?\])\)\.buffer/g, (_, arr) => {
          const bytes = JSON.parse(arr);
          return `new Uint8Array([${bytes.join(',')}]).buffer`;
        });

      const getPublicKey = new Function(`return ${fixed}`);
      const publicKey = getPublicKey();

      const assertion = await navigator.credentials.get({ publicKey }) as PublicKeyCredential;
      const response = assertion.response as AuthenticatorAssertionResponse;

      const clientDataJSON = new Uint8Array(response.clientDataJSON);
      const authenticatorData = new Int8Array(response.authenticatorData);
      const signature = new Int8Array(response.signature);
      const rawId = new Uint8Array(assertion.rawId);
      const userHandle = new Uint8Array(response.userHandle || []);

      const clientDataStr = new TextDecoder().decode(clientDataJSON);
      const userHandleStr = new TextDecoder().decode(userHandle);
      const finalValue =
        clientDataStr +
        '::' +
        authenticatorData.toString() +
        '::' +
        signature.toString() +
        '::' +
        assertion.id;

      hiddenCb.setInputValue(finalValue);

      const finalStep = await this.authService.submitStep(nextStep);

      if (!finalStep) {
        console.log('User successfully logged in with passkey!');
        this.checkSession();
      } else {
        console.log('More steps required after passkey auth:', finalStep);
      }
    } catch (err) {
      console.error('WebAuthn login failed:', err);
      hiddenCb.setInputValue(`ERROR::${err}`);
      await this.authService.submitStep(nextStep);
    }
  } else {
    console.warn('Next step does not contain WebAuthn callbacks.');
  }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.isLoggedIn = false;
      console.log('User logged out successfully');
    } catch (error: any) {
      console.error('Logout failed:', error);
    }
  }

  checkSession() {
    this.authService.checkSession().subscribe((session) => {
      if (session) {
        console.log('User already logged in. Redirecting to dashboard.');
        this.router.navigate(['dashboard']);
      } else {
        console.log('User not logged in. Redirecting to login.');
        this.router.navigate(['home']);
      }
    });
  }
}
