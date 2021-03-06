<div align="center">
<h1>:bar_chart: Stock Market App :iphone:</h1>

**Follow your favourite stocks in an intuitively designed app**

[![Github tag version](https://img.shields.io/github/tag/aayush2896/StockMarketApp-ionic1.svg?label=version)](https://github.com/aayush2896/StockMarketApp-ionic1/releases) [![GitHub last commit](https://img.shields.io/github/last-commit/aayush2896/StockMarketApp-ionic1.svg)](#end-of-life) ![Github Code Size](https://img.shields.io/github/languages/code-size/aayush2896/StockMarketApp-ionic1.svg) ![App Platforms](https://img.shields.io/badge/Platforms-%20Android%20|%20iOS%20-black.svg?colorB=000000) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://aayush.mit-license.org/2017-2018)<br>
:heavy_exclamation_mark: __Notice:__ `This project has reached its EOL, and will no longer be maintained.` :heavy_exclamation_mark:

</div>

----

<img src="/resources/android/icon/drawable-xxxhdpi-icon.png" alt="App Icon" align="left" width="15%"><p align="justify">
The following project involved developing an interactive Stock Market app using [Ionic Framework v1](https://ionicframework.com/docs/v1), and then deploying it on the Android platform using the [Android SDK](https://developer.android.com/studio), and [Apache Cordova](https://cordova.apache.org). The final app allows a user to see a stock’s detailed data, historical graph, and its related news. It also features a notes functionality, and has a realtime search functionality built in.

The final [release version](https://github.com/aayush2896/StockMarketApp-ionic1/releases/download/v1.0.0/StocksApp-signed.apk) of the application is designed for Ahead-Of-Time compilation for faster load times on modern devices. Additionally, all JavaScript and CSS files have been minimized into one file for lagless performance. The JavaScript files have been further optimized using Ionic CLI for a snappy response.
</p>

----

### Features

<div align="justify">

⚫ Pull-to-refresh ⚫ Follow/Unfollow Stocks ⚫ In-App Browser ⚫ Interactive Graph ⚫ Save Notes ⚫ Related News ⚫ Realtime Search ⚫ Latest Data Sources ⚫ Swipe-to-unfollow ⚫ Intelligent Cache Mode ⚫ Intuitive Color Scheme ⚫

</div>

----

<a href="https://imgur.com/a/Xoe1Y55"><img src="/resources/screens/screens.gif" align="right" alt="Screenshots Album"></a>

### App Screens

<div align="justify">

1.  ***My Stocks List:*** This is the first view that the user sees when he first launches the app. It has the list of apps that the user is following, and presents the latest stock data in a user-friendly way allowing him to quickly glance at the data. It also sports a ‘pull-to-refresh’, and a ‘swipe-to-unfollow’ feature.

2.	***Stock Details View:*** This screen comes into view when the user clicks on a stock ticker. This view has the following components:
    * A dynamic red/green header bar with the stock name and current price, representing the stock status.
    * An interactive volume vs date, and price vs date graph with the stock’s historical data.
    * Various stock details such as 52 week high and low, volume, EBITDA, market capitalization, etc with data sourced from Yahoo’s API.
    * A notes section enabling the user to save, access and delete notes.
    * A news section with news related to the stock.

3.	***Search View:*** This screen pops up when the user wants to search for stocks to follow. It sports realtime search functionality.

</div>

----

### Installation

1. **Clone** Repo: `$ git clone https://github.com/aayush2896/StockMarketApp-ionic1.git`
2. **Navigate**: `$ cd stockmarketapp-ionic1`
3. **Install** Dependencies: `$ npm install -g ionic cordova gulp bower gulp-sass --save-dev`
4. **Build** Project Dependencies: `$ npm install`
5. **Add Android** Platform: `$ ionic cordova platform add android` (step requires JDK and SDK to be added to PATH)
6. **Compile** for Android: `$ ionic cordova compile android`
7. **Build** App for Android: `$ ionic cordova build android --aot --release --minifyjs --minifycss --optimizejs`

-----

### Data Sources

**API** | **Usage**
----|----
Google Finance | for current/latest stock price
Yahoo Finance | for stock details, info and news
Quandl WIKI | for historical data to generate graph

> **Note:** At the time of this commit, all the above APIs have been shut down. Google's Finance API was deprecated in 2012, and finally shut down in Sept '17. Yahoo Finance API was abruptly shut down in Nov '17. Quandl WIKI data source was announced to be shut down in April '18. It will only take a ~~miracle~~ more reliable data source to replace all three. And possibly a single source to avoid the CORS issue too.

----

### End-Of-Life

This project was orginally undertaken in the Summer of '17 as an attempt to apprise myself with the world of Rapid Prototyping and Hybrid App Development. It served its purpose well, and I learned a lot over the course of [2 weeks](https://github.com/aayush2896/StockMarketApp-ionic1/commits/master) dedicated to this project. However, the app serves no purpose now in the absence of any source. Alternatives exist, but that involves a complete rewrite of how the data from the APIs is processed. I do not have the drive, nor the time to continue this project any further. If you wish to study it, or maybe even fix it.. feel free to fork it.
<br> _["Gentlemen, it's been a privilege flying with you."](https://youtu.be/zZTH3HdE8Sg?t=1m10s)_

----

### License
Copyright © 2017-2018 [Aayush Jain](https://keybase.io/aayushjain)<br>
Usage is provided under the [MIT License](https://aayush.mit-license.org/2017-2018).
