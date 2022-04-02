// --------------------   VARIABLES DECLARED  -----------------------
var triggerWarnings1 = ["A dog dies.", "A cat dies.", "Animal abuse.", "Contains bugs.", "Contains dog fighting.", "An animal dies.", "Contains depictions of dead animals.", "A horse dies.", "Contains snakes.", "Contains spiders.", "A dragon dies.", "Has someone being stalked.", "Contains gaslighting.", "Contains domestic violence.", "Contains child abuse.", "Contains substance addiction.", "Contains drug use.", "Contains alcohol abuse.", "Contains shaving and/or cutting.", "Contains tooth damage.", "Contains genital trauma and/or mutilation.", "Contains cannibalism", "A person is burnt alive.", "Contains depictions of amputation.", "Someone's head gets squashed.", "Someone is buried alive.", "Contains finger and/or toe mutilation.", "Someone is hanged.", "Contains eye mutilation.", "Someone struggles to breathe.", "Someone has a seizure.", "Contains depictions of torture.", "Contains bone fractures.", "Someone falls to their death.", "A child dies.", "Contains adultery.", "Someone is kidnapped.", "A child's sentimental toy is destroyed.", "A parent dies.", "Contains jumpscares.", "Contains clowns.", "Contains ghosts.", "Contains shower scenes.", "Someone is possessed.", "Someone vomits.", "Contains aural depictions of gore.", "Contains farting and/or spitting.", "Someone urinates and/or excrete oneself.", "Contains glorification of unlawful acts by police.", "Someone has cancer.", "Contains depictions of electro-therapy.", "Contains depictions of mental institutions.", "Contains syringe use.", "Contains hospital scenes.", "Contains misophonia.", "Contains depictions of self-harm.", "Contains anxiety attacks.", "A mentally ill person becomes violent.", "Contains depictions of suicide.", "Contains depictions of body dysmorphia.", "Containst claustrophobic scenes.", "Contains autism-specific abuse.", "Someone has an eating disorder.", "Someone says, \"I\'ll kill myself.", "Contains scenes of babies crying.", "Contains shakey camera footage.", "Contains flashing lights and/or images.", "A pregnant woman dies.", "Contains depictions of abortion.", "Contains depictions of miscarriage.", "Contains depictions of childbirth.", "Contains ableist language and/or behaviour.", "A black person dies first.", "An LGBT person dies.", "Contains depictions of antisemitism.", "Contains homophobic slurs", "Contains hate speech.", "Contains \"Man in a dress\" jokes.", "Someone is misgendered.", "Contains fat jokes."]; // contains trigger warning categories, array length = 80
// issue occurs if there are more than 2500 characters in a single line.

var triggerWarnings2 = ["Contains racial slurs", "Contains depictions of sexual assault.", "Contains sexual content.", "Contains scenes depicting incest.", "Contains a sad ending.", "A fictional character like Santa Claus is spoiled.", "Contains a car crash scene.", "Contains a plane crash scene.", "Someone gets hit by a vehicle.", "Contains depictions of blood and/or gore.", "Contains depictions of nuclear explosions.", "Someone drowns.", "Contains gun violence."]; // contains the rest of the trigger warning categories, array length = 13

var triggerWarningsConcat = triggerWarnings1.concat(triggerWarnings2); // joins the arrays together.

var commonMovieTitleWords = ["the", "a", "i", "an", "you", "of", "and", "in", "to", "we", "on", "me", "be", "go", "no", "is", "1", "two", "2", "ii", "one", "it", "it's", "for", "her", "when", "they", "my", "three", "3", "iii", "who", "with", "up", "your", "not", "at", "his", "that", "was", "all", "this", "by", "first", "back", "only", "get"]; // Commonly used words in movie titles

var btnSearch = document.querySelector("#btn-search");
var sectionSearch = document.querySelector("#section-search");
var textboxSearch = document.querySelector("#textbox-search");
var searchMovieFormEl = document.querySelector("#search-movie-form");


