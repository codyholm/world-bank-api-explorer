import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryInfoService {
  // URL for World Bank API
  private url = 'https://api.worldbank.org/v2/country';
  constructor(private http: HttpClient) { } 

  // Retrieve country information from World Bank API
  getCountryInfo(countryCode: string): Observable<any> {
    return this.http.get(`${this.url}/${countryCode}?format=json`);
  }

  // Retrieve country population from World Bank API
  getCountryPopulation(countryCode: string): Observable<any> {
    return this.http.get(`${this.url}/${countryCode}/indicator/SP.POP.TOTL?format=json`);
  }

  // Retrieve country GDP from World Bank API
  getCountryGDP(countryCode: string): Observable<any> {
    return this.http.get(`${this.url}/${countryCode}/indicator/NY.GDP.MKTP.CD?format=json`);
  }

}
