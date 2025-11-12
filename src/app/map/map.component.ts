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

  // Variable to track the currently selected country code
  selectedCountryCode: string = '';

  // Array to store pinned countries for comparison (max 2)
  pinnedCountries: Array<any> = [];

  // Maximum number of countries that can be pinned
  maxPinnedCountries = 2;

  // Available colors for countries (in order of assignment)
  availableColors = ['color-1', 'color-2', 'color-3']; // blue, green, purple
  
  // Map to track which color is assigned to which country
  countryColorMap: Map<string, string> = new Map();
  
  // Track currently hovered country for color assignment
  hoveredCountryCode: string = '';

  // Check if a country is currently pinned
  isPinned(countryCode: string): boolean {
    return this.pinnedCountries.some(country => country.code === countryCode);
  }

  // Check if more countries can be pinned
  canPinMore(): boolean {
    return this.pinnedCountries.length < this.maxPinnedCountries;
  }

  // Get the next available color that hasn't been assigned
  getNextAvailableColor(): string {
    const usedColors = Array.from(this.countryColorMap.values());
    for (const color of this.availableColors) {
      if (!usedColors.includes(color)) {
        return color;
      }
    }
    return this.availableColors[0]; // fallback
  }

  // Get the color for a country (assigned or new)
  getCountryColor(countryCode: string): string {
    if (this.countryColorMap.has(countryCode)) {
      return this.countryColorMap.get(countryCode)!;
    }
    return '';
  }

  // Assign a color to a country if it doesn't have one
  assignColorToCountry(countryCode: string): string {
    if (!this.countryColorMap.has(countryCode)) {
      const color = this.getNextAvailableColor();
      this.countryColorMap.set(countryCode, color);
      return color;
    }
    return this.countryColorMap.get(countryCode)!;
  }

  // Pin a country for comparison
  pinCountry(countryCode: string, countryData: any): void {
    if (!this.isPinned(countryCode) && this.canPinMore()) {
      const color = this.getCountryColor(countryCode);
      this.pinnedCountries.push({
        code: countryCode,
        data: countryData,
        color: color
      });
      
      // Clear the selected country details since it's now pinned
      this.selectedCountryCode = '';
      this.countryDetails = {};
    }
  }

  // Unpin a country
  unpinCountry(countryCode: string): void {
    const index = this.pinnedCountries.findIndex(country => country.code === countryCode);
    if (index !== -1) {
      this.pinnedCountries.splice(index, 1);
      // Remove the color class from map and color map
      const element = document.getElementById(countryCode);
      const color = this.countryColorMap.get(countryCode);
      if (element && color) {
        element.classList.remove(color);
        this.countryColorMap.delete(countryCode);
      }
    }
  }

  // Function to handle click event on map
  onMapClick(event:MouseEvent): void {
    const target = event.target as SVGPathElement;
    const countryCode = target.id;

    // Log country code to console for testing
    console.log(`Country code: ${countryCode}`);

    // If clicked off map (no country code), clear selection unless it's pinned
    if (!countryCode) {
      if (this.selectedCountryCode && !this.isPinned(this.selectedCountryCode)) {
        const previousElement = document.getElementById(this.selectedCountryCode);
        const color = this.countryColorMap.get(this.selectedCountryCode);
        if (previousElement && color) {
          previousElement.classList.remove(color);
          this.countryColorMap.delete(this.selectedCountryCode);
        }
        this.selectedCountryCode = '';
        this.countryDetails = {};
      }
      return;
    }

    // If clicking a different country than selected, remove previous selection
    if (this.selectedCountryCode && 
        this.selectedCountryCode !== countryCode && 
        !this.isPinned(this.selectedCountryCode)) {
      const previousElement = document.getElementById(this.selectedCountryCode);
      const color = this.countryColorMap.get(this.selectedCountryCode);
      if (previousElement && color) {
        previousElement.classList.remove(color);
        this.countryColorMap.delete(this.selectedCountryCode);
      }
    }

    // Select the clicked country (assign color if needed)
    if (!this.isPinned(countryCode)) {
      const color = this.assignColorToCountry(countryCode);
      target.classList.add(color);
      this.selectedCountryCode = countryCode;
    }

    // Call function to get country information
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
        code: countryCode,
        name: countryData.name,
        capitalCity: countryData.capitalCity,
        region: countryData.region.value,
        incomeLevel: countryData.incomeLevel.value,
        population: populationData.value.toLocaleString(),
        gdp: `$${(gdpData.value / 1_000_000).toLocaleString()}M`,
        color: this.getCountryColor(countryCode)
      };
    });
  }
}
