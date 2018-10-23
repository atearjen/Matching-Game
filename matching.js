/*
    Functionality
        -add event listener to each card so that when it is clicked it can respond
        -each card that is clicked needs to be added to the openCards array
          -openCards array can only hold two cards at a time
          -each card that is clicked/added to openCards array needs to have open and show added to they class
          -get the first child this is where the icons are within the <i>
          -check the cards that are in the array to see if class of the first child of each matches
        -if cards match = true, change the classes to card,show, match
          -push those cards to another array called cardMatches
          -cardMatches array needs to be used to end them game when the length is equal to 16
        -if cards match = false, remove the classes open and show from the elements using setTimeout function
          -remove these cards from the openCards array toggle back to just having the card class
        -disable the pointer events for open class so the card doesn't match itself or the matched list will be wrong and the card will stay open alone

    End Game
        -trigger on the last click
        -when matchCards.length == 16
            -display a winner modal https://www.w3schools.com/howto/howto_css_modals.asp

    Reset Game
        -on refresh the deck needs to be shuffled so create the function and call it (); before everything else happens
        -add event listener to restart icon on click
            -shuffles the deck
            -empties the matchedCards array
            -removes all classes but card

    Timer

    Star Rating Count
        -create and array that adds every card that is clicked.
        -an attempt should be every two cards so array.length/2 is actually the score
            -save this number into a variable attempts
        -the perfect game would take 16 clicks, thats never going to be a thing
            -3stars is attempts <28 because you can click through and match as you go
            -2stars is attempts 29<38
            -1stars is attempts >39
    */

const allCards=document.querySelectorAll('.card');//gather all the cards into a variable
let openCards=[];//create a list/array for when we open cards, so that we can compare them
let matchedCards=[];//creates a list of cards that have been matched needs to be used to end game when length is 16
let clicksCounted=[];//array to hold every card that has the click event triggered does not clear like openCards
const modal = document.getElementById('success-modal');
const span = document.getElementsByClassName('close')[0];
const starRating = document.getElementsByClassName('stars')[0];
let moves=document.querySelector('span.moves');
const refreshIcon = document.querySelector('.restart');
let timer=document.getElementById('output');
let replayButton= document.getElementById('replay');
let running=0;
let successTimer=document.getElementById('final-output');

/*https://stackoverflow.com/questions/7070054/javascript-shuffle-html-list-element-order*/
function shuffleDeck(){
	let deck = document.querySelector('ul.deck');
    for (let i = deck.children.length; i >= 0; i--) {
        deck.appendChild(deck.children[Math.random() * i | 0])}
}
shuffleDeck();

allCards.forEach(function(card){
    card.addEventListener('click', function(e){
        startStop();
        openCards.push(card);
        clicksCounted.push(card);
        card.classList.add('open','show');
        moves.innerHTML = clicksCounted.length;

        if(openCards.length == 2 && (openCards[0].firstElementChild.className==openCards[1].firstElementChild.className)){
            openCards.forEach(function(card){
                matchedCards.push(card);
                card.classList.add('match');
            })
        }

        if(openCards.length == 2 && (openCards[0] != openCards[1])){
            setTimeout(function(clearCards){
                console.log(openCards);
                openCards.forEach(function(card){
                   card.classList.remove('open','show');
                });
                openCards=[];
            },400);
        }

        let matches = matchedCards.length;
        if(matches == 16){
            running=0;
            tenths=-1;
            console.log('You won');
            modal.style.display = 'block';
            document.getElementById('attempts-made').innerHTML = Math.ceil(clicksCounted.length/2);//rounds down the result because there is no half a turn
            document.getElementById('final-output').innerHTML = successTimer.innerHTML;
        }

        function starRating(){
            if(clicksCounted.length >25){
            document.getElementById('third-star').className='fa fa-star-o';
            document.getElementById('star-three').className='fa fa-star-o';

            }

            if(clicksCounted.length >35){
            document.getElementById('second-star').className='fa fa-star-o';
            document.getElementById('star-two').className='fa fa-star-o';

            }

            if(clicksCounted.length >45){
            document.getElementById('first-star').className='fa fa-star-o';
            document.getElementById('star-one').className='fa fa-star-o';
            }

        }
        starRating();
    })
})

document.getElementById('attempts-made').innerHTML = clicksCounted.length;

/*reset the html for the timer, reset the start-stop toggle to stopped*/
refreshIcon.addEventListener('click', function (){
    refreshBoard();
})

/*1000 tenths equals 1 second and 100 tenths equals one tenth of a second.*/
let tenths=0;
let seconds=0;
let minutes=0;
function addTime(){
    if (running==1){
        setTimeout(function increment(){
            tenths++;
            if (tenths >= 10) {
                tenths = 0;
                seconds++;
                if (seconds >= 60) {
                    seconds = 0;
                    minutes++;
                }
            }
            timer.innerHTML = (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') + ':' + (seconds ? (seconds > 9 ? seconds : '0' + seconds) : '00') + ':' + (tenths > 9 ? tenths : '0' + tenths);
            successTimer.innerHTML=minutes + ' mins ' + seconds +' secs ';
            addTime();
        },100)
    }
}

/*This function needs to be triggered by the first card click to flip the switch and triggered again by the last match made to stop it*/
function startStop(){
    if (running==0){
        running=1;
        addTime();
    }
}

function clearClock(){
    timer.innerHTML='00:00:00';
    successTimer.innerHTML="";
    tenths=-1;/*the clock runs for a second during refresh resulting in a tenth of a second being put on the clock*/
    seconds=0;
    minutes=0;
    running=0;
}

function refreshBoard(){
    clearClock();
    shuffleDeck();
    matchedCards=[];
    openCards=[];
    starRating.innerHTML= "<li><i id='first-star' class='fa fa-star'></i></li><li><i id='second-star' class='fa fa-star'></i></li><li><i id='third-star' class='fa fa-star'></i></li>";
    clicksCounted=[];
    moves.innerHTML='0';
    allCards.forEach(function(card){
        card.classList.remove('open','show','match');
    })
}

function hideModal(){
    modal.style.display = 'none';
}

span.onclick = function() {
    hideModal();
}

replayButton.addEventListener('click',function(){
    refreshBoard();
    hideModal();
})
