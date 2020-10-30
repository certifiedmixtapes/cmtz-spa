import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItunesService } from '../shared/itunes.service';
import { ActivatedRoute } from '@angular/router';
import { Album } from '../album/album.model';
import { PlayerService } from '../shared/player.service';
import { isPlatformBrowser} from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit, OnDestroy {

  selectedAlbum: any;
  routeParams;
  tracks: Array<any> = [];
  displayedColumns: string[] = ['Number', 'Name'];
  isBrowser: boolean;

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
            this.playerService.queueTracks(this.tracks);
          })
        }
      );
    });
  }
  ngOnDestroy() {}

  playTrack(track) {
    this.playerService.shouldShow(true);
    console.log(track);
    var order = Number(track.order) -1;
    this.playerService.playTrack(order.toString());
  }

}
