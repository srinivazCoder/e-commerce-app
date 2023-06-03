import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, order } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice:number|undefined;

  orderMessage:string|undefined;

  cartData:cart[]|undefined;

  constructor(private product:ProductService,private router:Router) { }

  ngOnInit(): void {
    this.product.currentCart().subscribe((result) => {
      //console.log(result);
      this.cartData=result;
      
      let price=0;
      result.forEach((data:cart) => {
        if(data.quantity){
          price = price + (+data.price * + data.quantity);
        }
        this.totalPrice=price+(price/10)+100-(price/10);
        //console.warn(this.totalPrice);
        
      });
      //console.log(price);
     

    })
  }
  orderNow(data:{email:string,address:string,contact:number}){
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if(this.totalPrice){
      let orderData:order={
        ...data,
        totalPrice:this.totalPrice,
        userId,
         id:undefined
      }
      this.cartData?.forEach((item)=>{
        setTimeout(()=>{
          item.id && this.product.deleteCartItems(item.id);
        },700);
        
      })
      this.product.orderNow(orderData).subscribe((result)=>{
        if(result){
          this.orderMessage="Your order has been placed!";
          setTimeout(()=>{
            this.router.navigate(['/my-orders']);
            this.orderMessage=undefined;
          },4000);
          
        }
      })
    }
  }
}