var omdbApiKey="ef78856e";
var omdbUrl ="https://www.omdbapi.com/?apikey=" + omdbApiKey + "&type=movie&s=";
var omdbSingleSearchUrl = "https://www.omdbapi.com/?apikey=" + omdbApiKey + "&i="

var pageNumber;
var totalPages;
var totalMovies;

var randomWordGenerator = "?random=true"; // parameter for generating random words
var enteredInput = "test"; // form-input.value is supposed to be entered here, not a string.


btnSearch.addEventListener("click",searchMovie);
textboxSearch.addEventListener("keyup", toggleSearchButton);
document.addEventListener("click",checkPaginationClick);

function toggleSearchButton(){
    var totalChild = document.body.children.length;
    if (textboxSearch.value.length>0)
    {
        btnSearch.disabled=false
    }
    else{
        btnSearch.disabled=true;
        removeSearchAndPagination();
        sectionSearch.setAttribute("class","hero is-fullheight");
    }
    // textboxSearch.value.length>0 ? btnSearch.disabled=false :btnSearch.disabled=true;
}



btnSearch.disabled = true;


function searchMovie(event){
    event.preventDefault();
    omdbSearchTitle(textboxSearch.value,1);
    
    sectionSearch.setAttribute("class","hero");

    useWords(); // needs to be put here, do not place in the function that responds to keyup.
}

function omdbSearchTitle(movieTitle,page){
    
    fetch(omdbUrl + movieTitle + "&page=" + page).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            if (data["Response"]==="False"){
                console.log("Not Found");
                //CHANGE console log to MODAL display
            }
            else{
                localStorage.setItem("currentPage",page);
                showSearchResult(data);
            }
          });
        } else {
            //if response not ok have to show error in modal
        }
      });
}


function omdbGetSingleMovieDetails(omdbid){
    fetch(omdbSingleSearchUrl+ omdbid).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            if (data["Response"]==="False"){
                console.log("Not Found");
                //CHANGE console log to MODAL display
            }
            else{
                console.log(data);
            }
          });
        } else {
            //if response not ok have to show error in modal
        }
      });
}

function removeSearchAndPagination(){
    var sectionMovieResultPre = document.querySelector("#section-movie-result");
    const t = document.body.getElementsByClassName("display-result");
    if (sectionMovieResultPre !== null)
    {   
        document.body.removeChild(sectionMovieResultPre);
        

        var sectionPagination = document.querySelector("#section-pagination");
        if (sectionPagination!==null)
        {
            // alert("i am in");
            document.body.removeChild(sectionPagination);

        }
    }
}

function showSearchResult(data){
    //console.log(data);
    // var totalChild = document.body.children.length;
    // console.log("before creating : " + document.body.children.length);
    //
    
    
    removeSearchAndPagination();

    totalMovies=data["totalResults"];
    calculateTotalPages(totalMovies);
    

    var sectionMovieResult=document.createElement("section");
    sectionMovieResult.setAttribute("id","section-movie-result")
    sectionMovieResult.className= "hero display-result center-please";
    
    //console.log(sectionMovieResult.getAttribute('id'));
    var searchMovieDivContainer=document.createElement ("div");
    searchMovieDivContainer.className= "container is-fluid";
    var searchMovieDivContainerColumn = document.createElement("div");
    searchMovieDivContainerColumn.className = "columns is-multiline is-centered";
        
    for (var i=0; i< data["Search"].length; i++)
    {
        // -------------------- GET VALUES --------------------
        var poster = (data['Search'][i]['Poster']);
        var movieTitle =(data['Search'][i]['Title']);
        if (poster==="N/A")
        {
            poster="./assets/images/image-not-available.jpg";
        }
    
        omdbGetSingleMovieDetails(data['Search'][i]['imdbID']);



        // ------------------- GENERATE RESULT AND SHOW -------------------
        var divOutBox = document.createElement("div");
        divOutBox.className="column is-3-fullhd  is-3-desktop is-6-tablet is-12-mobile";
        var divInsideBox = document.createElement("div");
        divInsideBox.className="notification is-primary has-text-centered";

        var imgMovieImage = document.createElement("img");
        imgMovieImage.setAttribute("src",poster);
        imgMovieImage.className="cursor";

        var h3MovieTitle = document.createElement("h3");
        h3MovieTitle.className = "title is-6 cursor";
        h3MovieTitle.textContent = movieTitle;
        

        divInsideBox.appendChild(imgMovieImage);
        divInsideBox.appendChild(h3MovieTitle);
        divOutBox.appendChild(divInsideBox);

        searchMovieDivContainerColumn.appendChild(divOutBox);
    }
    searchMovieDivContainer.appendChild(searchMovieDivContainerColumn);
    sectionMovieResult.appendChild(searchMovieDivContainer);
    document.body.appendChild(sectionMovieResult);

    //console.log("after creating : " + document.body.children.length);
}

