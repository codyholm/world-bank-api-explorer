import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CountryInfoService } from '../country-info.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  // SVG content loaded from external file
  svgContent: SafeHtml = '';

  // Inject services into component
  constructor(
    private countryInfoService: CountryInfoService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  // Load SVG content on component initialization
  ngOnInit(): void {
    this.http.get('assets/world-map.svg', { responseType: 'text' })
      .subscribe(svg => {
        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
      });
  }

  // Variable to store country details to display on page
  countryDetails: any = {};

  // Variable to track the currently selected country code
  selectedCountryCode: string = '';

  // Array to store pinned countries for comparison (max 2)
  pinnedCountries: Array<any> = [];

  // Maximum number of countries that can be pinned
  maxPinnedCountries = 6;

  // Available colors for countries (in order of assignment)
  availableColors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6'];
  
  // Map to track which color is assigned to which country
  countryColorMap: Map<string, string> = new Map();
  
  // Track currently hovered country for color assignment
  hoveredCountryCode: string = '';

  // Variables to track tooltip state and position
  tooltipVisible: boolean = false;
  tooltipText: string = '';
  tooltipX: number = 0;
  tooltipY: number = 0;

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

    // If clicking a pinned country, just show its details (don't change selection)
    if (this.isPinned(countryCode)) {
      // Don't change selectedCountryCode or colors, just fetch and display data
      forkJoin({
        data: this.countryInfoService.getCountryInfo(countryCode),
        population: this.countryInfoService.getCountryPopulation(countryCode),
        gdp: this.countryInfoService.getCountryGDP(countryCode)
      }).subscribe(({data, population, gdp }) => {
        const countryData = data[1][0];
        const populationData = population[1][0];
        const gdpData = gdp[1][0];
        
        // Log GDP data for testing and debugging
        console.log(`${countryData.name} (${countryCode}) - GDP Response:`, gdpData);
      });
      return;
    }

    // Clear previously selected country if it's different and not pinned
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

    // Select the clicked country (assign color and update selection)
    const color = this.assignColorToCountry(countryCode);
    target.classList.add(color);
    this.selectedCountryCode = countryCode;

    // Call function to get country information
    forkJoin({
      data: this.countryInfoService.getCountryInfo(countryCode),
      population: this.countryInfoService.getCountryPopulation(countryCode),
      gdp: this.countryInfoService.getCountryGDP(countryCode)
    }).subscribe(({data, population, gdp }) => {
      const countryData = data[1][0];
      const populationData = population[1][0];
      const gdpData = gdp[1][0];
      
      // Log GDP data for testing and debugging
      console.log(`${countryData.name} (${countryCode}) - GDP Response:`, gdpData);
      
      // Add country details to object
      this.countryDetails = {
        code: countryCode,
        name: countryData.name,
        capitalCity: countryData.capitalCity,
        region: countryData.region.value,
        incomeLevel: countryData.incomeLevel.value,
        population: this.formatPopulation(populationData),
        gdp: this.formatGDP(gdpData, countryData.name),
        color: this.getCountryColor(countryCode)
      };
    });
  } 

    // Function to handle mouse enter on map for tooltip display
    onCountryMouseEnter(event: MouseEvent): void {
    const target = event.target as SVGPathElement;
    if (target.tagName === 'path') {
      const countryName = target.getAttribute('name');
      if (countryName) {
        this.tooltipText = countryName;
        this.tooltipVisible = true;
        this.tooltipX = event.clientX + 10;
        this.tooltipY = event.clientY + 10;
      }
    }
  }

  // Function to handle mouse move on map for tooltip position update
  onCountryMouseMove(event: MouseEvent): void {
    const target = event.target as SVGPathElement;
    if (target.tagName === 'path') {
      const countryName = target.getAttribute('name');
      if (countryName) {
        if (this.tooltipText !== countryName) {
          this.tooltipText = countryName;
        }
        this.tooltipVisible = true;
        this.tooltipX = event.clientX + 10;
        this.tooltipY = event.clientY + 10;
      }
    } else {
      this.tooltipVisible = false;
    }
  }

  // Function to handle mouse leave on map to hide tooltip
  onCountryMouseLeave(): void {
    this.tooltipVisible = false;
    this.tooltipText = '';
  }

  // Function to format population data with null checking
  // Returns "Data Unavailable" if population data is missing, null, or undefined
  formatPopulation(populationData: any): string {
    if (!populationData || populationData.value === null || populationData.value === undefined) {
      return 'Data Unavailable';
    }
    return populationData.value.toLocaleString();
  }

  // Function to format GDP data with null checking and conditional decimal formatting
  // Handles missing data and applies different formatting based on GDP magnitude:
  // - GDP >= $100M: whole number (e.g., $23,315M)
  // - GDP < $100M: one decimal place (e.g., $45.3M)
  //
  // Testing Notes - Countries with missing/unavailable GDP data:
  // Territories: Greenland, Puerto Rico, Guam, French Guiana, Martinique, Réunion
  // Dependencies: Bermuda, Cayman Islands, Gibraltar, Falkland Islands
  // Special Regions: Western Sahara, Gaza Strip, West Bank
  // Small Islands: Many Caribbean and Pacific island territories
  // These display "Data Unavailable" instead of $0M
  formatGDP(gdpData: any, countryName: string): string {
    // Check if GDP data is missing, null, undefined, or zero
    if (!gdpData || gdpData.value === null || gdpData.value === undefined || gdpData.value === 0) {
      console.log(`⚠️ ${countryName} - GDP data unavailable or zero`);
      return 'Data Unavailable';
    }

    const gdpInMillions = gdpData.value / 1_000_000;
    
    // Log formatted GDP for debugging and testing
    console.log(`✓ ${countryName} - GDP: $${gdpInMillions.toFixed(1)}M (raw: ${gdpData.value})`);
    
    // Conditional formatting based on GDP magnitude
    if (gdpInMillions >= 100) {
      // For GDP >= $100M, display as whole number with no decimals
      return `$${Math.round(gdpInMillions).toLocaleString()}M`;
    } else {
      // For GDP < $100M, display with one decimal place
      return `$${gdpInMillions.toFixed(1)}M`;
    }
  }
}
