import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: "app-tables",
  templateUrl: "tables.component.html"
})
export class TablesComponent implements OnInit {
  columns: Array<any> = [{
    header: 'Name',
    field: 'name'
}, {
    header: 'Type',
    field: 'type'
}, {
    header: 'Price',
    field: 'price'
}];

source: Array<any> = [{
  name: 'T-shirt',
  type: 'clothes',
  price: '15$'
}, {
  name: 'Shoes',
  type: 'footwear',
  price: '100$'
}, {
  name: 'Ball cap',
  type: 'headgear',
  price: '50$'
}];
res:any;
  constructor(private httpClient:HttpClient) {}
  errorHandler(error: HttpErrorResponse) {
    console.log(error.error);
    return Observable.throw(error.message || "server error.");
}
  ngOnInit() {
    //let apiKey='';

//let url=`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=ויטמיקס&key=${apiKey}`;
let keyword='ויטמיקס';
    this.httpClient.get(`api/youTubeList/`)
    .pipe(catchError(this.errorHandler))
    .subscribe(d=>{
     this.res=d;//d['items'].map(v=>v);
     console.log(this.res);
    });
  }
}
