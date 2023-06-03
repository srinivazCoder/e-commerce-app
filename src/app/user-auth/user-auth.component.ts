import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { cart, LogIn, product, SignUp } from '../data-type';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {

  showForm: boolean = false;
  userError: boolean = false;


  constructor(private user: UserService, private product: ProductService) { }

  ngOnInit(): void {
    this.user.userAuthReload();
  }

  signUp(data: SignUp) {
    this.user.userSignUp(data);

  }
  user_LogIn(data: LogIn) {
    this.user.userLogin(data);
    this.user.userPresent.subscribe((data) => {
      if (data) {
        this.userError = data;
      } else {
        this.localCartToRemoteCart();
      }

    });
  }
  showLog() {
    if (!this.showForm) {
      this.showForm = true;
    } else {
      this.showForm = false;
    }

  }

  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart'); // get localCart into data

    let user = localStorage.getItem('user');// get user into user
    //console.warn("User :",user)
    let userId = user && JSON.parse(user).id; // get userId if user is true
    
    if (data) {
      let cartDataList: product[] = JSON.parse(data); //data obejects into carDataList form of product[]
      cartDataList.forEach((product: product, index) => {

        let cartData: cart = {
          ...product,
          productId: product.id,
          userId
        };
        delete cartData.id;
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result) => {
            if (result) {
              console.warn("item stored in DB");
            }
          })

          if (cartDataList.length === index + 1) {
            localStorage.removeItem('localCart');
          }

        }, 3000);
      });
    }

    setTimeout(() => {
      this.product.getCartList(userId);
    }, 2000);

  }



}
