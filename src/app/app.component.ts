import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CallbackType, FRStep } from '@forgerock/javascript-sdk';
import { AuthService } from './auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'mfe2-root',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // step!: FRStep;
  // formData = {
  //   username: '',
  //   givenName: '',
  //   lastName: '',
  //   email: '',
  //   promotions: false,
  //   updates: false,
  //   terms: false,
  // };
  // isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // this.authService.checkSession().subscribe((session) => {
    //   if (session) {
    //     console.log('User already logged in. Redirecting to dashboard.');
    //     this.router.navigate(['dashboard']);
    //   } else {
    //     console.log('User not logged in. Redirecting to login.');
    //   }
    // });
  }

  // goToLogin() {
  //   this.router.navigate(['login']);
  // }

  // goToSignUp() {
  //   this.router.navigate(['signup']);
  // }
  // async logout() {
  //   try {
  //     await this.authService.logout();
  //     this.isLoggedIn = false;
  //     console.log('User logged out successfully');
  //   } catch (error: any) {
  //     console.error('Logout failed:', error);
  //   }
  // }

  // // async onSignIn() {
  // //   if (!this.step) {
  // //     this.step = await this.authService.startJourney('PassKeyLogin2');
  // //   }

  // //   // Fill the form-related fields
  // //   const callbacks = this.step.callbacks;

  // //   callbacks.forEach((cb) => {
  // //     const type = cb.getType();
  // //     switch (type) {
  // //       case CallbackType.NameCallback:
  // //         cb.setInputValue(this.formData.username);
  // //         break;
  // //     }
  // //   });

  // //   const nextStep = await this.authService.submitStep(this.step);

  // //   if (!nextStep) {
  // //     console.log('User successfully logged in');
  // //     this.isLoggedIn = true;
  // //     return;
  // //   }

  // //   console.log('More steps required:', nextStep);
  // // }

  // async onSignIn() {
  // if (!this.step) {
  //   this.step = await this.authService.startJourney('PassKeyLogin2');
  // }

  // // Fill username
  // const callbacks = this.step.callbacks;
  // callbacks.forEach((cb) => {
  //   const type = cb.getType();
  //   if (type === CallbackType.NameCallback) {
  //     cb.setInputValue(this.formData.username);
  //   }
  // });

  // const nextStep = await this.authService.submitStep(this.step);

  // if (!nextStep) {
  //   return;
  // }

  // const nextCallbacks = nextStep.callbacks;
  // const textOutputCb = nextCallbacks.find(cb => cb.getType() === CallbackType.TextOutputCallback);
  // const hiddenCb = nextCallbacks.find(cb => cb.getType() === CallbackType.HiddenValueCallback);

  // if (textOutputCb && hiddenCb) {
  //   const jsCode = textOutputCb.getOutputByName<string>('message', '');

  //   // Extract WebAuthn publicKey options from the JS string
  //   const optionsMatch = jsCode.match(/options\s*=\s*({[\s\S]*?});/);
  //   if (!optionsMatch) {
  //     console.error('PublicKey options not found in JS');
  //     return;
  //   }

  //   try {
  //     // Reconstruct the publicKey object by evaluating cleaned code
  //     const fixed = optionsMatch[1]
  //       .replace(/new Int8Array\((\[.*?\])\)\.buffer/g, (_, arr) => {
  //         const bytes = JSON.parse(arr);
  //         return `new Uint8Array([${bytes.join(',')}]).buffer`;
  //       });

  //     const getPublicKey = new Function(`return ${fixed}`);
  //     const publicKey = getPublicKey();

  //     const assertion = await navigator.credentials.get({ publicKey }) as PublicKeyCredential;
  //     const response = assertion.response as AuthenticatorAssertionResponse;

  //     const clientDataJSON = new Uint8Array(response.clientDataJSON);
  //     const authenticatorData = new Uint8Array(response.authenticatorData);
  //     const signature = new Uint8Array(response.signature);
  //     const rawId = new Uint8Array(assertion.rawId);
  //     const userHandle = new Uint8Array(response.userHandle || []);

  //     const clientDataStr = new TextDecoder().decode(clientDataJSON);
  //     const userHandleStr = new TextDecoder().decode(userHandle);
  //     const finalValue =
  //       clientDataStr +
  //       '::' +
  //       authenticatorData.toString() +
  //       '::' +
  //       signature.toString() +
  //       '::' +
  //       assertion.id +
  //       '::' +
  //       userHandleStr;

  //     hiddenCb.setInputValue(finalValue);

  //     const finalStep = await this.authService.submitStep(nextStep);

  //     if (!finalStep) {
  //       console.log('User successfully logged in with passkey!');
  //       this.checkSession();
  //     } else {
  //       console.log('More steps required after passkey auth:', finalStep);
  //     }
  //   } catch (err) {
  //     console.error('WebAuthn login failed:', err);
  //     hiddenCb.setInputValue(`ERROR::${err}`);
  //     await this.authService.submitStep(nextStep);
  //   }
  // } else {
  //   console.warn('Next step does not contain WebAuthn callbacks.');
  // }
  // }


  // async onSignUp() {
  // if (!this.step) {
  //   this.step = await this.authService.startJourney('PassKeyLogin');
  // }

  // // Fill the form-related fields
  // const callbacks = this.step.callbacks;

  // callbacks.forEach((cb) => {
  //   const type = cb.getType();
  //   switch (type) {
  //     case CallbackType.NameCallback:
  //       cb.setInputValue(this.formData.username);
  //       break;
  //     case CallbackType.StringAttributeInputCallback:
  //       const attrName = cb.getOutputByName<string>('name', '');
  //       switch (attrName) {
  //         case 'givenName':
  //           cb.setInputValue(this.formData.givenName);
  //           break;
  //         case 'sn':
  //           cb.setInputValue(this.formData.lastName);
  //           break;
  //         case 'mail':
  //           cb.setInputValue(this.formData.email);
  //           break;
  //       }
  //       break;
  //     case CallbackType.TermsAndConditionsCallback:  
  //       cb.setInputValue('true');
  //       break;
  //   }
  // });

  // const nextStep = await this.authService.submitStep(this.step);

  // if (!nextStep) {
  //   return;
  // }

  // const nextCallbacks = nextStep.callbacks;

  // // Look for WebAuthn-related callbacks
  // const textOutputCb = nextCallbacks.find(cb => cb.getType() === CallbackType.TextOutputCallback);
  // const hiddenCb = nextCallbacks.find(cb => cb.getType() === CallbackType.HiddenValueCallback);

  // if (textOutputCb && hiddenCb) {
  //   const jsCode = textOutputCb.getOutputByName<string>('message', '');

  //   // Extract publicKey from JS
  //   const publicKeyMatch = jsCode.match(/var publicKey = ({[\s\S]*?});/);
  //   if (!publicKeyMatch) {
  //     console.error('PublicKey object not found in JS');
  //     return;
  //   }

  //   try {
  //     const func = new Function(`${publicKeyMatch[0]}; return publicKey;`);
  //     const publicKey = func();

  //     const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;

  //     const attestationObject = new Int8Array((credential.response as AuthenticatorAttestationResponse).attestationObject);
  //     const clientDataJSON = new Uint8Array((credential.response as AuthenticatorAttestationResponse).clientDataJSON);
  //     const rawId = credential.id;

  //     // Convert clientDataJSON to plain string (NOT base64)
  //     const clientDataString = new TextDecoder().decode(clientDataJSON);

  //     // Convert attestationObject to comma-separated string
  //     const keyDataString = Array.from(attestationObject).toString();

  //     // Final value in format: clientDataJSON :: attestationObject :: rawId
  //     const finalValue = `${clientDataString}::${keyDataString}::${rawId}`;

  //     hiddenCb.setInputValue(finalValue);

  //     const finalStep = await this.authService.submitStep(nextStep);

  //     if (!finalStep) {
  //       console.log('WebAuthn registration successful!');
  //       this.checkSession();
  //     } else {
  //       console.log('More steps required:', finalStep);
  //     }
  //   } catch (err) {
  //     console.error('WebAuthn registration failed:', err);
  //     hiddenCb.setInputValue(`ERROR::${err}`);
  //     await this.authService.submitStep(nextStep);
  //   }
  // }
  // else {
  //     console.warn('Next step does not contain WebAuthn callbacks.');
  // }
  // }
}
