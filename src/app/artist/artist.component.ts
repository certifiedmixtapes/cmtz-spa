import { Component, OnInit, Input } from '@angular/core';
//import { filter, map } from 'rxjs/operators';
import {environment} from '../../environments/environment'

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {
  @Input()
  set searchKey(key: string) {
    console.log("artist search: " + key);
    this.searchByArtist(key);
  }
  searchResults: Array<any> = [];
  artistID: number = 0;
  selectedArtist: string;
  constructor() {}

  ngOnInit() {}

  ///api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&searchOptionType=3&searchString=future&currentPage=1&itemsPerPage=15
  searchByArtist(searchTerm){
    fetch( environment.apiUrl + '/api/mixtapes/paged?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&searchOptionType=3&searchString=" + searchTerm "&currentPage=1&itemsPerPage=12').then(
      res => {
        res.json().then( response =>{
          console.log(response);
          console.log(response.responseObject);
          console.log(response.responseObject[0].items);
          this.searchResults = response.responseObject[0].items;
          console.log(this.searchResults);

        })
      }
    );
  }

  getAlbums(artistId: number, artistName: string) {
    this.artistID = artistId;
    this.selectedArtist = artistName;
  }
}
