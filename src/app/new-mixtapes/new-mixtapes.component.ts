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
  genreButton: string = "All Genres";
  genreText: string = "";

  rangeButton: string = "Month"
  rangeText: string = "month"


  constructor(private router: Router, private route: ActivatedRoute,
    private playerService: PlayerService) { }

  ngOnInit() {
        // New Mixtapes
        this.isLoading$ = false;
        this.route.params.subscribe(param => {
          this.sort = this.getSort(param.sort);
          
          if(param.range !== undefined){
            this.rangeText =  param.range;
            this.rangeButton = this.getRangeText(param.range);
            this.range = this.getRange(param.range);
          }

          if(param.genre !== undefined){
            this.genreText = "/" + param.genre;
            this.genre = this.getGenre(param.genre);
            this.genreButton = this.getGenreText(param.genre);
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
        var url = environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&currentPage=' + this.page +'&itemsPerPage=12'
        if(this.genre !== undefined){
          url = url + '&genre=' + this.genre;
        }

        fetch(url).then(
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
        var mixtapeUrl = environment.apiUrl + 
        '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&sort=4&range='+
         this.range + '&currentPage=' + this.page +'&itemsPerPage=12';

        if(this.genre !== undefined){
          mixtapeUrl = mixtapeUrl + '&genre=' + this.genre;
        }
    
        fetch(mixtapeUrl).then(
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

    var mixtapeUrl = environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&sort=4&range='
    + this.range +'&currentPage='+ this.page + '&itemsPerPage=12';

    if(this.genre !== undefined){
      mixtapeUrl = mixtapeUrl + '&genre=' + this.genre;
    }
    fetch(mixtapeUrl).then(
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

  getGenre(genre){
    if(genre === "rap"){
      return 1;
    }
    if(genre === "rnb"){
      return 2;
    }
    if(genre === "edm"){
      return 3;
    }
    if(genre === "christian"){
      return 4;
    }
    if(genre === "hiphopblends"){
      return 5;
    }
    if(genre === "soul"){
      return 6;
    }
    if(genre ==="instrumentals"){
      return 7;
    }
    if(genre ==="s&c"){
      return 8;
    }
  }

  getGenreText(genre){
    if(genre === "rap"){
      return "Rap";
    }
    if(genre === "rnb"){
      return "R&B";
    }
    if(genre === "edm"){
      return "EDM";
    }
    if(genre === "christian"){
      return "Christian";
    }
    if(genre === "hiphopblends"){
      return "HipHop Blends";
    }
    if(genre === "soul"){
      return "Soul";
    }
    if(genre ==="instrumentals"){
      return "Instrumentals";
    }
    if(genre ==="s&c"){
      return "Screwed & Chopped";
    }
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
