const btn = document.getElementById('jokesBtn');
var text = document.querySelector('.jokeText'); 

btn.addEventListener('click',async function(){
    const data = await fetch('https://icanhazdadjoke.com/',{
        headers:{
            'Accept': 'application/json'
        }
    });
    const jokeObj = await data.json();
    text.innerHTML = jokeObj.joke;
})

