import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from '../shared/player.service';
import WaveSurfer from 'wavesurfer.js';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { environment } from '../../environments/environment';



@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  animations: [
    trigger('scroll', [
      state('on', style({left: '-100px'})),
      transition('* => *', [
        style({left: '-100px'}),
        animate(10000, style({left: '100%'}))
      ])
    ])
  ]
})
export class PlayerComponent implements OnInit {
  @ViewChild('player')
  playerRef;
  player: any;
  wave: WaveSurfer = null;
  currentTrack: any;
  coverImage: string;
  trackTitle: string;
  isPlaying:boolean;
  trackIndex: number;
  state = 0;

  scrollDone() {
    this.state++;
  }


  constructor(private playerSer: PlayerService, private cdr: ChangeDetectorRef) {
    playerSer.playTrack$.subscribe(order => {
      this.trackIndex = Number(order);
      this.currentTrack = this.playerSer.getQueue()[this.trackIndex];

      if(this.currentTrack.trackTitle.includes("-")){
        var artists = this.currentTrack.album.artists;
        this.trackTitle = this.currentTrack.trackTitle.replace(artists, "");
        this.trackTitle = this.trackTitle.replace("-","").trim();
      }
      else {
        this.trackTitle = this.currentTrack.trackTitle;
      }
      this.coverImage = this.currentTrack.album.thumbImg;
      var trackUrl = this.currentTrack.trackURL//.replace("http","https");

      if (environment.production) {
        trackUrl = this.currentTrack.trackURL.replace("http:","https:");
        this.coverImage = this.currentTrack.album.thumbImg.replace("http:","https:");
      }

      this.playTrack(trackUrl);
    });

    playerSer.pauseTrack$.subscribe(() => {
      this.pause();
    });
  }

  ngOnInit() {
    this.player = this.playerRef.nativeElement;
  }

  playTrack(previewUrl) {
    //this.player.src = previewUrl;
    //this.player.play();
    if (!this.wave) {
      this.generateWaveform();
    }

    this.cdr.detectChanges();

    Promise.resolve().then(() => this.wave.load(previewUrl));

  }

  play(){
    this.wave.play();
    this.isPlaying = true;
  }
  pause() {
    //this.player.pause();
    this.wave.pause();
    this.isPlaying = false;
  }

  next(){
    this.trackIndex = this.trackIndex + 1;
    this.playerSer.playTrack(this.trackIndex.toString())
  }

  prev() {
    if(this.trackIndex != 0){
      this.trackIndex = this.trackIndex - 1;
      this.playerSer.playTrack(this.trackIndex.toString())
    }
  }

  playerEnded() {
    this.playerSer.trackEnded();
  }

  onPreviewPressed(): void {
    if (!this.wave) {
      this.generateWaveform();
    }

    this.cdr.detectChanges();

    Promise.resolve().then(() => this.wave.load(this.player.src));
  }

  generateWaveform(): void {
    Promise.resolve(null).then(() => {
      this.wave = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'white',
        progressColor: "#3b97f9",
        barWidth: 1.8,
        barHeight: 0.5,
        minPxPerSec: 25,
        maxCanvasWidth: 2000,
        height: 100,
        fillParent: true,
        barGap: 2.5
      });

      this.wave.on('ready', () => {
        this.wave.play();
        this.isPlaying = true;
      });

      this.wave.on('finish', () => {
        this.next();
        this.isPlaying = true;
      });
    });
  }
}
