import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  videoQueue: any;

  constructor() { }

  queueTracks(video: any) {
    this.videoQueue = video;
  }

  getQueue(){
    return this.videoQueue;
  }

}
