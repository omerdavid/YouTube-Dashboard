import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { KeyWordData, YouTubeSearchResults } from './models/youTube-results';
import {orderBy} from 'lodash';
import {sortBy} from 'lodash';


@Component({
  selector: "app-tables",
  templateUrl: "tables.component.html",
 
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit,AfterViewInit {

  public displayedColumns: string[] = ['videoId', 'keyWords','title', 'channelTitle', 'description'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


dataSource:MatTableDataSource<YouTubeSearchResults>;
selectedProducts:YouTubeSearchResults[];
product:YouTubeSearchResults;
submitted:boolean;
productDialog: boolean;
dataSourceultsLength = 0;
isLoading = true;
currentKeyWord:KeyWordData;

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

keyWordClick(keyWord){ 
  this.currentKeyWord= this.getLastDateChecked(keyWord.data);
}

getLastDateChecked(data):KeyWordData{
  
    let sortedArr=sortBy(data,'dataChecked','desc');
    return sortedArr[0];
}

addVideo(){


  this.httpClient.post(`api/youTubeList/addVideo`,{videoId:'yUi3qOLuS4E',keyWords:['ויטמיקס','בלנדר מקצועי']})
  .subscribe(res=>{
    console.log(res);
  })
}

  ngOnInit() {
   this.loadVideos();

  }

  loadVideos(){
  
    //let keyword='ויטמיקס';
//let myVideo='Vitamix Will It Blend - ויטמיקס שילמה 24 מיליון דולר על הפרת פטנט';

    this.httpClient.get(`api/youTubeList?searchText`)
    .pipe( 
    map((f:any)=>{
        console.log('fdata',f);
      return  f.map(g=>{

          let tmp= new YouTubeSearchResults();
          tmp.videoId=g.videoId;
          tmp.videoUrl=this._sanitizer.bypassSecurityTrustResourceUrl(this.youTubeUrl+g.videoId);
          tmp.keyWords=g.keyWords;
          // tmp.title= f.snippet.title;
          // tmp.channelTitle= f.snippet.channelTitle;
          // tmp.description=f.snippet.description;
          return tmp;  
        
        
        });
      
      }
        )
    ,catchError(this.errorHandler))
    .subscribe((data:any)=>{
     
       console.log('data : ',data);
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
