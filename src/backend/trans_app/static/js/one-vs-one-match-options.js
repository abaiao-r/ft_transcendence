document.addEventListener('DOMContentLoaded', function() {
    const oneVsOneLocalButton = document.querySelector('.play-menu-button');
    //const oneVsOneLocalSection = document.querySelector('#1-vs-1-local'); // if 1-vs-1-local is an id

    oneVsOneLocalButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = ONE_VS_ONE_MATCH_OPTIONS_HREF;
    });
});


