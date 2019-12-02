import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-authentication-required',
  templateUrl: './authentication-required.component.html',
  styleUrls: ['./authentication-required.component.scss']
})
export class AuthenticationRequiredComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  showSpinner = false;
  showCard = false;

  constructor(private router: Router,
              private readonly route: ActivatedRoute,
              private authService: AuthenticationService,
              private _formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.showCard= this.route.snapshot.queryParams['ready'];
    //this.titleService.setTitle(this.title);
    if (this.authService.isSignedIn) {
      this.router.navigateByUrl(this.returnUrl);
    }
    this.loginForm = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      passwordCtrl:['',Validators.required],
      firstNameCtrl: ['', Validators.required],
      lastNameCtrl: ['', Validators.required],
      emailCtrl: ['', Validators.required]

    });

}
  public register()
  {
    this.authService.login();
  }

  ngOnDestroy(){
    this.showCard = false;
    console.log("destroy");
  }

}
