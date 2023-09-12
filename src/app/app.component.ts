import { Component,ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ExampleHeaderComponent } from './example-header/example-header.component';
import { MatDateRangePicker ,MatDatepickerInputEvent} from '@angular/material/datepicker';
import { GlobalValueService } from './global-value.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private globalFromTimeSubscription: Subscription;
  public globalFromTimeVar:any;

  private globalToTimeSubscription: Subscription;
  public globalToTimeVar:any;

  
  
  // make ExampleHeaderComponent type available in our template:
  readonly ExampleHeaderComponent = ExampleHeaderComponent;
  @ViewChild('picker') datePicker: MatDateRangePicker<Date>;

  constructor(
    private globalValueService: GlobalValueService
  ){
  
  }
  public handleDateRangeInputClick =() =>{
    this.datePicker.open();
  }

  ngOnInit() {
    const [start,end] = this.globalValueService.getHourDate(1);
    this.globalValueService.setFromTimeValue(start)
    this.globalValueService.setToTimeValue(end)

    this.globalFromTimeSubscription = this.globalValueService.fromTimeValueData$.subscribe(data => {
      this.globalFromTimeVar = data;
    });

    this.globalToTimeSubscription = this.globalValueService.toTimeValueData$.subscribe(data => {
      this.globalToTimeVar = data;
    });
  }

  ngOnDestroy() {
    this.globalFromTimeSubscription.unsubscribe();
    this.globalToTimeSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.attachFromtime()
    this.attachTotime()
  }
  
  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  public getDateFormat = (dateString:string) =>{
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${month}-${day}-${year}`;
    return formattedDate;
  }



  onDateRangeChange() {
    // Handle the date range change here
    const startDate = this.range.get('start').value;
    const endDate = this.range.get('end').value;
    if(startDate){
      this.attachFromtime();
    }else{
      this.removeElement("start-element")
    }
    if(endDate){
      this.attachTotime();
    }else{
      this.removeElement("end-element")
    }
  }

  removeElement(id){
    const ele = document.querySelector(`#${id}`);
    if(ele){
      ele.remove();
    }
  }

  attachFromtime(){
    const startid = 'start-element';
    const startRef = document.querySelector('.mat-date-range-input-start-wrapper');
    this.removeElement(startid);
    const startelement = document.createElement("div");
    startelement.setAttribute("id",startid)
    const timeFormat= this.globalValueService.formatTime(this.globalFromTimeVar)
    startelement.innerText = timeFormat;
    startRef.appendChild(startelement)
  }

  attachTotime(){
    const endid = 'end-element';
    const endRef = document.querySelector('.mat-date-range-input-end-wrapper');
    this.removeElement(endid)
    const endelement = document.createElement("div");
    endelement.setAttribute("id",endid)
    const timeFormat= this.globalValueService.formatTime(this.globalToTimeVar)
    endelement.innerText = timeFormat;
    endRef.appendChild(endelement)
  }

  public parseRange = () =>{
    const start = this.getDateFormat(this.range.value.start);
    const end = this.getDateFormat(this.range.value.end);

    const object = {
      "start" : start,
      "end" : end
    }
    
    return object;
  }



   
}
