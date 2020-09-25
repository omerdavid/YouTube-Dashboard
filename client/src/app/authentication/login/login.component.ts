import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
  loginform:FormGroup;
  returnUrl:string='dashboard';
    sub:Subscription;
    constructor(private fb:FormBuilder,private authService:AuthService,private router:Router,private aRoute:ActivatedRoute) { }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.loginform=this.fb.group({
       userName:[''],
       password:['']
    });
   this.sub= this.aRoute.queryParams.subscribe(params=>!!params['returnUrl']?this.returnUrl=params['returnUrl']:this.returnUrl='dashboard');
  }

loginUser(){
  const userName=this.loginform.get('userName').value;
  const password=this.loginform.get('password').value;

 

this.authService.authenticate(userName,password)
.subscribe((user)=>{

  
     if(!!user){
    
       localStorage.setItem('currentuser',user.token);
      
     this.router.navigate([this.returnUrl]);
     }
     else{
     
      this.router.navigate(['signin']);
     
    }
}

);
}
}
