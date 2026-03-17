document.addEventListener('DOMContentLoaded', function() {
    const imgs = document.querySelectorAll('.header-slider ul img');
    const prev_btn = document.querySelector('.control-prev'); 
    const next_btn = document.querySelector('.control-next'); 

    let n = 0;

    function changeSlide() {
        
        imgs.forEach(img => {
            img.style.display = 'none';
        });
        
     
        if (imgs[n]) {
            imgs[n].style.display = 'block';
        }
    }

    
    changeSlide();

    
    prev_btn.addEventListener('click', (e) => {
        e.preventDefault();
        n = (n > 0) ? n - 1 : imgs.length - 1;
        changeSlide();
    });

    next_btn.addEventListener('click', (e) => {
        e.preventDefault();
        n = (n < imgs.length - 1) ? n + 1 : 0;
        changeSlide();
    });
});

const scrollContainer = document.querySelectorAll('.products');
for (const item of scrollContainer) {
    item.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        item.scrollLeft += evt.deltaY;
    });
}

