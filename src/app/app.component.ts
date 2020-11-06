import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ItunesService } from './shared/itunes.service';
import { fromEvent,interval, Subscription } from 'rxjs';
import { debounceTime} from 'rxjs/operators';
import { PlayerService } from './shared/player.service';
import { environment } from 'src/environments/environment'
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit,AfterViewInit {
  @ViewChild('searchBox', { static: true }) searchInput: ElementRef;
  // (keyup)="search(searchBox.value)"
  @ViewChild('drawer') drawer: MatSidenav;


  hideResult:boolean;
  isMobile: boolean = false;
  buttonStream$: Subscription
  searchResults: Array<any> = [];
  constructor(private router: Router, private ituneService: ItunesService, private playerService: PlayerService, private deviceService: DeviceDetectorService) {
    this.checkBrowser();
  }

  ngOnInit(){
  }

  checkBrowser(){
    this.isMobile = this.deviceService.isMobile();
  }

  ngAfterViewInit(){
     let buttonStream$=fromEvent(this.searchInput.nativeElement, 'keyup')
    .pipe(debounceTime(1000))
    .subscribe(()=>{
      console.log("search: " + this.searchInput.nativeElement.value);
      this.searchByArtist(this.searchInput.nativeElement.value);
    });
    this.buttonStream$ = buttonStream$;

  }

  searchEnter(search){
    this.onResultClick();
    this.buttonStream$.unsubscribe()
    this.router.navigate([
      "search",
      search,
    ]);
  }

  onResultClick(){
    this.hideResult=true;
    this.searchInput.nativeElement.value='';
  }

  showing(){
    return this.playerService.isShowing();
  }

  search(param) {
    this.ituneService.search(param).subscribe(
      data => {
        // console.log(data['results']);
        this.hideResult=false;
        this.searchResults = data['results'];
      },
      err => console.log(err)
    );
  }

  searchByArtist(searchTerm){
    console.log("Term: " + searchTerm);
    fetch( environment .apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&searchOptionType=3&searchString=' + searchTerm + '&currentPage=1&itemsPerPage=12').then(
      res => {
        res.json().then( response =>{
          console.log(response);
          console.log(response.responseObject);
          console.log(response.responseObject[0].items);
          this.hideResult=false;
          this.searchResults = response.responseObject[0].items;
          console.log(this.searchResults);

        })
      }
    );
  }
}
