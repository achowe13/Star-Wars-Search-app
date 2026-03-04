import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const appServer = createServer(app);

const io = new Server(appServer, {cors: {origin: "*"}});

interface Character { 
    page: number;
    resultCount: number;
    name: string;
    films: string[]; 
};

interface SwapiPerson {
    name: string;
    films: string[];
}

interface SwapiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: SwapiPerson[];
}

const errorMessage = {
    // if a message reperesents an error, page & resultCount will always be -1
    page: -1, 
    resultCount: -1,
    // error text will always be populated for errors
    error: "Server Error: Unknown - Fatal" 
}

io.on("connection", (socket) => {
    console.log("connected");

    socket.on("search", async (query: string) => {
        try {
            console.log(query)
            let url: string | null = `https://swapi.dev/api/people/?search=${query}`;

            console.log("url: ", url)
            
            const allPeople: SwapiPerson[] = [];
            let resultCount = 0;

            // Fetch ALL pages
            while (url) {
                const result = await fetch(url);
                const data: SwapiResponse = await result.json();
                
                console.log("data ", data)
                resultCount = data.count;
                allPeople.push(...data.results);
                url = data.next;
            }

            if (allPeople.length === 0) {
                throw new Error("Empty response");
            }

            let page = 1;

            for (const person of allPeople) {

                // This now fetches films in parallel (faster)
                const films = await getFilmTitles(person.films);

                const character: Character = {
                    page,
                    resultCount,
                    name: person.name,
                    films
                };

                console.log(character)

                page++;
                socket.emit("search", character);
                await delay();
            }

        } catch (error) {
            socket.emit("search", errorMessage);
            console.log(error);
        }
    });
});

function getFilmTitles(filmUrls: string[]): Promise<string[]> {
    const filmPromises = filmUrls.map(async (url) => {
        const result = await fetch(url);
        const data = await result.json();
        return data.title;
    });
    return Promise.all(filmPromises)
}

//random delay function to simulate streaming
function delay(): Promise<void> {
    const delay = Math.floor(Math.random() * (1000 - 250 + 1) + 250);
    return new Promise(resolve => setTimeout(resolve, delay)); 
}

// function to ensure all people are recieved from the search not just the first page of 10
//async function fetchAllPeople(query: string) {
//    let url = `https://swapi.dev/api/people/?search=${query}`;
//    const allPeople: Character [] = [];
//
//    //checks to see if there is a url currently and if so gets search results from the api
//    while (url) {
//        const result = await fetch(url);
//        const data = await result.json();
//        
//        // add data to all people using spread
//        allPeople.push(...data.results);
//        
//        // changes url to the next page of results url
//        url = data.next;
//    }
//
//    return allPeople
//}

appServer.listen(3000, () => {
    console.log("server listening on http://localhost:3000");
});
