// Add listener to 1vs1 local button
// document.addEventListener('DOMContentLoaded', function() {
//     const oneVsOneLocalButton = document.querySelector('.play-menu-button');
//     const oneVsOneLocalSection = document.querySelector('1-vs-1-local'); // if 1-vs-1-local is an id

//     oneVsOneLocalButton.addEventListener('click', function(event) {
//         event.preventDefault();
//         window.location.href = ONE_VS_ONE_LOCAL_HREF;
//     });
// });

document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-menu-button');
    const button1v1Local = playButtons[0];
    // const button1v1AI = playButtons[1];
    // const button1v1Online = playButtons[2];
    // const buttonDouble = playButtons[3];
    // const buttonTournament = playButtons[4];

    button1v1Local.addEventListener('click', function(event) {
        hidePlayMenu();
        event.preventDefault();
        window.location.href = ONE_VS_ONE_LOCAL_HREF;
        console.log("HREF CHANGED TO NEW PLAY BUTTON");
    });
    // PLACEHOLDER!!!
    // NEED TO CHOOSE THE RIGHT HREF
    // button1v1AI.addEventListener('click', function(event) {
    //     event.preventDefault();
    //     window.location.href = ONE_VS_ONE_AI_HREF;
    // });
    // button1v1Online.addEventListener('click', function(event) {
    //     event.preventDefault();
    //     window.location.href = ONE_VS_ONE_ONLINE_HREF;
    // });
    // buttonDouble.addEventListener('click', function(event) {
    //     event.preventDefault();
    //     window.location.href = DOUBLE_HREF;
    // });
    // buttonTournament.addEventListener('click', function(event) {
    //     event.preventDefault();
    //     window.location.href = TOURNAMENT_HREF;
    // });
});
