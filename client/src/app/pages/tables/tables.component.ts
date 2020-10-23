import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import {MatTableDataSource} from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { YouTubeSearchResults } from './models/youTube-results';
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
export class TablesComponent implements OnInit,AfterViewInit {

  public displayedColumns: string[] = ['videoId', 'youTubeRank','title', 'channelTitle', 'description'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


dataSource:MatTableDataSource<YouTubeSearchResults>;
selectedProducts:YouTubeSearchResults[];
product:YouTubeSearchResults;
submitted:boolean;
productDialog: boolean;
dataSourceultsLength = 0;
isLoading = true;
youTubeUrl:string='https://www.youtube.com/embed/';

  constructor(private httpClient:HttpClient,
    private messageService: MessageService,
     private confirmationService: ConfirmationService,private _sanitizer: DomSanitizer) {}
  ngAfterViewInit(): void {
   
  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error.error);
    return throwError(error.message || "server error.");
}

addVideo(){
  this.httpClient.post(`api/youTubeList/addVideo`,{videoId:'yUi3qOLuS4E',keyWords:['ויטמיקס','בלנדר מקצועי']}).subscribe(res=>{
    console.log(res);
  })
}
  ngOnInit() {
  this.addVideo();
let keyword='ויטמיקס';
let myVideo='Vitamix Will It Blend - ויטמיקס שילמה 24 מיליון דולר על הפרת פטנט';

    this.httpClient.get(`api/youTubeList?searchText=${keyword}`)
    .pipe(  tap(console.log),
      map((r:any)=>r.res1
    .map((f:any)=>{
      
      let tmp= new YouTubeSearchResults();
      tmp.videoId=f.id.videoId;
      tmp.youTubeRank=0;
      tmp.videoUrl=this._sanitizer.bypassSecurityTrustResourceUrl(this.youTubeUrl+f.id.videoId);
     tmp.title= f.snippet.title;
      tmp.channelTitle= f.snippet.channelTitle;
      tmp.description=f.snippet.description;
      return tmp;
      }
        ))
    ,catchError(this.errorHandler))
    .subscribe((data:YouTubeSearchResults[])=>{
       const x=data.findIndex(f=>f.title=myVideo);
       console.log('rank :',x);
       data[0].youTubeRank=x;
        // Flip flag to show that loading has finished.
        this.isLoading = false;
    
         // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 

editProduct(product: any) {
    this.dataSource = {...product};
    this.productDialog = true;
}

deleteProduct(product: YouTubeSearchResults) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + product.title + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.dataSource.data = this.dataSource.data.filter(val => val.videoId !== product.videoId);
            this.product =new YouTubeSearchResults();

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

    if (this.product.title.trim()) {
        if (this.product.videoId) {
            this.dataSource[this.findIndexById(this.product.videoId)] = this.product;                
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
        }
        else {
            this.product.videoId = this.createId();
           
            this.dataSource.data.push(this.product);
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
        }

        this.dataSource.data = [...this.dataSource.data];
        this.productDialog = false;
        this.product =new YouTubeSearchResults();
    }
}

findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.dataSource.data.length; i++) {
        if (this.dataSource[i].id === id) {
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
