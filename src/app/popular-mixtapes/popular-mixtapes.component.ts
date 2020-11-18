import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../shared/player.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-popular-mixtapes',
  templateUrl: './popular-mixtapes.component.html',
  styleUrls: ['./popular-mixtapes.component.scss']
})
export class PopularMixtapesComponent implements OnInit {
  public hoverButton:any;
  mixtapeArray: Array<any> = [];
  page: number = 1;
  range: number = 3;
  isLoading$: boolean;


  constructor(private router: Router, private playerService: PlayerService) { }

  ngOnInit() {
    this.isLoading$ = false;
     this.getMixtapes();
  }

  onScroll(){
    this.isLoading$ = true;
    this.page = this.page + 1;
    console.log("onScrolling " + this.page) ;
    fetch(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&sort=4&range='+ this.range + '&currentPage=' + this.page +'&itemsPerPage=12').then(
          res => {
            res.json().then( response =>{
              var nextPage = response.responseObject[0].items;
              this.mixtapeArray = this.mixtapeArray.concat(nextPage);
              this.isLoading$ = false;
              console.log(this.mixtapeArray);
            })
          }
    );
  }

  toggleHover(id) {
    this.hoverButton = id
  }

  getMixtapes(){
    // Popular Mixtapes
    fetch(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&sort=4&range='+ this.range +'&currentPage=1&itemsPerPage=12').then(
      res => {
        res.json().then( response =>{
          this.mixtapeArray = response.responseObject[0].items;
        })
      }
    );
  }

  setGenre(){

  }

  setRange(range){
    this.range = range;
    this.mixtapeArray = []
    this.getMixtapes();
  }
  
  removeHover() {
    this.hoverButton = null;
  }

  onGetTracks(album) {
    console.log(album)
    this.router.navigate([
      "album",
      album.id,
    ]);
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
