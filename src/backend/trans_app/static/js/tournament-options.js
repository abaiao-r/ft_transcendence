let playerNames;
let playerAICheck = [];
let matches = [];
let playerCount;
let rounds;
let results;
let matchInfo;

// START
document.addEventListener('DOMContentLoaded', function () {
    const playButtons = document.querySelectorAll('.play-menu-button');
    const playerCardsContainer = document.getElementById("player-cards");
    const playerCountSelect = document.getElementById("player-count");
    const tournamentButton = playButtons[2];

    let playerCount = parseInt(localStorage.getItem('playerCount')) || 4;
    playerCountSelect.value = playerCount;
    tournamentStartUpHelper();

    tournamentButton.addEventListener('click', function (event) {
        event.preventDefault();
        resetTournament();
        window.location.href = TOURNAMENT_HREF;
        // Set default player count to 4
        playerCount = parseInt(playerCountSelect.value);
        localStorage.setItem('playerCount', playerCount);
        tournamentStartUpHelper();
    });

    playerCountSelect.addEventListener("change", function () {
        playerCount = parseInt(playerCountSelect.value);
        localStorage.setItem('playerCount', playerCount);
        tournamentStartUpHelper();
    });

    // playerCardsContainer.addEventListener("click", function (event) {
    //     if (event.target.classList.contains("change-name-btn")) {
    //         const playerNameInput = event.target.parentNode.querySelector("input");
    //         const confirmButton = event.target.parentNode.querySelector(".confirm-name-change-btn");
    //         playerNameInput.removeAttribute("readonly");
    //         playerNameInput.focus();
    //         event.target.style.display = "none";
    //         confirmButton.style.display = "block";
    //     }
    // });

    playerCardsContainer.addEventListener("click", function (event) {
        const target = event.target;
        const playerCard = target.closest(".player-card");
        const nameInput = playerCard.querySelector(".player-name-input");
        const checkbox = playerCard.querySelector(".is-ai");
        const changeButton = playerCard.querySelector(".change-name-btn");
        const confirmButton = playerCard.querySelector(".confirm-name-change-btn");
        
        if (target.matches(".change-name-btn")) {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
            nameInput.removeAttribute("readonly");
            nameInput.focus();
            changeButton.style.display = "none";
            confirmButton.style.display = "block";
        } else if (target.matches(".confirm-name-change-btn")) {
            const playerInputs = playerCardsContainer.querySelectorAll("input.player-name-input");
            let playerNames = Array.from(playerInputs).map(input => input.value);
            let playerNamesTemp = Array.from(playerInputs)
                .map(input => input.value.replace(/\s/g, "").toLowerCase());
            if (new Set(playerNamesTemp).size !== playerNamesTemp.length) {
                showErrorMessage(playerCard, "Player names must be unique!");
                return;
            } else if (nameInput.value === "") {
                showErrorMessage(playerCard, "Player names cannot be empty!");
                return;
            } else if ((checkbox && !checkbox.checked && checkAIName(nameInput.value)
                || !checkbox && checkAIName(nameInput.value))) {
                showErrorMessage(playerCard, "Player names cannot be the same as AI!");
                return;
            }
            nameInput.setAttribute("readonly", "");
            confirmButton.style.display = "none";
            changeButton.style.display = "block";
            localStorage.setItem('playerNames', JSON.stringify(playerNames));
            createFirstRoundMatches(playerNames);
        }
    });

    // playerCardsContainer.addEventListener("blur", function (event) {
    //     if (event.target.tagName === "INPUT" && event.target.classList.contains("player-name-input")) {
    //         const changeButton = event.target.parentNode.querySelector(".change-name-btn");
    //         const confirmButton = event.target.parentNode.querySelector(".confirm-name-change-btn");
    //         const playerInputs = playerCardsContainer.querySelectorAll("input.player-name-input");
    //         let playerNames = Array.from(playerInputs).map(input => input.value);
    //         let playerNamesTemp = playerNames.map(name => name.replace(/\s/g, "").toLowerCase());
    //         let checkbox = event.target.parentElement.querySelector('input[type="checkbox"]');
    //         if (new Set(playerNamesTemp).size !== playerNamesTemp.length) {
    //             showErrorMessage(event.target, "Player names must be unique!");
    //             return;
    //         } else if (playerNamesTemp.includes("")) {
    //             showErrorMessage(event.target, "Player names cannot be empty!");
    //             return;
    //         } else if (checkbox && !checkbox.checked && checkAIName(event.target.value)) {
    //             checkbox.checked = true;
    //             showErrorMessage(event.target, "Player names cannot be same as AI!");
    //             return;
    //         }
    //         event.target.setAttribute("readonly", "");
    //         confirmButton.style.display = "none";
    //         changeButton.style.display = "block";
    //         localStorage.setItem('playerNames', JSON.stringify(playerNames));
    //         createFirstRoundMatches(playerNames);
    //     }
    // }, true);

    // playerCardsContainer.addEventListener("change", function (event) {
    //     if (!event.target.classList.contains("is-ai"))
    //         return;
    //     let playerCard = event.target.parentElement.parentElement;
    //     playerCard.querySelector(".change-name-btn").style.display = "none";
    //     playerCard.querySelector(".confirm-name-change-btn").style.display = "block";
    //     if (event.target && !event.target.checked) {
    //         playerCard.querySelector(".player-name-input").value = "";
    //     }
    // });

    const startTournamentButton = document.getElementById("start-tournament");
    startTournamentButton.addEventListener("click", function (event) {
        let confirmButtons = document.querySelectorAll(".player-card .confirm-name-change-btn");
        for (let button of confirmButtons) {
            if (window.getComputedStyle(button).display !== "none") {
                event.preventDefault();
                return;
            }
        }
        event.preventDefault();
        document.getElementById("next-match").style.display = "block";
        window.location.href = TOURNAMENT_BRACKET_HREF;
        bracketMaker();
    });

    // Creates player cards for the selected number of players
    // Updates player names if necessary
    // Creates the first round matches
    function tournamentStartUpHelper() {
        matchInfo = {};
        results = [];
        generatePlayerCards(playerCount);
        const playerInputs = playerCardsContainer.querySelectorAll("input.player-name-input");
        let playerNames = Array.from(playerInputs).map(input => input.value);
        localStorage.setItem('playerNames', JSON.stringify(playerNames));
        rounds = Math.log2(playerCount);
        createFirstRoundMatches(playerNames);
    }

    function generatePlayerCards(playerCount) {
        const savedPlayerNames = JSON.parse(localStorage.getItem('playerNames')) || [];
        playerCardsContainer.innerHTML = "";
        for (let i = 1; i <= playerCount; i++) {
            const playerName = savedPlayerNames[i - 1] || (i === 1 ? document.getElementById("username-sidebar").textContent : `AI ${i - 1}`);
            const card = document.createElement("div");
            card.classList.add("player-card");
            card.innerHTML = `
          <input type="text" class="player-name-input" value="${playerName}" readonly>
          ${i !== 1 ? `
          <div class="player-type">
            <input class="is-ai" type="checkbox" name="is-ai-check" value="is-ai" readonly checked>
            <label for="is-ai">&nbsp;AI?</label>
          </div>` : ''}
          <div class="player-name-error" style="color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; padding: .75rem 1.25rem; margin-bottom: 1rem; border: 1px solid transparent; border-radius: .25rem; text-align:center; display: none;">
            <p>Player name error</p>
          </div>
          <button class="change-name-btn">Change Name</button>
          <button class="confirm-name-change-btn" style="display: none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
              <path d="M13.97 4.97a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.344 9.406a.75.75 0 0 1 1.06-1.06L6 10.939l6.563-6.563a.75.75 0 0 1 1.06 0z"/>
            </svg>
          </button>
        `;
            playerCardsContainer.appendChild(card);
        }
    }

    function showErrorMessage(card, message) {
        let inputName = card.querySelector(".player-name-input");
        let errorMessage = card.querySelector(".player-name-error");
        let confirmButton = card.querySelector(".confirm-name-change-btn");
        let changeButton = card.querySelector(".change-name-btn");
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 2000);
        inputName.value = inputName.defaultValue;
        if (checkAIName(inputName.value)) {
            card.querySelector(".is-ai").checked = true;
        }
        inputName.focus();
        inputName.setAttribute("readonly", "");
        confirmButton.style.display = "none";
        changeButton.style.display = "block";
    }

    // function showErrorMessage(input, message) {
    //     console.log("Error input", input);
    //     console.log("Error message", message);
    //     const errorMessage = input.parentNode.querySelector(".player-name-error");
    //     errorMessage.textContent = message;
    //     errorMessage.style.display = "block";
    //     setTimeout(() => {
    //         errorMessage.style.display = "none";
    //     }, 2000);
    //     input.value = input.defaultValue;
    //     input.focus();
    //     input.setAttribute("readonly", "");
    //     const confirmButton = input.parentNode.querySelector(".confirm-name-change-btn");
    //     const changeButton = input.parentNode.querySelector(".change-name-btn");
    //     confirmButton.style.display = "none";
    //     changeButton.style.display = "block";
    // }

    function resetTournament() {
        localStorage.removeItem('playerNames');
        localStorage.removeItem('playerCards');
        localStorage.removeItem('playerCount');
        playerCountSelect.value = 4;
        generatePlayerCards(4);
    }

});

