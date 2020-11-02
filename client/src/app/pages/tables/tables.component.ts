import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { sortBy } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { AddDialogComponent } from 'src/app/dialog/add-dialog/add-dialog.component';
import { VideoService } from 'src/app/services/video.service';
import { KeyWordData, UserVideos } from './models/youTube-results';


@Component({
  selector: "app-tables",
  templateUrl: "tables.component.html",

  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['videoId', 'keyWords', 'rank', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  @Output() onKeyWordSelected: EventEmitter<any> = new EventEmitter();

  @Output() onRowSelected: EventEmitter<any> = new EventEmitter();

  dataSource: MatTableDataSource<UserVideos>;
  selectedProducts: UserVideos[];
  product: UserVideos;
  submitted: boolean;
  productDialog: boolean;
  dataSourceultsLength = 0;
  isLoading = true;
  currentKeyWord: KeyWordData;
  selectedRowIndex:number=0;
  youTubeEmbedUrl: string = 'https://www.youtube.com/embed/';

  constructor(private httpClient: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService, private _sanitizer: DomSanitizer, public dialogService: MatDialog,private videoService:VideoService) { }
  ngAfterViewInit(): void {
  
  }

  errorHandler(error: HttpErrorResponse) {
    
    return throwError(error.message || "server error.");
  }

  keyWordClick(keyWord) {
    this.onKeyWordSelected.emit(keyWord);
    //this.currentKeyWord = this.getLastDateChecked(keyWord.data);
  }

  getLastDateChecked(data): KeyWordData {

    let sortedArr = sortBy(data, 'dataChecked', 'desc');
    return sortedArr[0];
  }
  openAddDialog() {
    const dialogRef = this.dialogService.open(AddDialogComponent, {
      data: { issue: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
    // if (result === 1) {

       
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        // this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        //  this.refreshTable();
      //}
    });
  }
  
  highlight(element: any) {
    element.highlighted = !element.highlighted;
  }

  ngOnInit() {
    this.videoService.newVideoAdd$.subscribe((userVideo:UserVideos[])=>{
      this.loadVideos();  
    })
    this.loadVideos();

  }
  rowSelected(row){
    this.selectedRowIndex=row.videoId;
    this.onRowSelected.emit(row);
   
  }
  loadVideos() {

    //let keyword='ויטמיקס';
    //let myVideo='Vitamix Will It Blend - ויטמיקס שילמה 24 מיליון דולר על הפרת פטנט';

    this.httpClient.get(`api/youTubeList`)
      .pipe(
        map((f: any) => {
         
          return f.map(g => {
           
            let tmp = new UserVideos();
            tmp.videoId = g.videoId;
            tmp.videoUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.youTubeEmbedUrl + g.videoId);
            tmp.keyWords = g.keyWords;
            tmp.videoName=g.videoName;
            return tmp;


          });

        }
        )
        , catchError(this.errorHandler))
      .subscribe((data: UserVideos[]) => {

          
        // Flip flag to show that loading has finished.
        this.isLoading = false;

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //load first element to charts
        this.onRowSelected.emit(data[0]);
        this.onKeyWordSelected.emit(data[0].keyWords[0])

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
    this.dataSource = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: UserVideos) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.title + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataSource.data = this.dataSource.data.filter(val => val.videoId !== product.videoId);
        this.product = new UserVideos();

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
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
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      }
      else {
        this.product.videoId = this.createId();

        this.dataSource.data.push(this.product);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }

      this.dataSource.data = [...this.dataSource.data];
      this.productDialog = false;
      this.product = new UserVideos();
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
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
