import { Component, OnInit } from '@angular/core';
import { faCoffee, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';


@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css']
})
export class SellerHomeComponent implements OnInit {

  icon = faTrash;
  editIcon = faEdit;

  productList: undefined | product[];

  productMessage: undefined | string;

  constructor(private product: ProductService) { }

  ngOnInit(): void {
    this.list();
  }

  DeleteProduct(id: number) {
    this.product.DeleteProduct(id).subscribe((result) => {
      console.log(result)
      if (result) {
        this.productMessage = "Product is deleted!"
      }
      this.list();
    });
    setTimeout(() => {
      this.productMessage = ""
    }, 3000);
  }

  list() {
    this.product.productList().subscribe((result) => {
      console.log(result)
      this.productList = result;
    })
  }





}
