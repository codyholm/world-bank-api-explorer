# World Bank API Explorer

An interactive Angular data visualization application that displays live economic indicators from the World Bank API on a clickable world map.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-app-url.netlify.app)

## Live Demo

**[View Live Application](https://your-app-url.netlify.app)**

## Features

- **Interactive World Map** - Click on any country to view detailed economic data
- **Real-Time Data** - Pulls live data from World Bank's public API
- **Economic Indicators** - View GDP, population, growth rates, and more
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Country Filtering** - Search and filter countries by region or name

## Tech Stack

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?logo=reactivex&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)

- **Frontend Framework**: Angular 12+
- **Language**: TypeScript
- **Data Handling**: RxJS for reactive programming
- **API Integration**: World Bank REST API
- **Styling**: CSS3, Flexbox
- **Deployment**: Netlify

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

## Author

**Cody Holm**

- GitHub: [@CodyHolm](https://github.com/CodyHolm)
- LinkedIn: [cody-holm](https://linkedin.com/in/cody-holm-3b6b4b132)

## Acknowledgments

Data provided by the World Bank API. 