function createFirstRoundMatches(playerNames) {
    // Create a copy of the playerNames array
    let shuffledPlayers = [...playerNames];
    // Fisher-Yates shuffle algorithm
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
    }
    // Split into pairs
    matches = [];
    for (let i = 0; i < shuffledPlayers.length; i += 2)
        matches.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
}

function prepareNextStage() {
    // Need to choose position of index based on number of current matches
    // Otherwise the next stage matches will contain wrong information
    // For the creation of the next stage matches to work properly,
    // the index must be set to the number of previous matches (0 when starting)
    let i = 0;
    let prev;
    switch (matches.length) {
        // 4 players, 3 games, 2 stages
        case 2: {
            i = 0;
            break;
        }
        case 3: {
            i = 2;
            break;
        }
        // 8 players, 7 games, 3 stages
        case 4: {
            i = 0;
            break;
        }
        case 6: {
            i = 4;
            break;
        }
        case 7: {
            i = 6;
            break;
        }
        // 16 players, 15 games, 4 stages
        case 8: {
            i = 0;
            break;
        }
        case 12: {
            i = 8;
            break;
        }
        case 14: {
            i = 12;
            break;
        }
        case 15:
            i = 14;
    }
    prev = matches.length;
    for (; i < results.length - 1; i += 2) {
        let newP1 = results[i]["P1 Score"] > results[i]["P2 Score"] ? results[i]["Player 1"] : results[i]["Player 2"];
        let newP2 = results[i + 1]["P1 Score"] > results[i + 1]["P2 Score"] ? results[i + 1]["Player 1"] : results[i + 1]["Player 2"];
        matches.push([newP1, newP2]);
    }
    bracketUpdater(prev);
}