function calculateTotalPages(totalMovies){
    totalPages = Math.floor(totalMovies / 10);
    

    if (totalMovies%10>0)
    {
        totalPages++;
    }
    
    if (totalPages>1)
    {
        generatePagination();
    }
    console.log("Total Movies " + totalMovies + "     totalPages " +totalPages);
}

function generatePagination(){
    var loopStartingInt;
    var loopFinishingInt;
    pageNumber=getCurrentPageNumber();
    
    if (isNaN(pageNumber))
    {
        pageNumber=1;
    }

    var sectionPagination =document.createElement("section");
    sectionPagination.setAttribute("id","section-pagination");

    var navElement = document.createElement("nav");
    navElement.className="pagination is-centered";
    navElement.setAttribute("role","navigation");
    
    var ulElement = document.createElement("ul");
    ulElement.className="pagination-list";

    var liElement;
    var aElement;

    if (totalPages<=8)
    {
        loopStartingInt=2;
        loopFinishingInt=totalPages;
    }
    else
    {
        if(pageNumber<4)
        {
            loopStartingInt=2;
            loopFinishingInt=5;
        }
        else if(pageNumber<=(totalPages-3))
        {
            
            loopStartingInt=pageNumber-1;
            loopFinishingInt=pageNumber+2;
        }
        else{
            loopStartingInt=totalPages-3;
            loopFinishingInt=totalPages;
        }
    }
    // alert("Page number is = " + pageNumber + "    Loop start Int is " + loopStartingInt);ts

    liElement = document.createElement("li");            
    aElement=document.createElement("a");
    aElement.className="pagination-link";
    aElement.setAttribute("data-label","1");
    aElement.textContent=1;
    liElement.appendChild(aElement);
    ulElement.appendChild(liElement);
 
    
    
    if (pageNumber>3 && totalPages>8){
        liElement = document.createElement("li");
        aElement=document.createElement("a");
        aElement.className="pagination-ellipsis";
        aElement.textContent="...";
        liElement.appendChild(aElement);
        ulElement.appendChild(liElement);
    }
        //for(var i=loopStartingInt; i<(loopStartingInt+loopFinishingInt); i++){    
        for(var i=loopStartingInt; i<(loopFinishingInt); i++){    
                liElement = document.createElement("li");            
                aElement=document.createElement("a");
                aElement.className="pagination-link";
                aElement.setAttribute("data-label",i);
                aElement.textContent=i;
            
            liElement.appendChild(aElement);
            ulElement.appendChild(liElement);
        }
    
    if (pageNumber<(totalPages-2) && totalPages>8){
        liElement = document.createElement("li");
        aElement=document.createElement("a");
        aElement.className="pagination-ellipsis";
        aElement.textContent="...";
        liElement.appendChild(aElement);
        ulElement.appendChild(liElement);
    }

    liElement = document.createElement("li");            
    aElement=document.createElement("a");
    aElement.className="pagination-link";
    aElement.setAttribute("data-label",totalPages);
    aElement.textContent=totalPages;
    liElement.appendChild(aElement);
    ulElement.appendChild(liElement);


    navElement.appendChild(ulElement);
    sectionPagination.appendChild(navElement);
    document.body.appendChild(sectionPagination);
    var test = document.getElementsByClassName("pagination-link");
    console.log(test.length);
    
    for (var i=0; i<test.length; i++)
    {
        if(pageNumber== test[i].getAttribute("data-label"))
        {
            test[i].className="pagination-link is-current";
        }

    }
}

