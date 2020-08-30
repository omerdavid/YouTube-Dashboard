import { Component, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';


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

  ngOnInit() {
    let apiKey='AIzaSyC__yvQu993fx_kxyW9GzAeqwe5MWO3seQ';
let url=`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=ויטמיקס&key=${apiKey}`;

    this.httpClient.get(url).subscribe(d=>{
     this.res=d['items'].map(v=>v);
     console.log(this.res);
    });
  }
}
