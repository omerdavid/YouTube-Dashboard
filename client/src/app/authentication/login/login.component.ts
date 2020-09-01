import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginform:FormGroup;
  returnUrl:string='dashboard';
  constructor(private fb:FormBuilder,private http:HttpClient,private router:Router) { }

  ngOnInit(): void {
    this.loginform=this.fb.group({
       userName:[''],
       password:['']
    });
  }
loginUser(){
  const userName=this.loginform.get('userName').value;
  const password=this.loginform.get('password').value;
  console.log('username :',userName,'password :',password)
this.http.get(`api/authenticate/login?userName=${userName}&password=${password} `)
.subscribe((user)=>{
  console.log('user :',user);
     if(!!user)
     this.router.navigate([this.returnUrl]);
     else
     this.router.navigate(['signin']);
}

);
}
}