function getCurrentPageNumber()
{
    return parseInt(localStorage.getItem("currentPage"));
}


function checkPaginationClick(event){
    //console.log(event.target);
    if((event.target).className==="pagination-link")
    {
        if (typeof(parseInt((event.target).textContent))==="number")
        {
            pageNumber=(event.target).textContent
            omdbSearchTitle(textboxSearch.value,pageNumber);
        }
    }
    localStorage.setItem("currentPage",pageNumber); 
}


function init(){
    btnSearch.disabled = true;
    //getSearchHistory(); 
}

init();

const options = { // code provided by API docs
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
		'X-RapidAPI-Key': '6ecbaac172msh867cf483a4913b6p183836jsn739ee58e425f'
	}
};

function useWords() { // calls wordsAPI to change words which will generate title
    var lowerCase = textboxSearch.value.toLowerCase(); // have to make strings lowercase to make sure includes() list works correctly
    var wordsSplit = lowerCase.split(" "); // splits the title entered by each word

    var wordsNotChanged = []; // empty array
    var wordsChanged = []; // empty array

    var wordsChangedChecker = []; // empty array, checks array length

    for (var j = 0; j < wordsSplit.length; j++) { // to get the array length of the words that will go through API call
        if (!commonMovieTitleWords.includes(wordsSplit[j])){
            wordsChangedChecker.push(wordsSplit[j]);
        }
    }

    for (var i = 0; i < wordsSplit.length; i++) { // puts each word into an if statement to make a fetch call or not and fill arrays
        
        if (!commonMovieTitleWords.includes(wordsSplit[i])){
            fetch('https://wordsapiv1.p.rapidapi.com/words/' + wordsSplit[i], options) // to get a word you input: GET https://wordsapiv1.p.mashape.com/words/{word}
                // .then(response => response.json()) // code provided by API docs but not used.
                // .then(response => console.log(response))
                // .catch(err => console.error(err))
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // console.log(data);
                    var keysCheck = Object.keys(data); // gets the object key names from the call 
                    // console.log(keysCheck);
                    if (keysCheck.includes("results")) { // to check if the word called has this key
                        var resultsCheck = Object.keys(data.results[0]); // checks the keys inside array 0
                        // console.log(resultsCheck);
                    }
                    if (keysCheck.includes("results") && resultsCheck.includes("synonyms")) { // checks that those keys are in the object
                        wordsChanged.push(data["results"][0]["synonyms"][0]); // pushes the first synonym of the first result into wordsChanged
                        // console.log(wordsChanged);
                        if (wordsChangedChecker.length === wordsChanged.length) { // Has to be placed here in the for loop or else the function won't call correctly
                            return joinWords(wordsChanged, wordsNotChanged); // takes the variables to use them in the next function
                        }
                    } else if (keysCheck.includes("results") && resultsCheck.includes("antonyms")) { // checks that those keys are in the object
                        wordsChanged.push(data["results"][0]["antonyms"][0]); // pushes the first antonym of the first result into wordsChanged
                        // console.log(wordsChanged);
                        if (wordsChangedChecker.length === wordsChanged.length) { // Has to be placed here in the for loop or else the function won't call correctly
                            return joinWords(wordsChanged, wordsNotChanged); // takes the variables to use them in the next function
                        }
                    } else if (keysCheck.includes("results") && resultsCheck.includes("typeOf")) { // checks that those keys are in the object
                        wordsChanged.push(data["results"][0]["typeOf"][0]); // pushes the first typeOf of the first result into wordsChanged
                        // console.log(wordsChanged);
                        if (wordsChangedChecker.length === wordsChanged.length) { // Has to be placed here in the for loop or else the function won't call correctly
                            return joinWords(wordsChanged, wordsNotChanged); // takes the variables to use them in the next function
                        }
                    } else {
                        wordsChanged.push(data["word"]); // returns the original word entered
                        // console.log(wordsChanged);
                        if (wordsChangedChecker.length === wordsChanged.length) { // Has to be placed here in the for loop or else the function won't call correctly
                            return joinWords(wordsChanged, wordsNotChanged); // takes the variables to use them in the next function
                        }
                    }
                })
        }

        if (commonMovieTitleWords.includes(wordsSplit[i])) {
            wordsNotChanged[i] = wordsSplit[i]; // to put words not used in the words API into another array
            // console.log(wordsNotChanged);
        } else {
            wordsNotChanged[i] = undefined; // if it's not undefined then it will be empty and consecutive empty indexes get merged which gives the wrong array length to use
        }
    } 
}

