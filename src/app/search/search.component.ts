import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../shared/player.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  albumArray: Array<any> = [];
  artistName: string;
  public hoverButton:any;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.artistName = param.name;
      this.getAlbum(param.name);
    });
  }

  getAlbum(searchTerm){
    console.log("Term: " + searchTerm);
    fetch('https://www.certifiedmixtapez.com/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&searchOptionType=1&searchString=' + searchTerm + '&currentPage=1&itemsPerPage=12').then(
      res => {
        res.json().then( response =>{
          this.albumArray = response.responseObject[0].items;
        })
      }
    );
  }

  onGetTracks(album) {
    this.router.navigate([
      "album",
      album.id,
    ]);
  }

  toggleHover(id) {
    this.hoverButton = id
  }
  
  removeHover() {
    this.hoverButton = null;
  }

  playTracks(album){
    var id = album.id;
      fetch('https://www.certifiedmixtapez.com/api/tracks?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&albumId='+ id).then(
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

}