function updateMatchInfo(p1, p2, p1Score, p2Score, stage) {
    matchInfo = {
        "Stage": stage,
        "Player 1": p1,
        "P1 Score": p1Score,
        "Player 2": p2,
        "P2 Score": p2Score
    }
    results.push(matchInfo);
}

function randomizeMatch(names, stage, p1Score, p2Score) {
    return new Promise((resolve, reject) => {
        let winner = Math.floor(Math.random() * 2);
        p1Score = winner === 0 ? 10 : Math.floor(Math.random() * 10);
        p2Score = winner === 1 ? 10 : Math.floor(Math.random() * 10);
        updateMatchInfo(names[0], names[1], p1Score, p2Score, stage);
        resolve();
    });
}

// END

// document.addEventListener('DOMContentLoaded', function () {
//     const playButtons = document.querySelectorAll('.play-menu-button');
//     const tournamentButton = playButtons[2];
//     const playerCountSelect = document.getElementById("player-count");
//     const startTournamentButton = document.getElementById("start-tournament");

//     let playerCount = parseInt(localStorage.getItem('playerCount')) || 4;
//     playerCountSelect.value = playerCount;
//     tournamentStartUpHelper();

//     tournamentButton.addEventListener('click', function (event) {
//         event.preventDefault();
//         window.location.href = TOURNAMENT_HREF;
//         // Set default player count to 4
//         playerCount = 4;
//         playerCountSelect.value = playerCount;
//         tournamentStartUpHelper();
//     });

