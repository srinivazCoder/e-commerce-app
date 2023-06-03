import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LogIn, SignUp } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }
  // post the user signup data to api and set data into local storage

  userPresent=new EventEmitter(false);
  
  userSignUp(user: SignUp) {
    this.http.post("http://localhost:3000/users", user, { observe: 'response' })
      .subscribe((result) => {
        console.warn(result);
        if (result) {
          localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['/']);
        }

      })

  }
  // when login user access page (4200/user-auth) redirect to home page

  userAuthReload() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }

  //get the email and password from api & set to local storage and navigate to home page

  userLogin(data: LogIn) {
    this.http.get<SignUp[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`,
      { observe: 'response' }).subscribe((result) => {
        if (result && result.body?.length) {
          this.userPresent.emit(false);
          localStorage.setItem('user', JSON.stringify(result.body[0]));
          this.router.navigate(['/']);
        }else{
          this.userPresent.emit(true);
        }
      });
  }
}
