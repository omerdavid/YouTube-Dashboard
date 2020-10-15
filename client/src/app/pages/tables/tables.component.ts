import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

export interface Car {
  id?;
  vin?;
  year?;
  brand?;
  color?;
  price?;
  saleDate?;
}



@Component({
  selector: "app-tables",
  templateUrl: "tables.component.html",
 
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  public displayedColumns: string[] = ['videoId', 'title', 'channelTitle', 'description'];
 
//   res:Car[]= [
//     {"brand": "VW", "year": 2012, "color": "Orange", "vin": "dsad231ff","id":0},
//     {"brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345","id":0},
//     {"brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr","id":0},
//     {"brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh","id":0},
//     {"brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34","id":0},
//     {"brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj","id":0},
//     {"brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr","id":0},
//     {"brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34","id":0},
//     {"brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5","id":0},
//     {"brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s","id":0}
// ]
cols: any[];
res:any[];
selectedProducts:any[];
product:any;
submitted:boolean;
productDialog: boolean;

  constructor(private httpClient:HttpClient,private messageService: MessageService, private confirmationService: ConfirmationService) {}
  errorHandler(error: HttpErrorResponse) {
    console.log(error.error);
    return Observable.throw(error.message || "server error.");
}
  ngOnInit() {

let keyword='גרעיני עפולה';
    this.httpClient.get(`api/youTubeList?searchText=${keyword}`)
    .pipe(map((r:any)=>r.res1.map((f:any)=>{return {videoId:f.id.videoId, title:f.snippet.title,channelTitle:f.snippet.channelTitle,description:f.snippet.description}})),catchError(this.errorHandler))
    .subscribe(d=>{
     this.res=d;
     console.log(this.res);
    });
  }
  deleteSelectedProducts() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.res = this.res.filter(val => !this.selectedProducts.includes(val));
            this.selectedProducts = null;
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
        }
    });
}

editProduct(product: any) {
    this.res = {...product};
    this.productDialog = true;
}

deleteProduct(product: any) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + product.name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.res = this.res.filter(val => val.id !== product.id);
            this.product = {};
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
        }
    });
}

hideDialog() {
    this.productDialog = false;
    this.submitted = false;
}

saveProduct() {
    this.submitted = true;

    if (this.product.name.trim()) {
        if (this.product.id) {
            this.res[this.findIndexById(this.product.id)] = this.product;                
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
        }
        else {
            this.product.id = this.createId();
            this.product.image = 'product-placeholder.svg';
            this.res.push(this.product);
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
        }

        this.res = [...this.res];
        this.productDialog = false;
        this.product = {};
    }
}

findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.res.length; i++) {
        if (this.res[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
}
