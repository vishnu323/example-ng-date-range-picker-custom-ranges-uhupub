import { ChangeDetectionStrategy, Component, HostBinding,Output,EventEmitter } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { GlobalValueService } from '../global-value.service';
import { Subscription } from 'rxjs';
const customPresets = [
  'Last 1 Hour',
  'Last 6 Hour',
  'Last 24 Hour',
  'Last 7 days',
  'Last 30 days',
  'Last 90 days',
  'Custom range'
] as const; // convert to readonly tuple of string literals

// equivalent to "today" | "last 7 days" | ... | "last year"
type CustomPreset = typeof customPresets[number];

@Component({
  selector: 'app-custom-range-panel',
  templateUrl: './custom-range-panel.component.html',
  styleUrls: ['./custom-range-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomRangePanelComponent<D> {

 
  // list of range presets we want to provide:
  readonly customPresets = customPresets;
  @HostBinding('class.touch-ui')
  readonly isTouchUi = this.picker.touchUi;
  public todayVar: boolean = true;
  public timeValue: any;
  private globalDataSubscription: Subscription;
  public globalInfoVar:string;
  private globalFromTimeSubscription: Subscription;
  public globalFromTimeVar:any;

  private globalToTimeSubscription: Subscription;
  public globalToTimeVar:any;
  @Output() timeChanged = new EventEmitter<Date>();
  timepickerVisible = true;
  mytime: Date = new Date();

  constructor(
    private dateAdapter: DateAdapter<D>,
    private picker: MatDateRangePicker<D>,
    private globalValueService: GlobalValueService
    
  ) {
   
  }
 
  ngOnInit() {
    this.globalFromTimeSubscription = this.globalValueService.fromTimeValueData$.subscribe(data => {
      this.globalFromTimeVar = data;
    });

    this.globalToTimeSubscription = this.globalValueService.toTimeValueData$.subscribe(data => {
      this.globalToTimeVar = data;
    });
    
    this.globalDataSubscription = this.globalValueService.globalValueData$.subscribe(data => {
      this.globalInfoVar = data;
      this.mytime = this.globalFromTimeVar;
    });
    
  }

  ngOnDestroy() {
    this.globalDataSubscription.unsubscribe();
    this.globalFromTimeSubscription.unsubscribe();
    this.globalToTimeSubscription.unsubscribe();
  }

  updateGlobalValue(newValue: any) {
    this.globalValueService.setGlobalValue(newValue);
  }

  // Example of getting the global value
  getGlobalValue() {
    return this.globalInfoVar;
  }


  applyClassOrStyleOnce() {
    const ref:any = document.querySelector(`#Today`);
    ref.style.backgroundColor = "blue"
    
  }
  resetbackGround(){
    const ref:any = document.querySelector(`#${this.replaceSpacesWithHyphens(this.getGlobalValue())}`);
    ref.style.backgroundColor = "unset"
    const textElement = ref.querySelectorAll("span");
    textElement[0].style.color='unset'
  }

  ngAfterViewInit() {
    if(this.getGlobalValue()){
      const ref:any = document.querySelector(`#${this.replaceSpacesWithHyphens(this.getGlobalValue())}`);
      ref.style.backgroundColor = "blue"
      const textElement = ref.querySelectorAll("span");
      textElement[0].style.color='white'
    }
  }
  // called when user selects a range preset:
  selectRange(rangeName: CustomPreset): void {
    this.resetbackGround();
    const [start, end] = this.calculateDateRange(rangeName);
    this.picker.select(start);
    this.picker.select(end);
    if(start && end){
      this.picker.close();
    }
    
  }
 
  setBackGround = (id:string,type:string) =>{
    const ref:any = document.querySelector(`#${this.replaceSpacesWithHyphens(id)}`);
    if(ref){
      ref.style.backgroundColor=type;
      const textElement = ref.querySelectorAll("span");
      textElement[0].style.color='white'
    }
  }


  idSelector = (id:string) =>{
      
      this.setBackGround(id,"blue");
      this.updateGlobalValue(id);
  }

    replaceSpacesWithHyphens = (inputString:any) =>{
      return inputString.replace(/ /g, '-');
    }
  
  updateFromToTime(start,end){
    this.globalValueService.setFromTimeValue(start);
    this.globalValueService.setToTimeValue(end)
    
  }

  removeElement(id){
    const ele = document.querySelector(`#${id}`);
    if(ele){
      console.log("vishnu12345",ele)
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
    endelement.innerText = timeFormat
    endRef.appendChild(endelement)
  }


  onTimeChange(event){
    this.globalValueService.setFromTimeValue(this.mytime)
    this.globalValueService.setToTimeValue(this.mytime)
  }



  private calculateDateRange(rangeName: CustomPreset): [start: any, end: any] {
    const today = this.today;
    const year = this.dateAdapter.getYear(today);
    this.idSelector(rangeName);
    switch (rangeName) {
      case 'Last 1 Hour':
        const [start,end] = this.globalValueService.getHourDate(1);
        this.updateFromToTime(start,end)
        this.attachFromtime()
        this.attachTotime()
        return [start, end];
      case 'Last 6 Hour': {
        const [start,end] = this.globalValueService.getHourDate(6);
        this.updateFromToTime(start,end)
        this.attachFromtime()
        this.attachTotime()
        return [start, end];
      }
      case 'Last 24 Hour': {
        const [start,end] = this.globalValueService.getHourDate(24);
        this.updateFromToTime(start,end)
        this.attachFromtime()
        this.attachTotime()
        return [start, end];
      }
      case 'Last 7 days': {
        const end = today;
        const start = this.dateAdapter.addCalendarDays(today, -6);
        this.updateFromToTime(start,end)
        this.attachFromtime()
        this.attachTotime()
        return [start, today];
      }
      case 'Last 30 days':{
        const end = today;
        const start = this.dateAdapter.addCalendarDays(today, -30);
        this.updateFromToTime(start,end)
        this.attachFromtime()
        this.attachTotime()
        return [start, end];
      }
      case 'Last 90 days': {
        const end = today;
        const start = this.dateAdapter.addCalendarDays(today, -90);
        this.updateFromToTime(start,end)
        this.attachFromtime()
        this.attachTotime()
        return [start, end];
      }
      case 'Custom range':{
        this.updateFromToTime(null,null)
        this.mytime = new Date();
        this.removeElement("start-element")
        this.removeElement("end-element")
        return [null, null];
      }
      default:
        // exhaustiveness check;
        // rangeName has type never, if every possible value is handled in the switch cases.
        // Otherwise, the following line will result in compiler error:
        // "Type 'string' is not assignable to type '[start: D, end: D]'"
        return rangeName;
    }
  }

  private get today(): D {
    const today = this.dateAdapter.getValidDateOrNull(new Date());
    if (today === null) {
      throw new Error('date creation failed');
    }
    return today;
  }

  onChangeHour(event:any){
    console.log(event.target.value);
  }
}
