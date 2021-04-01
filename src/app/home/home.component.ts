import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { PlayerService } from '../shared/player.service';
import { VideoService } from '../shared/video.service';
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  searchKey: string = '';
  mixtapeArray: Array<any> = [];
  featuredArray: Array<any> = [];
  videoArray: Array<any> = [];
  singleArray: Array<any> = [];
  radioArray: Array<any> = [];
  public hoverButton:any;
  isMobile: boolean = false;




  search(value: string) {
    this.searchKey = value;
  }
  constructor(private router: Router,
     private http: HttpClient,
      private playerService: PlayerService,
       private videoService: VideoService,
           private deviceService: DeviceDetectorService
    ) {
       this.getMobile();
    }

 /* loadPlayer(){
    this.loadableService.preload('player')
            .then(() => console.log('loaded'))
            .catch((error) => console.error(error))
  }*/

  getMobile(){
    this.isMobile = this.deviceService.isMobile();
  }
  ngOnInit() {

    //Featured
    this.http.get<any>(environment.apiUrl + '/api/mixtapes/featured?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758').subscribe(
      response => {
          this.featuredArray = response.responseObject;
          for(let f = 0; f < this.featuredArray.length; f++){
            var coverImage = this.featuredArray[f].coverImageName;
             this.featuredArray[f].coverImageName = "https://do-images-klqk8.ondigitalocean.app/remote/" + coverImage ;//+ "?width=350&webp.lossless=true";
             this.featuredArray[f].thumbImg = "https://do-images-klqk8.ondigitalocean.app/remote/" + coverImage; // + "?width=200&webp.lossless=true";
          }
      }
    );

    // New Mixtapes
    this.http.get<any>(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&currentPage=1&itemsPerPage=12').subscribe(
      response => {
       // res.json().then( response =>{
          this.mixtapeArray = response.responseObject[0].items;
          for(let f = 0; f < this.mixtapeArray.length; f++){
            var coverImage = this.mixtapeArray[f].coverImageName;
             //var baseImage = coverImage.replace("http://cmtz.nyc3.cdn.digitaloceanspaces.com","http://images.certifiedmixtapes.com/do");
             this.mixtapeArray[f].coverImageName = "https://do-images-klqk8.ondigitalocean.app/remote/" + coverImage; // + "?width=350&webp.lossless=true";
             this.mixtapeArray[f].thumbImg = "https://do-images-klqk8.ondigitalocean.app/remote/" + coverImage; // + "?width=200&webp.lossless=true";
          }
      }
    );

    // New Videos
    this.http.get<any>(environment.apiUrl + '/api/videos/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&currentPage=1&itemsPerPage=12').subscribe(
      response => {
          // 240 * 180
          this.videoArray = response.responseObject[0].items;
          for(let f = 0; f < this.videoArray.length; f++){
            var coverImage = this.videoArray[f].videoPoster;
            this.videoArray[f].videoPoster = "https://do-images-klqk8.ondigitalocean.app/remote/" + coverImage + "?width=240&height=180&webp.lossless=true";
          }
          
      }
    );

    if(!this.isMobile){
    // Trending Single
      this.http.get<any>(environment.apiUrl + '/api/tracks/paged?accesskey=4a4897e2-2bae-411f-9c85-d59789afc758&trackSort=4&range=1&singleType=1&itemsPerPage=20&currentPage=1').subscribe(
        response => {
                this.singleArray = response.responseObject[0].items;
                for(let f = 0; f < this.singleArray.length; f++){
                  var coverImage = this.singleArray[f].album.coverImageName;
                  this.singleArray[f].album.coverImageName = "https://do-images-klqk8.ondigitalocean.app/remote/" + coverImage ;//+ "?width=350&webp.lossless=true";
                  this.singleArray[f].album.thumbImg = "https://do-images-klqk8.ondigitalocean.app/remote/" + coverImage; // + "?width=200&webp.lossless=true";
                }
      
            }
      );
    }

     // Radio Genre
     this.http.get<any>(environment.apiUrl + '/api/radio/list?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758').subscribe(
      response => {
        //res.json().then( response =>{
          this.radioArray = response.responseObject;
          for(let f = 0; f < this.radioArray.length; f++){
            var coverImage = this.radioArray[f].coverImageName;
             var baseImage = coverImage.replace("http://www.certifiedmixtapez.com/images/Radio","radio");
             baseImage = baseImage.replace("png","jpg");
             var baseImage150 = baseImage.replace(".jpg","-150.jpg");
             var baseImage255 = baseImage.replace(".jpg","-255.jpg");

             if(this.deviceService.isMobile()){
              this.radioArray[f].coverImageName = baseImage255
             }
             else {
              this.radioArray[f].coverImageName = baseImage
             }
          }
        //})
      }
 );
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

  playSingles(index){
    console.log(index)
    this.playerService.queueTracks(this.singleArray);
    this.playerService.shouldShow(true);
    var start = Number(index);
    this.playerService.playTrack(start.toString());
  }

  playVideo(index){
    console.log(index)
    this.videoService.queueTracks(this.singleArray);
    var start = Number(index);
  }

  onGetTracks(album) {
    console.log(album)
    this.router.navigate([
      "album",
      album.id,
    ]);
  }

  getRadio(radioStation){
    var genre = radioStation.genreType;
    fetch(environment.apiUrl + '/api/radio?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&genre='+ genre).then(
      res => {
        res.json().then( response =>{
          console.log("Genre: "+ genre);
          console.log(response);
          var radioTracks = response.responseObject;
          console.log(radioTracks);
          this.playerService.queueTracks(radioTracks);
          this.playerService.shouldShow(true);
          var start = Number(0);
          this.playerService.playTrack(start.toString());
      
        })
      }
    );
  }
}
