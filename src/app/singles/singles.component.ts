import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { PlayerService } from '../shared/player.service';


@Component({
  selector: 'app-singles',
  templateUrl: './singles.component.html',
  styleUrls: ['./singles.component.scss']
})
export class SinglesComponent implements OnInit {
  singleArray: Array<any> = [];
  public hoverButton:any;
  page: number = 1;
  range: number = 1;
  isLoading$: boolean;


  constructor(private router: Router, private http: HttpClient, private playerService: PlayerService) { }

  ngOnInit(): void {
        // Trending Single
        this.isLoading$ = false;
        this.http.get<any>(environment.apiUrl + '/api/tracks/paged?accesskey=4a4897e2-2bae-411f-9c85-d59789afc758&trackSort=4&range='+ this.range +'&singleType=3&itemsPerPage=20&currentPage=1').subscribe(
          res => {
            //res.json().then( response =>{
              this.singleArray = res.responseObject[0].items;   
              console.log("Single: " + this.singleArray) 
            //})
          }
     );
  }

  onScroll(){
    this.isLoading$ = true;
    this.page = this.page + 1;
    console.log("onScrolling " + this.page) ;
    /*fetch(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&sort=4&range=3&currentPage=' + this.page +'&itemsPerPage=12').then(
          res => {
            res.json().then( response =>{
              var nextPage = response.responseObject[0].items;
              this.mixtapeArray = this.mixtapeArray.concat(nextPage);
              console.log(this.mixtapeArray);
            })
          }
    );*/

    this.http.get<any>(environment.apiUrl + '/api/tracks/paged?accesskey=4a4897e2-2bae-411f-9c85-d59789afc758&trackSort=4&range='+ this.range + '&singleType=3&itemsPerPage=20&currentPage=' + this.page).subscribe(
      res => {
          var nextPage = res.responseObject[0].items;   
          this.singleArray = this.singleArray.concat(nextPage);
          this.isLoading$ = false;

      }
    );
  }

  setRange(range){
    this.range = range;
    this.singleArray = []
    this.getSingles();
  }

  getSingles(){
    this.http.get<any>(environment.apiUrl + '/api/tracks/paged?accesskey=4a4897e2-2bae-411f-9c85-d59789afc758&trackSort=4&range='+ this.range +'&singleType=3&itemsPerPage=20&currentPage=1').subscribe(
      res => {
          this.singleArray = res.responseObject[0].items;   
          console.log("Single: " + this.singleArray) 
      }
    );
  }
  
  toggleHover(id) {
    this.hoverButton = id
  }
  
  removeHover() {
    this.hoverButton = null;
  }

  playSingles(index){
    console.log(index)
    this.playerService.queueTracks(this.singleArray);
    this.playerService.shouldShow(true);
    var start = Number(index);
    this.playerService.playTrack(start.toString());
  }

  onGetTracks(album) {
    console.log(album)
    this.router.navigate([
      "album",
      album.id,
    ]);
  }

}
