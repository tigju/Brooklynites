import bot from './assets/bot.svg'
import education from './assets/education.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.'

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = ''
        }
    }, 300);
}


function replaceURLs(message) {
    if (!message) return;

    let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.replace(urlRegex, function (url) {
        let hyperlink = url;
        if (!hyperlink.match('^https?:\/\/')) {
            hyperlink = 'http://' + hyperlink;
        }
        return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
    });
}

function typeText(element, text) {
    let index = 0
    let formattedText = replaceURLs(text)
    let typed = new Typed(element, {
        strings: [formattedText],
        typeSpeed: 20,
        loop: false,
        showCursor: false
    })
    // let interval = setInterval(() => {
    //     if (index < formattedText.length) {
    //         // element.innerHTML += formattedText.charAt(index)
    //         element.innerHTML += formattedText.charAt(index)
    //         index++
    //     } else {
    //        clearInterval(interval)
        // }
    // }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

// this function to separate messages from chat bot and user     <div class="wrapper ${isAi && 'ai'}">
{/* <div class="profile">
    <img
        src=${isAi ? bot : user}
        alt="${isAi ? 'bot' : 'user'}"
    />
</div> */}
function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper">
        
            <div class="chat">

                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    //chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()
    chatContainer.innerHTML = ''

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)
    
    // fetch data from server -> bot's response

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    // messageDiv.innerHTML = ''

    if (response.ok) {
        const data = await response.json()
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 
        console.log(parsedData)
        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})
form.addEventListener('change', (e) => {
    
        handleSubmit(e)
})