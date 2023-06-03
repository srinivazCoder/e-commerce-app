import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit {

  productData: undefined | product;

  productUpdatedMessage: undefined | string;

  constructor(private route: ActivatedRoute, private product: ProductService,private routenav:Router) { }

  ngOnInit(): void {
    let productId = this.route.snapshot.paramMap.get('id');
    console.warn(productId);
    productId && this.product.getProduct(productId).subscribe((data) => {
      console.log(data);
      this.productData = data;
    })
  }
  AddProduct(data: product) {
    if(this.productData){
      data.id=this.productData.id;
    }
    this.product.updateProduct(data).subscribe((result) => {
      if (result) {
        this.productUpdatedMessage = "Product is Updated!";
      }
    }
    );

    
    setTimeout(()=>{
      this.productUpdatedMessage="";
      this.routenav.navigate(['seller-home']);
    },3000);
    
  }

}

