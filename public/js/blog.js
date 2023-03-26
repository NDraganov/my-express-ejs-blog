const readMore = document.querySelectorAll('#readMore');

for(let i = 0; i<readMore.length; i++) {
    readMore[i].addEventListener('click', () => {
        readMore[i].parentNode.classList.toggle('active');
    })
}
