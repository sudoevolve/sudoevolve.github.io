const sidebar =document.querySelector('.sidebar');
const fabars =document.querySelector('.fa-bars');

fabars.addEventListener('click',() => {
    sidebar.classList.toggle('active');
});






async function aiGenerate() {
    const prompt = document.getElementById('prompt').value;
    const response = await fetch('/generate-poem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    document.getElementById('result').textContent = data.data.content || 'Nothing was generated.';
}






document.addEventListener('DOMContentLoaded', function() {
    let menuItems = document.querySelectorAll('.list-item');
    let contents = document.querySelectorAll('.view');

    contents[0].classList.add('view-active');

    function changeView(activeIndex) {
        contents.forEach((content, index) => {
            if (index === activeIndex) {
                content.classList.add('view-active');
            } else {
                content.classList.remove('view-active');
                setTimeout(() => {
                    content.style.display = 'none';
                }, 300);
            }
        });
    }

    menuItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            contents.forEach(content => {
                content.style.display = 'block';
            });
            changeView(index);
        });
    });
});