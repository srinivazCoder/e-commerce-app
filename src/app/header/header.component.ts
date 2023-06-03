import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuType: string = "Default";
  sellerName: string = "";
  user_Name:string="";

  cartItems=0;

  searchResult:undefined|product[];
  

  constructor(private route: Router, private product:ProductService) { }

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        console.log(val.url); {
          if (localStorage.getItem('seller') && val.url.includes('seller')) {
           // console.warn("In seller Area");
            this.menuType = "seller";
            if (localStorage.getItem('seller')) {
              let sellerStore = localStorage.getItem('seller');
              let sellerData = sellerStore && JSON.parse(sellerStore)[0];
              this.sellerName = sellerData.name;
            }
          } else if(localStorage.getItem('user')){
            let userStore= localStorage.getItem('user');
            let userData= userStore && JSON.parse(userStore);
            
            this.user_Name= userData.name;
            //console.warn(this.user_Name)
            this.menuType="user";
            this.product.getCartList(userData.id)
          }
          else {
           // console.warn("outside seller");
            this.menuType = "Default";
          }
        }
      }
    });
    let cartData = localStorage.getItem('localCart');
    if(cartData){
      this.cartItems=JSON.parse(cartData).length;
      
    }
    this.product.cartData.subscribe((items)=>{
      this.cartItems=items.length;
    });
  }

  logout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
  }

  userLogout(){
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']);
    this.product.cartData.emit([]);
  }
  searchProduct(query:KeyboardEvent){
    if(query){
      const element = query.target as HTMLInputElement;
      //console.warn(element.value);
      this.product.searchProducts(element.value).subscribe((data)=>{
          //console.log(data);
          if(data.length>5){
            data.length=5;
          }
          
          this.searchResult=data;
      });
    }
  }

  hideSearch(){
    this.searchResult = undefined;
  }
  submitSearch(val:string){
    //console.log(val);
    this.route.navigate([`search/${val}`]);
  }

  redirectToDetails(id:number){
    this.route.navigate(['/details/'+id]);
  }
}
