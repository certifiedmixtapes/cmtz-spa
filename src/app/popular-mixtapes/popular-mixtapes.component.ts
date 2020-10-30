import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../shared/player.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-popular-mixtapes',
  templateUrl: './popular-mixtapes.component.html',
  styleUrls: ['./popular-mixtapes.component.scss']
})
export class PopularMixtapesComponent implements OnInit {
  public hoverButton:any;
  mixtapeArray: Array<any> = [];
  page: number = 1;

  constructor(private router: Router, private playerService: PlayerService) { }

  ngOnInit() {
    // Popular Mixtapes
    fetch(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&sort=4&range=3&currentPage=1&itemsPerPage=12').then(
      res => {
        res.json().then( response =>{
          this.mixtapeArray = response.responseObject[0].items;
        })
      }
    );
  }

  onScroll(){
    this.page = this.page + 1;
    console.log("onScrolling " + this.page) ;
    fetch(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&sort=4&range=3&currentPage=' + this.page +'&itemsPerPage=12').then(
          res => {
            res.json().then( response =>{
              var nextPage = response.responseObject[0].items;
              this.mixtapeArray = this.mixtapeArray.concat(nextPage);
              console.log(this.mixtapeArray);
            })
          }
    );
  }

  toggleHover(id) {
    this.hoverButton = id
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
