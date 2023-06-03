import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productData: undefined | product;

  productQuantity: number = 1;

  removeCart=false;

  cartData:product|undefined;

  constructor(private activeRoute: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {
    let productId = this.activeRoute.snapshot.paramMap.get("productId");
    console.warn(productId);
    productId && this.product.getProduct(productId).subscribe((result) => {
      this.productData = result;
    });

    //items of cart contain same item 
    let cartData = localStorage.getItem('localCart');
    if(cartData && productId){
      let items = JSON.parse(cartData);
          items= items.filter((item:product)=>productId==item.id.toString());
          if(items.length){
            this.removeCart=true;
          }else{
            this.removeCart=false;
          }

    }
    let user = localStorage.getItem('user');
    if(user){
      let userId = user && JSON.parse(user).id;
      this.product.getCartList(userId);
      this.product.cartData.subscribe((result)=>{
       let item =  result.filter((item:product)=>productId?.toString()===item.productId?.toString());
       if(item.length){
        this.cartData=item[0];
        this.removeCart=true;
       }
      });
    }
    
  }
  handleQuantity(val:string){
    if(this.productQuantity <20 && val==='plus'){
      this.productQuantity++;
    }else if(this.productQuantity > 1 && val==='min'){
      this.productQuantity--;
    }
  }

  addToCart(){
    if(this.productData){
      this.removeCart=true;
      this.productData.quantity=this.productQuantity;
      if(!localStorage.getItem('user')){
        this.product.localAddtoCart(this.productData)
       // console.warn(this.productData.quantity);
      }else{
        //console.warn("user is logged in!");
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        //console.warn("USER_ID",userId);
        
        let cartData:cart={
          ...this.productData,
          userId,
          productId:this.productData.id,
        }
       // console.warn(cartData);
        delete cartData.id;
        this.product.addToCart(cartData).subscribe((result)=>{
          if(result){
            //alert("product is add to cart");
            this.product.getCartList(userId);
            this.removeCart=true;
          }
        });
        
      }
     
    }
  }
  removeToCart(productId:number){
    if(!localStorage.getItem('user')){
      this.product.removeItemFormCart(productId);
      
    }else{
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;
       // console.warn(this.cartData);
        this.cartData && this.product.removeToCart(this.cartData.id)
        .subscribe((result)=>{
          if(result){
            
            this.product.getCartList(userId);
           // this.removeCart=false;
          }
        })
    }
    this.removeCart=false;
  

  }

}
