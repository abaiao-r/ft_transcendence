const faqItems = document.querySelectorAll('.faq-item');
const faqQuestion = document.querySelectorAll('.faq-question');

faqQuestion.forEach(function(item) {
    item.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});

