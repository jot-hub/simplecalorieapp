import { Component, OnInit } from '@angular/core';
import { Entry } from '../../../../model/entry';
import { EntryDetail } from '../../../../model/entry-detail';
import { ENTRIES } from './mock-entries';
import { ListService } from './list.service';
import { addDays, format } from 'date-fns';
import { Observable, Observer, of, Subject, tap } from 'rxjs';
import { EnvService } from '../env.service';
import { EnvServiceProvider } from '../env.service.provider';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  providers: [ EnvServiceProvider, ListService ],
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  minDate: Date = addDays(Date.now(), -365);
  maxDate: Date = addDays(Date.now(), 7);

  entries$: Observable<Entry[]> = of([]);

  isEditPanelOpen: boolean = false;



  newEntry: Entry = {
    date: format(Date.now(), 'yyyy-MM-dd'),
    details: []
  };

  newDetail: EntryDetail = {
    timeOfDay: "00:00",
    name: "some-food",
    calories: 100
  };

  selectedDate: Date = new Date();
  selectedEntry: Entry = this.newEntry;
  selectedDetail: EntryDetail = this.newDetail;

  isNewEntry:boolean = true;
  isNewDetail:boolean = false;

  createObserver: Observer<Entry> = {
    next:  (_) => {
      this.selectedEntry = this.newEntry;
      this.selectedDetail = this.newDetail;
      },
    error: (_) => {},
    complete:  () => {
      this.selectedEntry = this.newEntry;
      this.selectedDetail = this.newDetail;
    }
  };

  createDetailObserver: Observer<EntryDetail> = {
    next:  (_) => {
      this.selectedEntry = this.newEntry;
      this.selectedDetail = this.newDetail;
      },
    error: (_) => {},
    complete:  () => {
      this.selectedEntry = this.newEntry;
      this.selectedDetail = this.newDetail;
    }
  };

  refreshNeeded$: Subject<void> = new Subject();

  greenValue = 2000;
  yellowValue = 2100;

  Format = format;

  constructor(public listService: ListService, public envService: EnvService) { 
    this.listService = listService;
    this.envService = envService;
  }

  ngOnInit(): void {
    this.refreshNeeded$.subscribe(
      ()=> {
        //this.entries$ = of(ENTRIES);
        this.entries$ = this.listService.getEntries();
      }
    );
    //this.entries$ = of(ENTRIES);
    this.entries$ = this.listService.getEntries();

    if(this.envService.dailyLimit > 0) {
      this.greenValue = this.envService.dailyLimit- (this.envService.dailyLimit/10);
      this.yellowValue = this.envService.dailyLimit;
    }

  }

  onSelect(entry: Entry): void {
    this.isNewEntry = false;
    this.selectedEntry = entry;
    let dateComponents = entry.date.split("-");
    this.selectedDate = new Date(parseInt(dateComponents[0]), parseInt(dateComponents[1])-1,parseInt(dateComponents[2]));
    if(entry.details && entry.details.length > 0) {
      this.selectedDetail = entry.details.sort((a,b)=>a.timeOfDay.localeCompare(b.timeOfDay))[0];
      this.isNewDetail = false;
    }
    
  }

  onSelectDetail(entryDetail: EntryDetail): void {
    this.isNewDetail = false;
    this.isNewEntry = false;
    this.selectedDetail = entryDetail;
  }

  onAddDetailClick(): void {
    this.isNewDetail = true;
    this.isEditPanelOpen=true;
    this.selectedDetail = this.newDetail;
  }

  onAddClick(): void {
    this.isNewEntry = true;
    this.isNewDetail = true;
    this.isEditPanelOpen=true;
    this.selectedEntry=this.newEntry;
    this.selectedDate=new Date();
    this.selectedDetail = this.newDetail;
  }

  onDeleteEntry(date: string): void {

    if(date) {
  
      this.listService.deleteEntry(date)
      .pipe(tap(
        () => this.refreshNeeded$.next()
      )).subscribe();
    }

  }

  onDeleteDetail(): void {

    if(this.selectedDate && this.selectedEntry && this.selectedDetail && this.selectedDetail.detailId) {
  
      this.listService.deleteDetailEntry(format(this.selectedDate, 'yyyy-MM-dd'), this.selectedDetail.detailId)
      .pipe(tap(
        () => this.refreshNeeded$.next()
      )).subscribe();
    }

  }

  onCreate(): void {

    if(this.isNewEntry) {
      let entryToBeCreated: Entry = {
        date: format(this.selectedDate, 'yyyy-MM-dd'),
        details:[this.selectedDetail]
      }
  
      this.listService.addEntry(entryToBeCreated)
      .pipe(tap(
        () => this.refreshNeeded$.next()
      )).subscribe(this.createObserver);
    } else {
      this.createDetail();
    }
    
  }

  createDetail(): void {

    delete this.selectedDetail.detailId;
    this.listService.addDetailEntry(format(this.selectedDate, 'yyyy-MM-dd'), this.selectedDetail)
    .pipe(tap(
      () => this.refreshNeeded$.next()
    )).subscribe(this.createDetailObserver);
  }

  totalCalories(details: EntryDetail[]) {
    if(details && details.length > 0)
    return details.map(d => d.calories).reduce((p,c)=> p+c,0);
    else
    return 0;
  }

}