//     playerCountSelect.addEventListener("change", function () {
//         playerCount = parseInt(playerCountSelect.value);
//         tournamentStartUpHelper();
//     });

//     // Creates player cards for the selected number of players
//     // Updates player names if necessary
//     // Creates the first round matches
//     function tournamentStartUpHelper() {
//         generatePlayerCards(playerCount);
//         const playerInputs = playerCardsContainer.querySelectorAll("input");
//         playerNames = [];
//         results = [];
//         matchInfo = {};
//         rounds = Math.log2(playerCount);
//         playerInputs.forEach(function (input) {
//             playerNames.push(input.value);
//         });
//         createFirstRoundMatches(playerNames);
//     }

//     playerCardsContainer.addEventListener("click", function (event) {
//         if (event.target.classList.contains("change-name-btn")) {
//             const playerNameInput = event.target.parentNode.querySelector("input");
//             const confirmButton = event.target.parentNode.querySelector(".confirm-name-change-btn");
//             playerNameInput.removeAttribute("readonly");
//             playerNameInput.focus();
//             event.target.style.display = "none";
//             confirmButton.style.display = "block";
//         }
//         /*         if (event.target.classList.contains("confirm-name-change-btn")) {
//                     const playerNameInput = event.target.parentNode.querySelector("input");
//                     playerNameInput.setAttribute("readonly", "");
//                     const changeButton = event.target.parentNode.querySelector(".change-name-btn");
//                     event.target.style.display = "none";
//                     changeButton.style.display = "block";
//                 } */
//     });

//     playerCardsContainer.addEventListener("blur", function (event) {
//         const changeButton = event.target.parentNode.querySelector(".change-name-btn");
//         const confirmButton = event.target.parentNode.querySelector(".confirm-name-change-btn");
//         if (event.target.tagName === "INPUT") {
//             // check if the input is unique
//             const playerInputs = playerCardsContainer.querySelectorAll("input");
//             const playerNames = [];
//             // plyaerNamesTemp is equal to playerNames but all whitespaces are removed and convert to lowercase
//             const playerNamesTemp = [];
//             playerInputs.forEach(function (input) {
//                 playerNames.push(input.value);
//                 playerNamesTemp.push(input.value.replace(/\s/g, "").toLowerCase());
//             });
//             if (new Set(playerNamesTemp).size !== playerNamesTemp.length) {
//                 //alert("Player names must be unique!");
//                 const playerNamesError = event.target.parentNode.querySelector(".player-name-error");
//                 playerNamesError.style.display = "block";
//                 setTimeout(() => {
//                     playerNamesError.style.display = "none";
//                 }, 2000);
//                 event.target.value = event.target.defaultValue;
//                 event.target.focus();
//                 event.target.setAttribute("readonly", "");
//                 confirmButton.style.display = "none";
//                 changeButton.style.display = "block";
//                 return;
//             }
//             else if (playerNamesTemp.includes("")) {
//                 //alert("Player names cannot be empty!");
//                 const playerNamesError = event.target.parentNode.querySelector("#player-name-empty-" + (playerNamesTemp.indexOf("") + 1));
//                 playerNamesError.style.display = "block";
//                 setTimeout(() => {
//                     playerNamesError.style.display = "none";
//                 }, 2000);
//                 event.target.value = event.target.defaultValue;
//                 event.target.focus();
//                 event.target.setAttribute("readonly", "");
//                 confirmButton.style.display = "none";
//                 changeButton.style.display = "block";
//                 return;
//             }
//             event.target.setAttribute("readonly", "");
//             confirmButton.style.display = "none";
//             changeButton.style.display = "block";
//             createFirstRoundMatches(playerNames);
//         }
//     }, true);

//     const startTournamentButton = document.getElementById("start-tournament");
//     startTournamentButton.addEventListener("click", function (event) {
//         event.preventDefault();
//         window.location.href = TOURNAMENT_BRACKET_HREF;
//         bracketMaker();
//         // document.getElementById("tournament-options").style.display = "none";
//         // document.getElementById("bracket").style.display = "block";
//     });
// });

