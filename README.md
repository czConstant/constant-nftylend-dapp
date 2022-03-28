## About

NFT Pawn is a decentralized lending platform powered by MyConstant.

## Prerequisites

This project requires NodeJS (version 14 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

```sh
$ yarn
```

## Usage

Create an `.evn` file at root location. Fill its content with appropriate parameter. (Check `.env.example` for example).

### Running the app in local

```sh
$ yarn dev
```
Runs the app in the development mode. Open http://localhost:3000 to view it in the browser. The page will hot reload as you make edits.

### Building a distribution version

```sh
$ yarn build
```

Builds the app for production and files are saved to the /dist folder. It bundles your files in production mode and optimizes the build for the best performance. The build is minified and the filenames include hashes.

Your app is ready to be deployed!

### Preview the build

```sh
$ yarn preview
```

Runs the app in the production mode. Open http://localhost:4173 to view it in the browser.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
