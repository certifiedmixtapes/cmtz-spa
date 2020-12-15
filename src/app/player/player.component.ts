import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from '../shared/player.service';
import { UnmuteService } from '../shared/unmute.service';
import WaveSurfer from 'wavesurfer.js';
import MediaSessionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.mediasession.min.js';
//import MediaSessionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.mediasession.js'
import { trigger, state, style, animate, transition } from '@angular/animations';
import { environment } from '../../environments/environment';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList} from '@angular/cdk/drag-drop';
import { HostListener } from '@angular/core';
//import clonedeep from 'lodash.clonedeep';






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
  @ViewChild('tracks') table: MatTable<any>;
  @ViewChild('list1') list1: CdkDropList;
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
  queueShowing = false;
  queueTracks: Array<any> = [];
  dataSource;
  queueActive: string
  displayedColumns: string[] = ['Number', 'Name'];




  scrollDone() {
    this.state++;
  }


  constructor(private playerSer: PlayerService, private unmuteService: UnmuteService,  
    private cdr: ChangeDetectorRef) {

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

  }

  drop(event: CdkDragDrop<string[]>) {
    //console.log("event: " + event);

    if (event.previousContainer === event.container) {

      moveItemInArray(this.queueTracks, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    // updates moved data and table, but not dynamic if more dropzones
    //this.dataSource.data = clonedeep(this.dataSource.data);
    //this.playerSer.queueTracks(this.dataSource.data);
    //console.log("trackdata: " + JSON.stringify(this.dataSource.data));
    //this.table.renderRows();

  }

  playTrack(previewUrl) {
    //this.player.src = previewUrl;
    //this.player.play();
    //if (!this.wave) {
    this.generateWaveform();
    //}

    this.cdr.detectChanges();

    Promise.resolve().then(() => this.wave.load(previewUrl));

  }

  play(){
    this.wave.play();
    this.isPlaying = true;
  }
  pause() {
    this.wave.pause();
    this.isPlaying = false;
  }

  @HostListener('window:next-event', ['$event']) 
  next(){
    this.trackIndex = this.trackIndex + 1;
    this.playerSer.playTrack(this.trackIndex.toString())
  }

  playQueue(index) {
    var current = Number(index);
    this.playerSer.playTrack(current.toString());
  }

  toggleQueue(){
    this.queueShowing = !this.queueShowing;
    if(this.queueShowing){
      this.queueActive = "tooltip--active"
    }
    else{
      this.queueActive = ""
    }

    this.queueTracks = this.playerSer.getQueue();
    this.dataSource = new MatTableDataSource(this.queueTracks);

    console.log("table: " + this.table);
  }

  isQueueShowing(){
    return this.queueShowing;
  }

  @HostListener('window:prev-event', ['$event']) 
  prev() {
    if(this.trackIndex != 0){
      this.trackIndex = this.trackIndex - 1;
      this.playerSer.playTrack(this.trackIndex.toString())
    }
  }

  playerEnded() {
    this.playerSer.trackEnded();
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
        backend: 'MediaElement',
        fillParent: true,
        barGap: 2.5,
        plugins:[ MediaSessionPlugin.create({
          metadata: {
              title: this.trackTitle,
              artist: this.currentTrack.album.artists,
              album: this.currentTrack.album.title,
              artwork: [
                {src: this.coverImage,   sizes: '96x96',   type: 'image/png'},
                {src: this.coverImage, sizes: '128x128', type: 'image/png'},
                {src: this.coverImage, sizes: '192x192', type: 'image/png'},
                {src: this.coverImage, sizes: '256x256', type: 'image/png'},
                {src: this.coverImage, sizes: '384x384', type: 'image/png'},
                {src: this.coverImage, sizes: '512x512', type: 'image/png'},
              ]
          }
      })]
      });

      if ('mediaSession' in navigator) {
          window.navigator["mediaSession"].setActionHandler('previoustrack', function() {
             //this.prev();
             window.dispatchEvent(new Event('prev-event'));
          });
          
          window.navigator["mediaSession"].setActionHandler('nexttrack', function() {
            //this.next();
            window.dispatchEvent(new Event('next-event'));
          });
      } 

      this.wave.on('ready', () => {
        //waveSurfer.backend.getAudioContext()
        this.unmuteService.unmute(this.wave.backend.getAudioContext())
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
