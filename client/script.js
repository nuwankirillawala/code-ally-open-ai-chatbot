//importing images-icons
import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

//Loarder ... button
let loadInterval;

function loarder(element){
    element.textContent = '';

    loadInterval = setInterval(()=>{
        element.textContent += '.';

        if(element.textContent === '....'){
            element.textContent = '';
        }
    }, 300)
}

//Type result-text character by characater

function typeText(element, text) {
    let index = 0;

    let interval = setInterval(()=> {
        if (index < text.length) {
            element.innerHTML += text.chartAt(index);
            index++;
        }else{
            clearInterval(interval);
        }
    }, 20)
}

//Generate iniquie ID for the message

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div className="profile">
                    <img
                        src="${isAi ? bot: user}"
                        alt="${isAi ? 'bot': 'user'}"
                    />
                </div>
                <div class="message" id="${uniqueId}">${value}</div>
            </div>
        </div>
        `
    )    
}

const handleSubmit = async(e)=>{
    e.preventDefault();

    const data = new FormData(form);

    //user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset();

    //bot's chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);
    loarder(messageDiv);
}

//handle submit event
form.addEventListener('submit', handleSubmit);

//handle submit event when press enter key
form.addEventListener('keyup', (e)=>{
    if(e.keyCode === 13){
        handleSubmit(e);
    }
})

