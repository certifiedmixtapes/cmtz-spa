import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../shared/player.service';
import { environment } from '../../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { isPlatformBrowser} from '@angular/common';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  albumArray: Array<any> = [];
  artistName: string;
  public hoverButton:any;
  isMobile: boolean = false;
  searchTextChanged = new Subject<string>();
  buttonStream$: Subscription



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playerService: PlayerService,
   @Inject(PLATFORM_ID) private platformId: string,
    private deviceService: DeviceDetectorService
  ) { 

  }

  ngOnInit() {
    this.checkBrowser();
    this.route.params.subscribe(param => {
      this.artistName = param.name;
      if(!this.isMobile){
        this.getAlbum(param.name);
      }
      else {
        if (isPlatformBrowser(this.platformId)) {
          this.buttonStream$ = this.searchTextChanged
          .pipe(debounceTime(1000))
          .subscribe(q => {
            this.getAlbum(q)
          });
        }
      }
    });
  }

  checkBrowser(){
    this.isMobile = this.deviceService.isMobile();
  }

  getAlbum(searchTerm){
    this.artistName = searchTerm;
    console.log("Term: " + searchTerm);
    fetch(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&searchOptionType=1&searchString=' + searchTerm + '&currentPage=1&itemsPerPage=12').then(
      res => {
        res.json().then( response =>{
          this.albumArray = response.responseObject[0].items;
        })
      }
    );
  }

  onGetTracks(album) {
    this.router.navigate([
      "album",
      album.id,
    ]);
  }

  keyup(event) {
    this.searchTextChanged.next(event);
  }

  toggleHover(id) {
    this.hoverButton = id
  }
  
  removeHover() {
    this.hoverButton = null;
  }

  playTracks(album){
    var id = album.id;
      fetch(environment.apiUrl + '/api/tracks?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&albumId='+ id).then(
      res => {
        res.json().then( response =>{
          var tracks = response.responseObject;
          this.playerService.queueTracks(tracks);
          this.playerService.shouldShow(true);
          var start = Number(0);
          this.playerService.playTrack(start.toString());

        })
      }
    );
  }

}
