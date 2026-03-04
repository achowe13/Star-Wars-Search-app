import { io } from "socket.io-client";
import readline from "readline"; // changed to import for consistancy

// local host connection
const socket = io("http://localhost:3000");

// initialize readline interface to collect inputs
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// inform user of proper connection to server and send initial question to the user
socket.on("connect", () => {
    console.log("Connected to Server");
    questionUser();
});

// inform user if disconnected from server
socket.on("disconnect", () => {
    console.log("Disconnected from Server");
});

// created Character interface to account for typing and also handle errors that are passed through
interface Character {
    page: number;
    resultCount: number;
    name: string | null;
    films: string[] | null;
    error: string | null;
};

//listen for search call 
socket.on("search", (person: Character) => {
    // if page is -1 an error has occurred and needs to be handled seperately
    if (person.page === -1){
        console.log(person.error);
        questionUser();
    } else {
        // send page count, name, and films for each user to the console
        console.log(`(${person.page}/${person.resultCount}) ${person.name} - ${JSON.stringify(person.films)}`);
        // if page and result count are the same then search has ended and another prompt will be sent to the user
        if (person.page === person.resultCount) {
            questionUser();
        };   
    };
}); 

// function to send question to the user prompting input
function questionUser(): void {
    rl.question("What Star Wars character would you like to search for? ", (answer: string) => {
        // reprompt user with question if nothing is entered
        if (!answer.trim()) {
            questionUser();
        } else {
            // send search query with user input and let the user know that the server is searching
            socket.emit("search", answer);
            console.log("searching...");
        };
    });
};