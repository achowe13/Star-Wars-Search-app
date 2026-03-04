# Star Wars Character Search Client

## Overview

This project is a TypeScript CLI client that uses a socket.io server to search for Star Wars Characters using the SWAPI Star Wars API. The user can search for a character using the terminal, and the name of any matching characters as well as the movies they were featured in are streamed back to the user one at a time.

## Features

- promps user for character name in terminal
- sends query to Docker hosted server via socket.io
- Recieves results one at a time
- Displays character names and film appearances that match input
- Reprompts on completed search whether success or error

## Tech Stack

- TypeScript
- Node.js
- socket.io client
- Readline
- Docker

## Installation

1. Clone Repository
2. Install Dependancies

```bash
npm install
```

## Running Client

server and client must be run in seperate terminals one using npm run client and the other using npm run server

## Start Client

Terminal 1:

```bash
npm run client
```

Terminal 2:

```bash
npm run server
```

You will be prompted in the terminal:

"What Star Wars character would you like to search for?"

Enter a name to begin the search.

## Author

Adam Howe
