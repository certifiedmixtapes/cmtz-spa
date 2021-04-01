import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Album } from '../album/album.model';
import { PlayerService } from '../shared/player.service';
import { isPlatformBrowser} from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Meta, Title } from '@angular/platform-browser';
const branchio = require('branchio-sdk');




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
  mobileUrl: string;
  isMobile: boolean = false;



  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private http: HttpClient,
    private deviceService: DeviceDetectorService,
    private titleService: Title, private metaService: Meta,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.routeParams = params;
      this.count = 0;
  
        var id = params.id;
        this.http.get<any>(environment.apiUrl +'/api/tracks?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&albumId='+ id).subscribe(
          response => {
            this.checkBrowser()

            console.log(response.responseObject[0].album);
            this.selectedAlbum = response.responseObject[0].album;
            this.selectedAlbum.trackCount = response.responseObject.length;
            this.tracks = response.responseObject;
            var cover = this.selectedAlbum.coverImageName;
            this.selectedAlbum.coverImageName = "https://do-images-klqk8.ondigitalocean.app/remote/" + cover + "?width=300&webp.lossless=true";

            this.titleService.setTitle(this.selectedAlbum.title);
            this.metaService.addTags([
              {name: 'keywords', content: this.selectedAlbum.keyWords},
              {name: 'description', content: 'Stream & Download Mixtape ' + this.selectedAlbum.title },
            ]);
      

            this.http.get<any>(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&searchOptionType=1&searchString=' + this.selectedAlbum.artists + '&currentPage=1&itemsPerPage=5').subscribe(
              response => {
                  this.suggestedArray = response.responseObject[0].items;
                  for(let f = 0; f < this.suggestedArray.length; f++){
                    var coverImage = this.suggestedArray[f].coverImageName;
                     this.suggestedArray[f].coverImageName = "https://do-images-klqk8.ondigitalocean.app/remote/" + coverImage + "?width=64&webp.lossless=true";
                  }
              }
            );

            this.http.get<any>(environment.apiUrl + '/api/videos/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&searchOptionType=1&searchString=' + this.selectedAlbum.artists + '&currentPage=1&itemsPerPage=5').subscribe(
              response => {
                  this.suggestedVideos = response.responseObject[0].items;
              }
            );

            if(this.isMobile){
              this.buildMobileLink();
            }
        }
      );

      this.http.get<any>(environment.apiUrl +'/api/mixtapes/comments/'+ id +'?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758').subscribe(
        response => {
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
            this.count = this.comments.length;
        }
      );

    });
  }
  ngOnDestroy() {}

  checkBrowser(){
    this.isMobile = this.deviceService.isMobile();
  }

  getGenre(){
   var genreCode = this.selectedAlbum?.genreType
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

   async buildMobileLink() {

    const client = branchio({ 
      key: "key_live_ojnZGvIM6lxmU8Gg19agRicdDFoYV7j8",
      secret: "secret_live_VWD3WOgEUC0JDyeCC25zNxVfndXJ3Jce"
    });

    const { url }  = await client.link({ 
      stage: 'new user',
      channel: 'mobile_web',
      feature: 'deepview',
      campaign: 'Mobile Site',
      data: {
        '$og_image_url': this.selectedAlbum.coverImageName,
        'mixtapeId' : this.selectedAlbum.id,
        '$og_title': this.selectedAlbum.title,
        '$always_deeplink':false,
      }
    });

    console.log("url: " + url);
    this.mobileUrl = url;

    return url;
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
