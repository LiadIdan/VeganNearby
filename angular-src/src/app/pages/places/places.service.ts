import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as yelp from 'yelp-fusion';
import 'rxjs/Rx';

import { PlacesStatus } from './places.model';
import { categories } from './data/index';
import { ConnectionService } from '../../services/connection.service';
import {
  YelpSearchParams,
  YelpSearchResponse,
  YelpBusinessResponse,
  YelpFilter
} from '../../models/yelp.model';

@Injectable()
export class PlacesService {
  public data = new YelpSearchResponse;
  public categories: YelpFilter[];
  public selectedCategory: YelpFilter;
  public selectedLocation: BehaviorSubject<string>;

  public viewStatus: PlacesStatus = {
    listView: '',
    currentPage: 1,
    itemsPerPage: 12
  };

  constructor(private http: HttpClient, private connectionService: ConnectionService, private mapsApiLoader: MapsAPILoader) {
    this.categories = categories;
    this.selectedCategory = Object.assign({}, this.categories[0]);
  }

  public search(params: YelpSearchParams): Observable<YelpSearchResponse> {
    if (params.location) {
      if (!this.selectedLocation) {
        this.selectedLocation = new BehaviorSubject<string>(params.location);
      }
      else {
        this.selectedLocation.next(params.location);
      }
    }

    return this.http.post<YelpSearchResponse>(`${this.connectionService.serverUrl}/yelp/search`, params)
      .timeout(this.connectionService.reqTimeout)
      .do(response => Object.assign(this.data, response));
  }

  public getPlaceById(id: string): Observable<YelpBusinessResponse> {
    return this.http.get<YelpBusinessResponse>(`${this.connectionService.serverUrl}/yelp/business`, {
      params: new HttpParams().set('id', id)
    })
      .timeout(this.connectionService.reqTimeout)
  }

  public geocoder(lat: number, lng: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.mapsApiLoader.load()
      .then(() => {
        const geocoder = new google.maps.Geocoder();
        const request: google.maps.GeocoderRequest = {
          location: {
            lat,
            lng
          }
        };

        geocoder.geocode(request, this.geocoderSuccess.bind(this, resolve, reject));
      })
      .catch(error => reject());
    });
  }

  private geocoderSuccess(resolve, reject, results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus): void {
    if (status.toString() === 'OK' && results.length > 0) {
      if (results.length > 1) {
        resolve(results[1].formatted_address);
      }
      else {
        resolve(results[0].formatted_address);
      }
    }
    else {
      reject();
    }
  }
}
