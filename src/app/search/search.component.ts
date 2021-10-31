import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../shared/player.service';
import { environment } from '../../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { isPlatformBrowser} from '@angular/common';
import { HttpClient } from '@angular/common/http';



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
  isLoading$: boolean;
  page: number = 1;
  artistResults: Array<any> = [];
  radio: Array<any> = [];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private http: HttpClient,
   @Inject(PLATFORM_ID) private platformId: string,
    private deviceService: DeviceDetectorService
  ) { 

  }

  ngOnInit() {
    this.checkBrowser();
    this.isLoading$ = false;

    this.route.params.subscribe(param => {
      this.artistName = param.name;
      this.searchByArtist(this.artistName);

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

  searchByArtist(searchTerm){
    console.log("Term: " + searchTerm);
    fetch( environment .apiUrl + '/api/mixtapes/paged?searchOptionType=3&searchString=' + searchTerm + '&currentPage=1&itemsPerPage=12').then(
      res => {
        res.json().then( response =>{
           let temp = response.responseObject[0].items;//.splice(0,5);

           for(let i =0;i < temp.length; i++){
             var artist = temp[i].artists;
             if(artist.includes(",")){
              temp[i].artists = temp[i].artists.split(",")[0];
             }
           }
           
           temp.push({ artists:searchTerm});

           this.artistResults =  temp.filter((v,i) => temp.findIndex(item => item.artists == v.artists) === i);
           this.artistResults = this.artistResults.splice(0,5);
            console.log(this.artistResults);

        })
      }
    );
  }

   shuffle(list) {
    return list.reduce((p, n) => {
      const size = p.length;
      const index = Math.trunc(Math.random() * (size - 1));
      p.splice(index, 0, n);
      return p;
    }, []);
  };

  getSinglesByArtist(artist){
    this.http.get<any>(environment.apiUrl + '/api/tracks/paged?trackSort=4&range=4&singleType=3&searchString=' + artist + '&itemsPerPage=50&currentPage=1').subscribe(
      res => {
          this.radio = this.shuffle(res.responseObject[0].items);   
          console.log("Single: " + this.radio) 
      }
    );
  }

  getAlbum(searchTerm){
    this.artistName = searchTerm;
    console.log("Term: " + searchTerm);
    fetch(environment.apiUrl + '/api/mixtapes/paged?searchOptionType=1&searchString=' + searchTerm + '&currentPage=1&itemsPerPage=12').then(
      res => {
        res.json().then( response =>{
          this.albumArray = response.responseObject[0].items;
        })
      }
    );
  }

  onScroll(){
    this.isLoading$ = true;
    this.page = this.page + 1;

    fetch(environment.apiUrl + '/api/mixtapes/paged?searchOptionType=1&searchString=' + this.artistName + '&currentPage='+ this.page +'&itemsPerPage=12').then(
      res => {
        res.json().then( response =>{
          var nextPage = response.responseObject[0].items;
          this.albumArray = this.albumArray.concat(nextPage);
          this.isLoading$ = false;

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

  playArtistRadio(artist){
    this.http.get<any>(environment.apiUrl + '/api/tracks/paged?singleType=3&searchString=' + artist + '&itemsPerPage=50&currentPage=1').subscribe(
      res => {
          console.log(res);
          this.radio = this.shuffle(res.responseObject[0].items);   
          console.log("Single: " + this.radio)
          this.playerService.queueTracks(this.radio);
          this.playerService.shouldShow(true);
          var start = Number(0);
          this.playerService.playTrack(start.toString());

      }
    );
  }

  playTracks(album){
    var id = album.id;
      fetch(environment.apiUrl + '/api/tracks?albumId='+ id).then(
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
