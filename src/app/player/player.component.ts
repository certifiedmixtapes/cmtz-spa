import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from '../shared/player.service';
import WaveSurfer from 'wavesurfer.js';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { environment } from '../../environments/environment';
import { MatTable, MatTableDataSource } from '@angular/material';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList} from '@angular/cdk/drag-drop';
import clonedeep from 'lodash.clonedeep';





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
  @ViewChild('tracks', { static: false }) table: MatTable<any>;
  @ViewChild('list1', { static: false }) list1: CdkDropList;
  @ViewChild('player', { static: false })

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

  dropTable(event: CdkDragDrop<string[]>) {
    console.log(event);
    const prevIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource.data, prevIndex, event.currentIndex);
    //this.playerSer.queueTracks(this.dataSource.data);

    this.table.renderRows();
  }


  drop(event: CdkDragDrop<string[]>) {
    console.log("event: " + event);

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
    console.log("trackdata: " + JSON.stringify(this.dataSource.data));
    //this.table.renderRows();

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