function joinWords(wordsChanged, wordsNotChanged) { // we get the words for the movie title after changing it and put it back together
    // wordsChanged = wordsChanged.reverse(); // not useful when I can't control the order of the server data results

    var joinedWords = []; // empty array for joining the words

        for (var i = 0; i < wordsNotChanged.length; i++) { // checks the length of wordsNotChanged array because that contains the correct length
            if (wordsNotChanged[i] === undefined) { // if wordsNotChanged contains an ith undefined index
                joinedWords.splice(i, 0, wordsChanged[i]); // puts the ith index of wordsChanged into the ith index of joinedWords
                if (wordsNotChanged[i+1] !== undefined) { // if the next index in wordsNotChanged before the ith loop ends is undefined 
                    wordsChanged.unshift("oops"); // puts a new index from the beginning of the array shifting every index +1
                }
                // console.log(wordsChanged);
                // console.log(joinedWords);
            } else if (wordsNotChanged[i] !== undefined) { // else if wordsNotChanged doesn't contain an ith undefined index
                joinedWords.splice(i, 0, wordsNotChanged[i]);  // puts the ith index of wordsNotChanged into the ith index of joinedWords
                if (wordsChanged[i+1] === undefined) { // if the next index in wordsChanged before the ith loop ends is undefined
                    wordsChanged.unshift("oops"); // puts a new index from the beginning of the array shifting every index +1
                }                  
                // console.log(wordsChanged);
                // console.log(joinedWords);
            }
        }
        joinedWords = joinedWords.join(" "); // need to join the arrays into one string before splitting them again
        joinedWords = joinedWords.split(" "); // to split any new words that appeared which are more than one word in an index

        for (var j = 0; j < joinedWords.length; j++) { // to capitalise the first letter of each word in an array, source: https://flexiple.com/javascript-capitalize-first-letter/#:~:text=To%20capitalize%20the%20first%20character,()%20function%20to%20capitalize%20it.
            joinedWords[j] = joinedWords[j].charAt(0).toUpperCase() + joinedWords[j].slice(1); // in the jth index of the array, the first character changes to uppercase and is then concatenated with the rest of the word that was sliced from the second letter
        }
    joinedWords = joinedWords.join(" "); // the final join which creates a string
    console.log(joinedWords); // to be commented out once the following below occurs
    // insert.textContent <here> = joinedWords // puts the string onto the page
}

// word details that can appear in JSON Format, see docs: https://www.wordsapi.com/docs/#get-word-details

// if you want to play around with the words API, please use free demonstrator at: https://www.wordsapi.com/
// regarding API Calls using the API Key, please use it sparingly as there is a limit of 2500 calls per day and exceeding that 2500 call limit results in a charge of $0.004 per call after that 2500 limit. 

// to get a random word: GET https://wordsapiv1.p.mashape.com/words?random=true
// fetch('https://wordsapiv1.p.rapidapi.com/words/' + randomWordGenerator, options) // code provided by API docs
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));