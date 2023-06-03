import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, priceSummary } from '../data-type';

import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {



  constructor(private product: ProductService, private router:Router) { }

  cartData: cart[] | any | undefined;

  cartSummary:priceSummary|undefined;

  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
  };

  ngOnInit(): void {
    this.loadDetails()
  }

checkOut(){
  this.router.navigate(['/checkout']);
}

removeToCart(cartId:number|undefined){
  cartId && this.product.removeToCart(cartId)
  .subscribe((result)=>{
   
      this.loadDetails();
     // this.removeCart=false;
    
  })
}

loadDetails(){
  this.product.currentCart().subscribe((result) => {
    //console.log(result);
    this.cartData = result;
    let price=0;
    this.cartData.forEach((data:cart) => {
      if(data.quantity){
        price = price + (+data.price * + data.quantity);
      }
      
    });
    //console.log(price);
    this.priceSummary.price=price;
    this.priceSummary.discount=price/10;
    this.priceSummary.tax=price/10;
    this.priceSummary.delivery=100;
    this.priceSummary.total=price+(price/10)+100-(price/10);
    
    this.cartSummary=this.priceSummary;
      if(!this.cartData.length){
        this.router.navigate(['/']);
      }
  })
}

}
