import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupwemailComponent } from './signupwemail.component';

describe('SignupwemailComponent', () => {
  let component: SignupwemailComponent;
  let fixture: ComponentFixture<SignupwemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupwemailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupwemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
