import { Component } from '@angular/core';
import { CountryInfoService } from '../country-info.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {

  // Inject CountryInfoService into component
  constructor(private countryInfoService: CountryInfoService) { }

  // Variable to store country details to display on page
  countryDetails: any = {};

  // Function to handle click event on map
  onMapClick(event:MouseEvent): void {
    const target = event.target as SVGPathElement;
    const countryCode = target.id;

    // Log country code to console for testing
    console.log(`Country code: ${countryCode}`);

    // Call function to get country information
    if (countryCode) {
      forkJoin({
        data: this.countryInfoService.getCountryInfo(countryCode),
        population: this.countryInfoService.getCountryPopulation(countryCode),
        gdp: this.countryInfoService.getCountryGDP(countryCode)
      }).subscribe(({data, population, gdp }) => {
        const countryData = data[1][0];
        const populationData = population[1][0];
        const gdpData = gdp[1][0];
        // Add country details to object
        this.countryDetails = {
          name: countryData.name,
          capitalCity: countryData.capitalCity,
          region: countryData.region.value,
          incomeLevel: countryData.incomeLevel.value,
          population: populationData.value.toLocaleString(),  // 
          gdp: `$${(gdpData.value / 1_000_000).toLocaleString()}M`  
        };
      });
    }
  }
}
