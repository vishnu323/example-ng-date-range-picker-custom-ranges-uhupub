import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalValueService {
  private globalValue = new BehaviorSubject<string>("Last 1 Hour");
  globalValueData$ = this.globalValue.asObservable();


  private fromTimeStr = new BehaviorSubject<any>(this.getHourDate(1)[0])
  fromTimeValueData$ = this.fromTimeStr.asObservable();
  private toTimeStr = new BehaviorSubject<any>(this.getHourDate(1)[1])
  toTimeValueData$  = this.toTimeStr.asObservable();
  // private fromTimeStr : any =this.getHourDate(1)[0];
  // private toTimeStr : any = this.getHourDate(1)[1];
  private startDate : any = new Date();
  private endDate: any = new Date();

  constructor(private datePipe: DatePipe) {

   }
  getGlobalValue() {
    return this.globalValue;
  }
  
  setGlobalValue(value: any) {
    this.globalValue.next(value)
  }

  getFromTimeValue(){
    return this.fromTimeStr;
  }

  setFromTimeValue(time : any){
    this.fromTimeStr.next(time)
  }
  getToTimeValue(){
    return this.toTimeStr;
  }

  setToTimeValue(time : any){
    this.toTimeStr.next(time)
  }

  getHourDate(hour:number){
    const now = new Date(); 
    const start = new Date(now.getTime() - hour*60 * 60 * 1000);
    return [start,now];
  }

  formatTime(date: Date): string {
    return this.datePipe.transform(date, 'h:mm a');
  }

  getStartDate():Date{
    return this.startDate;
  }
  setStartDate(date: Date):void{
    this.startDate = date;
  }

  getEndDate():Date{
    return this.endDate;
  }
  setEndDate(date: Date):void{
    this.endDate = date;
  }
}
