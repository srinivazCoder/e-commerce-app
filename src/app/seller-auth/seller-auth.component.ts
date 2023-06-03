import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwIfEmpty } from 'rxjs';
import { SignUp } from '../data-type';
import { SellerService } from '../services/seller.service';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent implements OnInit {

  authError:string="";

  constructor(private seller: SellerService, private router: Router) { }

  ngOnInit(): void {
    this.seller.reloadSeller();
  }

  signUp(data: SignUp): void {
    //console.log(data);
    this.seller.userSignUp(data);
  }
  logIn(data: SignUp){
    this.authError="";
    this.seller.userLogin(data);
    this.seller.isLoginError.subscribe((error)=>{
      if(error){
        this.authError="Email or Password is not correct";
      }
    })
  }
  

  showLog=false;
  ShowLogin(){
   if(!this.showLog){
     this.showLog = true;
   }else{
    this.showLog=false;
   }
  }

}
