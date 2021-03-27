import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

interface VideoElement extends HTMLVideoElement{
  requestPictureInPicture(): any;
}

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss']
})
export class VideoDetailsComponent implements OnInit {
  routeParams;
  video: any;
  player: YT.Player;
  videoId: any;
  ytvideoId: any;
  @ViewChild("videoElement") videoElement: ElementRef;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.routeParams = params;
      var id = params.id;

      fetch(environment.apiUrl +'/api/videos/' + id + '?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758').then(
        res => {
          res.json().then( response =>{
            console.log(response.responseObject[0]);
            this.video = response.responseObject[0];
            //"https://www.youtube.com/watch?v=KxbRMd4AnLs"
            var videoUrl = this.video.videoName;
            if(videoUrl.includes("https://www.youtube.com/watch?v=")){
              this.ytvideoId = videoUrl.replace("https://www.youtube.com/watch?v=","").trim();
              console.log("Video " + this.videoId);
            }
            else{
              this.videoId = videoUrl;
            }
            
          })
        }
      );
    });
  }

  ngAfterViewInit(){
    if(this.videoElement !==undefined){
      const video:  VideoElement = this.videoElement.nativeElement;
      console.log("Video " + video);
      video.addEventListener('play', async (e) => {
        await video.requestPictureInPicture();
      })
    }
  }

  savePlayer(player) {
    this.player = player;
    console.log("player instance", player);
  }
  onStateChange(event) {
    console.log("player state", event.data);
  }

}
