import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItunesService } from '../shared/itunes.service';
import { ActivatedRoute } from '@angular/router';
import { Album } from '../album/album.model';
import { PlayerService } from '../shared/player.service';
import { isPlatformBrowser} from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { environment } from '../../environments/environment';



@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit, OnDestroy {

  selectedAlbum: any;
  routeParams;
  tracks: Array<any> = [];
  suggestedArray: Array<any> = [];
  suggestedVideos: Array<any> = [];
  commentArray: Array<Object> = [];
  displayedColumns: string[] = ['Number', 'Name'];
  isBrowser: boolean;
  comments: string;
  count: number;


  constructor(
    private ituneService: ItunesService,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.routeParams = params;
      this.count = 0;
      /*his.ituneService.getTracks(params.colllection_id).subscribe(tracks => {
        this.tracks = tracks;
        this.selectedAlbum = new Album(this.tracks.shift());
      });*/

        var id = params.id;
        fetch(environment.apiUrl +'/api/tracks?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&albumId='+ id).then(
        res => {
          res.json().then( response =>{
            //this.videoArray = response.responseObject[0].items;
            console.log(response.responseObject[0].album);
            this.selectedAlbum = response.responseObject[0].album;
            this.selectedAlbum.trackCount = response.responseObject.length;
            this.tracks = response.responseObject;

            fetch(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&searchOptionType=1&searchString=' + this.selectedAlbum.artists + '&currentPage=1&itemsPerPage=5').then(
              res => {
                res.json().then( response =>{
                  this.suggestedArray = response.responseObject[0].items;
                })
              }
            );

            fetch(environment.apiUrl + '/api/videos/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&searchOptionType=1&searchString=' + this.selectedAlbum.artists + '&currentPage=1&itemsPerPage=5').then(
              res => {
                res.json().then( response =>{
                  this.suggestedVideos = response.responseObject[0].items;
                })
              }
            );

          })
        }
      );

      fetch(environment.apiUrl +'/api/mixtapes/comments/'+ id +'?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758').then(
        res => {
          res.json().then( response =>{
             var commentArr = response.responseObject;
             for(let i = 0; i< commentArr.length; i++){
              
               this.commentArray.push({
                commentId : commentArr[i].id,
                currentDate : commentArr[i].createdOn,
                commentTxt: commentArr[i].comment,
                replyComment: []
              });
             }

            this.comments = this.commentArray as any;
          })
        }
      );

    });
  }
  ngOnDestroy() {}

  getGenre(){
   var genreCode = this.selectedAlbum.genreType
   switch(genreCode) {
    case 1:
      return "Rap";
    case 2:
      return "R&B";
    case 3:
      return "EDM";  
    case 4:
      return "Christian Hip Hop";
    case 5:
      return "Hip Hop Blends";
    case 6:
      return "Soul";
    case 7:
      return "Instrumentals";
    case 8:
      return "Chopped and Screwed";  
    default:
    }
  }

  playTrack(track) {
    this.playerService.queueTracks(this.tracks);
    this.playerService.shouldShow(true);
    console.log(track);
    var order = Number(track.order) -1;
    this.playerService.playTrack(order.toString());
  }

  receiveComment($event) {
    this.comments = $event;
    this.count = this.comments.length;
    console.log(this.comments);
    console.log(this.comments.length);
  }

  recieveCount($event) {
    this.comments = $event;
    this.count = this.comments.length;
  }

}
