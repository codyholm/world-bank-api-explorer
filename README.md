# World Bank Data Explorer

An interactive Angular data visualization application that displays live economic indicators from the World Bank API on a clickable world map.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://worldbank-data-explorer.netlify.app/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/01467d71-4454-48fe-b2e5-8ec2f26d79a9/deploy-status)](https://app.netlify.com/projects/worldbank-data-explorer/deploys)

## Live Demo

**[View Live Application](https://worldbank-data-explorer.netlify.app/)**

## Features

- **Interactive SVG World Map** - 195 clickable countries with hover effects and real-time data display
- **Multi-Country Comparison System** - Color-coded pinning allows side-by-side analysis of GDP, population, and economic indicators
- **Real-Time World Bank API Integration** - Live data fetching using RxJS Observables for async stream management
- **Smart Data Formatting** - Conditional decimal handling (GDP >100M displays without decimals for readability)
- **Production Deployment** - Automated CI/CD pipeline via Netlify with GitHub integration

## Tech Stack

![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?logo=reactivex&logoColor=white)
[![World Bank API](https://img.shields.io/badge/API-World%20Bank-green)](https://data.worldbank.org/)

- **Frontend Framework**: Angular 17
- **Language**: TypeScript
- **Data Handling**: RxJS for reactive programming
- **Styling**: CSS3, Flexbox
- **API Integration**: World Bank REST API
- **Deployment**: Netlify (CI/CD)

## Key Implementation Details

### API Integration
- Consumes World Bank REST API for country metadata and economic indicators
- Implements error handling and loading states
- Uses RxJS Observables for asynchronous data streams

### Interactive Visualization
- SVG-based world map with 195+ clickable country regions
- Event-driven architecture for country selection
- Dynamic data panels with formatted numbers

### Architecture
- Component-based design with separation of concerns
- Typed services using TypeScript interfaces
- Dependency injection for service consumption
- Angular Router for navigation

### Potential Improvements

- Add visual feedback with color changes and shadows when cursor is hovering over countries 
- Improve country information display with icons, better typography, and refined layout
- Update to an improved SVG world map for enhanced visual appeal
- Highlight the currently selected countries borders or some other styling to show user selection

## Author

**Cody Holm**

- GitHub: [@CodyHolm](https://github.com/CodyHolm)

## Acknowledgments

Data provided by the [World Bank Open Data API](https://data.worldbank.org/).
