// API configuration
const API_Key = "AIzaSyD1ISex0u4EuOZIhE75o2_VxawZK_DTxL8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_Key}`;



const showTypingEffect = (text, textElement) => {
    const words = text.split(" ");
    let currentWordIndex =0;

    const typingInterval = setInterval(() => {
        textElement.innerText +=(currentWordIndex === 0 ? "" : " ") + words[currentWordIndex++]
        if(currentWordIndex === words.length){
            clearInterval(typingInterval)
        }

        window.scrollTo(0, chatList.scrollHeight)
   },75);
}

const typingForm = document.querySelector(".typing-form");

const chatList = document.querySelector(".chat-list");

const generateAPIResponse = async (div) => {
    const textElement = div.querySelector(".text");
    try {
        const response = await fetch(API_URL , {
            method :"POST",
            headers: {"content-Type" : "application/json"},
            body:JSON.stringify({
                contents:[{
                    role: "user",
                    parts:[{text : userMessage}]
                }]
                
             })
            
        })

        const data = await response.json()
        const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,'$1');

        console.log(apiResponse);

        showTypingEffect(apiResponse, textElement);
        

    } catch(error){
        console.error(error)
    }  
    finally{
        div.classList.remove("loading")
    }
}

const copyMessage = (copyBtn) => {
    const messageText = copyBtn.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText);
    copyBtn.innerText = "done";

    setTimeout(() => copyBtn.innerText = "content_copy", 1000)
}



const showLoading = () =>{
const html = `
                <div class="message-content">
                    <img src="img/rosechat3.png" alt="">
                    <p class="text"></p>
                    <div class="loading-indicator">
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                    </div>
                </div>
                <span onClick ="copyMessage(this)" class="material-symbols-outlined">
                    content_copy
                    </span>
             `

 const div = document.createElement("div");
div.classList.add("message", "incoming", "loading");

div.innerHTML = html;

chatList.appendChild(div);

window.scrollTo(0, chatList.scrollHeight)

generateAPIResponse(div)


}

const handleOutGoingChat = () => {
    userMessage = document.querySelector(".typing-input").value;
    console.log(userMessage);

    if(!userMessage) return
    const html = `<div class="message-content">
                    <img src="img/user.png" alt="">
                    <p class="text"></p>
                </div>`

    const div = document.createElement("div");
    div.classList.add("message", "outgoing");

    div.innerHTML = html;

    div.querySelector(".text").innerHTML = userMessage;

    chatList.appendChild(div);

    typingForm.reset();

    window.scrollTo(0, chatList.scrollHeight) 

    setTimeout(showLoading, 500)
}

typingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOutGoingChat();
}
)

