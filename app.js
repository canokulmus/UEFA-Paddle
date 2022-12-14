
import teams from './teams.json' assert { type: 'json' };



let order = 0;
let userTeam = {};
let computerTeam = {};

//create html card elements for each team
teams.forEach(team => {
    let card = document.createElement('div');
    card.classList.add('card');

    let box = document.createElement('div');
    box.classList.add('box');
    box.classList.add('home');

    let content = document.createElement('div');
    content.classList.add('content');

    let logo = document.createElement('img');
    logo.src = `./teams/${team.img}`;

    let name = document.createElement('h3');
    name.textContent = team.name;

    let link = document.createElement('a');
    link.classList.add('chooseButton1');
    link.href = "#";
    link.textContent = "Choose Team";


    card.appendChild(box);
    box.appendChild(content);
    content.appendChild(logo);
    content.appendChild(name);
    content.appendChild(link);

    document.getElementById('teams-container').appendChild(card);


    link.addEventListener('click', () => {

        if (order === 0) {
            userTeam = team;
            document.getElementById('user-img').src = `./teams/${team.img}`;
            document.getElementById('user-selected').src = `./teams/${team.img}`;
            document.getElementById('user-club-name').textContent = team.name;
            document.getElementById('chooseHeader').textContent = "Choose your opponent:";
            order++;


            //changing the color of the card and 
            document.querySelectorAll('.chooseButton1').forEach(button => {
                button.classList.remove('chooseButton1');
                button.classList.add('chooseButton2');
            });

            document.querySelectorAll('.box.home').forEach(button => {
                button.classList.remove('home');
                button.classList.add('away');
            });


        } else {

            document.getElementById('chooseHeader').style.display = "none";

            computerTeam = team;
            document.getElementById('computer-img').src = `./teams/${team.img}`;
            document.getElementById('computer-selected').src = `./teams/${team.img}`;

            document.getElementById('computer-selected').style.height = "400px";
            document.getElementById('user-selected').style.height = "400px";

            document.getElementById('computer-club-name').textContent = team.name;
            document.getElementById('teams-container').style.display = "none";
            document.getElementById('pong-loader').style.display = "block";
            document.getElementById('loading-text').style.display = "block";

            setTimeout(() => {

                document.querySelector('.top').style.display = "none";
                document.getElementById('game').style.display = "flex";

                gameInterval();

            }, 3000);

        }
    })

});
