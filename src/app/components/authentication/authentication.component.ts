import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  showSpinner = false;
  showCard = false;

  constructor(private router: Router,
              private readonly route: ActivatedRoute,
              private authService: AuthenticationService,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {



    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    //this.titleService.setTitle(this.title);
    if (this.authService.isSignedIn) {
      this.router.navigateByUrl(this.returnUrl);
    }
    this.loginForm = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      passwordCtrl:['',Validators.required]


    });
    this.authService.whenLoaded().subscribe(() => {
      this.showCard = true;
    });



}

// convenience getter for easy access to form fields
 get f() { return this.loginForm.controls; }




    public login()
    {
      this.authService.login(this.f.firstCtrl.value,this.f.passwordCtrl.value);
    }





}
