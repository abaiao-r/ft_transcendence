document.addEventListener('DOMContentLoaded', function () 
{
    // Load initial content
    loadContent('History');

    // Add event listeners to navigation links
    document.querySelectorAll('nav ul li a').forEach(function (link) 
    {
        link.addEventListener('click', function (event)
        {
            event.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            loadContent(sectionId);
        });
    });
    
    // Add event listener to logo image to navigate to home
    document.getElementById('logo').addEventListener('click', function ()
    {
        loadContent('Home Page');
    });
    // Add event listener for button to change text
    document.getElementById('changeTextBtn').addEventListener('click', function () 
    {
        const paragraph = document.querySelector('#main-content p');
        if (paragraph)
        {
            paragraph.textContent = 'Text changed using JavaScript!';
        }
    });
});

function loadContent(sectionId)
{
    // Hide all sections
    document.querySelectorAll('section').forEach(function (section)
    {
        section.style.display = 'none';
    });

    // Show the selected section
    const section = document.getElementById(sectionId);
    if (section)
    {
        section.style.display = 'block';
    }
}


