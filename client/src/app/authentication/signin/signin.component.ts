import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';


@Component({
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
signInform
  :FormGroup;
  returnUrl:string='dashboard';
    sub:Subscription;
    message:string;
    constructor(private fb:FormBuilder,private authService:AuthService,private router:Router,private aRoute:ActivatedRoute) { }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.signInform=this.fb.group({
       userName:[''],
       password:['']
    });
   this.sub= this.aRoute.queryParams.subscribe(params=>this.returnUrl=params['returnUrl']);
  }

signIn(){
  const userName=this.signInform.get('userName').value;
  const password=this.signInform.get('password').value;

 

this.authService.signIn(userName,password)
.subscribe((res)=>{
  console.log(res);
     if(!!res.data){
       localStorage.setItem('token',res.data.token);
     this.router.navigate(['dashboard']);
     }
     else{
this.message=res.error.statusCode==409?'User already exist':'Server error';
     this.router.navigate(['signin']);
     }
}

);
}

}
