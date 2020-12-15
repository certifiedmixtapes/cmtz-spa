import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PlayerService } from '../shared/player.service';
import {environment} from '../../environments/environment';


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
  range: number = 3;
  sort: number;
  genre: number;
  rangeButton: string = "Month"



  constructor(private router: Router, private route: ActivatedRoute,
    private playerService: PlayerService) { }

  ngOnInit() {
        // New Mixtapes
        this.isLoading$ = false;
        this.route.params.subscribe(param => {
          this.sort = this.getSort(param.sort);
          
          if(param.range !== undefined){
            this.rangeButton = this.getRangeText(param.range);
            this.range = this.getRange(param.range);
          }

          if(param.genre !== undefined){
            this.genre = param.genre;
          }

          if (this.sort == 1){
            var newUrl = environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&currentPage=1&itemsPerPage=12';
            if(param.genre !== undefined){
              newUrl = newUrl + '&genre=' + this.genre;
            }
            
            fetch(newUrl).then(
              res => {
                res.json().then( response =>{
                  this.mixtapeArray = response.responseObject[0].items;
                })
              }
            );
          }
          else {
            this.page = 0;
            this.getMixtapes();
          }
      });
  }

  onScroll(){
    this.isLoading$ = true;
    this.page = this.page + 1;
    console.log("onScrolling " + this.page) ;

    if (this.sort === 1){
        fetch(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&currentPage=' + this.page +'&itemsPerPage=12').then(
              res => {
                res.json().then( response =>{
                  var nextPage = response.responseObject[0].items;
                  this.mixtapeArray = this.mixtapeArray.concat(nextPage);
                  this.isLoading$ = false;
                })
              }
        );
      }
      else {
        fetch(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&sort=4&range='+ this.range + '&currentPage=' + this.page +'&itemsPerPage=12').then(
          res => {
            res.json().then( response =>{
              var nextPage = response.responseObject[0].items;
              this.mixtapeArray = this.mixtapeArray.concat(nextPage);
              this.isLoading$ = false;
            })
          }
        );
      }
  }

  toggleHover(id) {
    this.hoverButton = id
  }
  
  removeHover() {
    this.hoverButton = null;
  }

  getMixtapes(){
    // Popular Mixtapes - 4
    this.page = this.page + 1;
    fetch(environment.apiUrl 
      + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&sort=4&range='
      + this.range +'&currentPage='+ this.page + '&itemsPerPage=12').then(
      res => {
        res.json().then( response =>{
          this.mixtapeArray = response.responseObject[0].items;
        })
      }
    );
  }

  onGetTracks(album) {
    console.log(album)
    this.router.navigate([
      "album",
      album.id,
    ]);
  }

  getSort(sort){
    if(sort === "popular"){
      return 4;
    }

    return 1;
  }

  getRange(range){
    if(range === "all"){
      return 4;
    }
    else if(range === "month"){
      return 3;
    }
    else if(range === "week"){
      return 2;

    }
    else if(range === "day"){
      return 1;
    }
  }

  getRangeText(range){
    if(range === "all"){
      return "All";
    }
    else if(range === "month"){
      return "Month";
    }
    else if(range === "week"){
      return "Week";

    }
    else if(range === "day"){
      return "Day";
    }
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
