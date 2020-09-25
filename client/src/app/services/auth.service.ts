import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { User } from '../authentication/models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResolvedData } from '../infrastructure/models/resolvedData';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,) { }
  public isAuthenticated(): boolean {
    let jwtHelper: JwtHelperService = new JwtHelperService();
    const token = localStorage.getItem('token');
    console.log('token isAuth: ',token);
    // Check whether the token is expired and return
    // true or false
    return !jwtHelper.isTokenExpired(token);
  }
  public authenticate(userName,password):Observable<User>{
  return  this.http.get<User>(`api/authenticate/login?userName=${userName}&password=${password} `);
  }
  public signIn(userName,password){
    return  this.http.get<ResolvedData<User>>(`api/authenticate/signup?userName=${userName}&password=${password} `).pipe(map(v=>v.data));
  }
  public logout(){
   const token= localStorage.getItem('currentuser');
   console.log('token :',token);
    localStorage.removeItem('currentUser');

    return  this.http.get(`api/authenticate/logout?token=${token}`);
  }
}
