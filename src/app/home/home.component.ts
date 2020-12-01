import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { PlayerService } from '../shared/player.service';
import { VideoService } from '../shared/video.service';
import { HttpClient } from '@angular/common/http';



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


  search(value: string) {
    this.searchKey = value;
  }
  constructor(private router: Router, private http: HttpClient, private playerService: PlayerService, private videoService: VideoService) {}

  ngOnInit() {

    //Featured
    this.http.get<any>(environment.apiUrl + '/api/mixtapes/featured?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758').subscribe(
      response => {
          this.featuredArray = response.responseObject;
      }
    );

    // New Mixtapes
    this.http.get<any>(environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&currentPage=1&itemsPerPage=12').subscribe(
      response => {
       // res.json().then( response =>{
          this.mixtapeArray = response.responseObject[0].items;
          /*for(let f = 0; f < this.mixtapeArray.length; f++){
            var coverImage = this.mixtapeArray[f].coverImageName;
             var baseImage = coverImage.replace("http://cmtz.nyc3.cdn.digitaloceanspaces.com","https://do-images-klqk8.ondigitalocean.app/do");
             this.mixtapeArray[f].coverImageName = baseImage + "?webp.lossless=true";;
             this.mixtapeArray[f].imageSrcSet = [
              baseImage + "?width=200&webp.lossless=true 200w",
              baseImage + "?width=340&webp.lossless=true  340w",
              baseImage + "?width=500&webp.lossless=true 500w",
            ];
            this.mixtapeArray[f].imageSize = [
              "(max-width: 200px) 160px",
              "(max-width: 340px) 300px",
              "500px"
            ]
          }*/
       // })
      }
    );

    // New Videos
    this.http.get<any>(environment.apiUrl + '/api/videos/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&currentPage=1&itemsPerPage=12').subscribe(
      response => {
          this.videoArray = response.responseObject[0].items;
      }
    );

    // Trending Single
    this.http.get<any>(environment.apiUrl + '/api/tracks/paged?accesskey=4a4897e2-2bae-411f-9c85-d59789afc758&trackSort=4&range=1&singleType=1&itemsPerPage=20&currentPage=1').subscribe(
      response => {
              this.singleArray = response.responseObject[0].items;
          }
     );

     // Radio Genre
     this.http.get<any>(environment.apiUrl + '/api/radio/list?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758').subscribe(
      response => {
        //res.json().then( response =>{
          this.radioArray = response.responseObject;
          for(let f = 0; f < this.radioArray.length; f++){
            var coverImage = this.radioArray[f].coverImageName;
             var baseImage = coverImage.replace("http://www.certifiedmixtapez.com/images/Radio","assets");
             baseImage = baseImage.replace("png","jpg");
             this.radioArray[f].coverImageName = baseImage 
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
    //this.playerService.shouldShow(true);
    var start = Number(index);
    /*this.router.navigate([
      "video",
      album.id,
    ]);*/
    //this.playerService.playTrack(start.toString());
  }

  onGetTracks(album) {
    //this.ituneService.tracksSubject.next(album);
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
