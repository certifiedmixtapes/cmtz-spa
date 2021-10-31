import { Component, OnInit, Input } from '@angular/core';
import { ItunesService } from '../shared/itunes.service';
import { filter, map } from 'rxjs/operators';
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
  constructor(private ituneService: ItunesService) {}

  ngOnInit() {}

  search(param) {
    this.ituneService.search(param).subscribe(
      data => {
        // console.log(data['results']);
        this.searchResults = data['results'];
      },
      err => console.log(err)
    );
  }

  searchByArtist(searchTerm){
    fetch( environment.apiUrl + '/api/mixtapes/paged?searchOptionType=3&searchString=" + searchTerm "&currentPage=1&itemsPerPage=12').then(
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