// function generatePlayerCards(playerCount) {
//     const playerCardsContainer = document.getElementById("player-cards");
//     playerCardsContainer.innerHTML = "";
//     for (let i = 1; i <= playerCount; i++) {
//         const playerName = (i === 1) ? "P1" : `AI ${i - 1}`;
//         const card = document.createElement("div");
//         card.classList.add("player-card");
//         card.innerHTML = `
//                 <input type="text" value="${playerName}" readonly>
// 				<div class="player-name-error" id="player-name-error-${i}" style="color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; padding: .75rem 1.25rem; margin-bottom: 1rem; border: 1px solid transparent; border-radius: .25rem; text-align:center; display: none;">
// 				<p>Player name must be unique</p>
// 				</div>
// 				<div class="player-name-error" id="player-name-empty-${i}" style="color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; padding: .75rem 1.25rem; margin-bottom: 1rem; border: 1px solid transparent; border-radius: .25rem; text-align:center; display: none;">
// 				<p>Player names cannot be empty</p>
// 				</div>
//                 <button class="change-name-btn">Change Name</button>
//                 <button class="confirm-name-change-btn" style="display: none;">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
//                         <path d="M13.97 4.97a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.344 9.406a.75.75 0 0 1 1.06-1.06L6 10.939l6.563-6.563a.75.75 0 0 1 1.06 0z"/>
//                     </svg>
//                 </button>
//             `;
//         playerCardsContainer.appendChild(card);
//     }
// }

// function createFirstRoundMatches(playerNames) {
//     // Create a copy of the playerNames array
//     let shuffledPlayers = [...playerNames];
//     // Fisher-Yates shuffle algorithm
//     for (let i = shuffledPlayers.length - 1; i > 0; i--) {
//         let j = Math.floor(Math.random() * (i + 1));
//         [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
//     }
//     // Split into pairs
//     matches = [];
//     for (let i = 0; i < shuffledPlayers.length; i += 2)
//         matches.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
// }

// function prepareNextStage() {
//     // Need to choose position of index based on number of current matches
//     // Otherwise the next stage matches will contain wrong information
//     // For the creation of the next stage matches to work properly,
//     // the index must be set to the number of previous matches (0 when starting)
//     let i = 0;
//     let prev;
//     switch (matches.length) {
//         // 4 players, 3 games, 2 stages
//         case 2: {
//             i = 0;
//             break;
//         }
//         case 3: {
//             i = 2;
//             break;
//         }
//         // 8 players, 7 games, 3 stages
//         case 4: {
//             i = 0;
//             break;
//         }
//         case 6: {
//             i = 4;
//             break;
//         }
//         case 7: {
//             i = 6;
//             break;
//         }
//         // 16 players, 15 games, 4 stages
//         case 8: {
//             i = 0;
//             break;
//         }
//         case 12: {
//             i = 8;
//             break;
//         }
//         case 14: {
//             i = 12;
//             break;
//         }
//         case 15:
//             i = 14;
//     }
//     prev = matches.length;
//     for (; i < results.length - 1; i += 2) {
//         let newP1 = results[i]["P1 Score"] > results[i]["P2 Score"] ? results[i]["Player 1"] : results[i]["Player 2"];
//         let newP2 = results[i + 1]["P1 Score"] > results[i + 1]["P2 Score"] ? results[i + 1]["Player 1"] : results[i + 1]["Player 2"];
//         matches.push([newP1, newP2]);
//     }
//     bracketUpdater(prev);
// }

// function updateMatchInfo(p1, p2, p1Score, p2Score, stage) {
//     matchInfo = {
//         "Stage": stage,
//         "Player 1": p1,
//         "P1 Score": p1Score,
//         "Player 2": p2,
//         "P2 Score": p2Score
//     }
//     results.push(matchInfo);
// }

// function randomizeMatch(names, stage, p1Score, p2Score) {
//     return new Promise((resolve, reject) => {
//         let winner = Math.floor(Math.random() * 2);
//         p1Score = winner === 0 ? 10 : Math.floor(Math.random() * 10);
//         p2Score = winner === 1 ? 10 : Math.floor(Math.random() * 10);
//         updateMatchInfo(names[0], names[1], p1Score, p2Score, stage);
//         resolve();
//     });
// }
