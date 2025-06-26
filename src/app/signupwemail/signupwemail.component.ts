import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CallbackType, FRAuth, FRLoginSuccess, FRStep } from '@forgerock/javascript-sdk';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signupwemail',
  imports: [FormsModule],
  templateUrl: './signupwemail.component.html',
  styleUrl: './signupwemail.component.css'
})
export class SignupwemailComponent {
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
  isSuspended = false;
  suspendedMessage = '';
  isLoading = false;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(async params => {
      const suspendedId = params.get('suspendedId');
      console.log('Suspended ID:', suspendedId);
      if (suspendedId) {
        // Optional: Construct full resume URL if needed
        this.isLoading = true;
        const resumeUrl = window.location.href;
        await this.resumeJourney(resumeUrl);
      }
    });
  }

  async onSignUp() {
    if (!this.step) {
      //this.step = await this.authService.startJourney('PasskeySignupWithMultipleEmailTemplates');
      this.step = await this.authService.startJourney('Copy of PassKeyLogin');
    }

    // Fill the form-related fields
    const callbacks = this.step.callbacks;

    callbacks.forEach((cb) => {
      const type = cb.getType();
      switch (type) {
        case CallbackType.NameCallback:
          cb.setInputValue(this.formData.username);
          break;
        case CallbackType.StringAttributeInputCallback:
          const attrName = cb.getOutputByName<string>('name', '');
          switch (attrName) {
            case 'givenName':
              cb.setInputValue(this.formData.givenName);
              break;
            case 'sn':
              cb.setInputValue(this.formData.lastName);
              break;
            case 'mail':
              cb.setInputValue(this.formData.email);
              break;
          }
          break;
        case CallbackType.TermsAndConditionsCallback:
          cb.setInputValue('true');
          break;
      }
    });

    const nextStep = await this.authService.submitStep(this.step);

    if (!nextStep) {
      return;
    }

    if(nextStep instanceof FRStep) {
      const nextCallbacks = nextStep.callbacks;

      if (nextCallbacks[0].getType() === CallbackType.SuspendedTextOutputCallback) {
        this.isSuspended = true;
        this.suspendedMessage = nextCallbacks[0].getOutputByName<string>('message', '');
      }
    }
  }

  async resumeJourney(resumeUrl: string) {
    try {
      const step = await FRAuth.resume(resumeUrl);

      if (step instanceof FRStep) {

        const nextCallbacks = step.callbacks;

        // Look for WebAuthn-related callbacks
        const textOutputCb = nextCallbacks.find(cb => cb.getType() === CallbackType.TextOutputCallback);
        const hiddenCb = nextCallbacks.find(cb => cb.getType() === CallbackType.HiddenValueCallback);

        if (textOutputCb && hiddenCb) {
          const jsCode = textOutputCb.getOutputByName<string>('message', '');

          // Extract publicKey from JS
          const publicKeyMatch = jsCode.match(/var publicKey = ({[\s\S]*?});/);
          if (!publicKeyMatch) {
            console.error('PublicKey object not found in JS');
            return;
          }

          try {
            const func = new Function(`${publicKeyMatch[0]}; return publicKey;`);
            const publicKey = func();

            const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;

            const attestationObject = new Int8Array((credential.response as AuthenticatorAttestationResponse).attestationObject);
            const clientDataJSON = new Uint8Array((credential.response as AuthenticatorAttestationResponse).clientDataJSON);
            const rawId = credential.id;

            // Convert clientDataJSON to plain string (NOT base64)
            const clientDataString = new TextDecoder().decode(clientDataJSON);

            // Convert attestationObject to comma-separated string
            const keyDataString = Array.from(attestationObject).toString();

            // Final value in format: clientDataJSON :: attestationObject :: rawId
            const finalValue = `${clientDataString}::${keyDataString}::${rawId}`;

            hiddenCb.setInputValue(finalValue);

            const finalStep = await this.authService.submitStep(step);

            if (finalStep instanceof FRLoginSuccess) {
              console.log('WebAuthn registration successful!');
              this.isLoading = false;
              this.router.navigate(['dashboard']);
              //this.checkSession();
            } else {
              console.log('More steps required:', finalStep);
            }
          } catch (err) {
            console.error('WebAuthn registration failed:', err);
            hiddenCb.setInputValue(`ERROR::${err}`);
            await this.authService.submitStep(step);
          }
        }
        else {
          console.warn('Next step does not contain WebAuthn callbacks.');
        }
      }
    } catch (err) {
      console.error('Error resuming journey:', err);
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      console.log('User logged out successfully');
    } catch (error: any) {
      console.error('Logout failed:', error);
    }
  }

  checkSession() {
    this.authService.checkSession().subscribe((session) => {
      if (session.isActive) {
        console.log('User already logged in. Redirecting to dashboard.');
        this.router.navigate(['dashboard']);
      } else {
        console.log('User not logged in. Redirecting to login.');
      }
    });
  }
}
