import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PlayerService } from '../shared/player.service';



@Component({
  selector: 'app-new-mixtapes',
  templateUrl: './new-mixtapes.component.html',
  styleUrls: ['./new-mixtapes.component.scss']
})
export class NewMixtapesComponent implements OnInit {
  public hoverButton:any;
  mixtapeArray: Array<any> = [];
  page: number = 1;
  isLoading$: boolean;


  constructor(private router: Router, private playerService: PlayerService) { }

  ngOnInit() {
        // New Mixtapes
        this.isLoading$ = false;
        fetch('https://www.certifiedmixtapez.com/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&currentPage=1&itemsPerPage=12').then(
          res => {
            res.json().then( response =>{
              this.mixtapeArray = response.responseObject[0].items;
            })
          }
        );
  }

  onScroll(){
    this.isLoading$ = true;
    this.page = this.page + 1;
    console.log("onScrolling " + this.page) ;
    fetch('https://www.certifiedmixtapez.com/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&currentPage=' + this.page +'&itemsPerPage=12').then(
          res => {
            res.json().then( response =>{
              var nextPage = response.responseObject[0].items;
              this.mixtapeArray = this.mixtapeArray.concat(nextPage);
              console.log(this.mixtapeArray);
              this.isLoading$ = false;

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
      fetch('https://www.certifiedmixtapez.com/api/tracks?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&albumId='+ id).then(
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
