import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatChipService {
   
  //private data$:BehaviorSubject<any>=new BehaviorSubject<any>([]);
  private _data:any[]=[];
  public get data (){return this._data;};

  public readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  
  constructor() { }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this._data.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    const index = this.data.indexOf(fruit);

    if (index >= 0) {
      this._data.splice(index, 1);
    }
  }

}
