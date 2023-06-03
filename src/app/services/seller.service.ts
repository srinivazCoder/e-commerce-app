import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { LogIn, SignUp } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false); //for enable the rotuer when after subscribe
  isLoginError = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  userSignUp(data: SignUp) {
    this.http.post("http://localhost:3000/seller",
      data,
      {
        observe: "response",
      }).subscribe(result => {
        this.isSellerLoggedIn.next(true);//for router when router should enable
        localStorage.setItem("seller", JSON.stringify(result.body));//create the obejects into local storage as seller
        this.router.navigate(["seller-home"]);//navigate the router
        console.log(result);
      })


    
  }
  reloadSeller() {
    if (localStorage.getItem("seller")) {
      this.isSellerLoggedIn.next(true);

      this.router.navigate(["seller-home"]);
    }
  }

  userLogin(data: LogIn) {
    console.log(data);
    this.http.get(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
      {
        observe: "response",
      }).subscribe((result: any) => {

        console.log(result);
        if (result && result.body && result.body.length) {
          console.log("User Logged In");

          localStorage.setItem("seller", JSON.stringify(result.body));
          this.router.navigate(["seller-home"]);
        } else {
          console.log("user login failed"); 
          this.isLoginError.emit(true);
        }
      })

  }


}
