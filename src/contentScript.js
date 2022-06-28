
// const src = chrome.runtime.getURL("/en_es.js");
// const en_es = await import(src);

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
`Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
{
    type: 'GREETINGS',
    payload: {
    message: 'Hello, my name is Con. I am from ContentScript.',
    },
},
response => {
    console.log(response.message);
}
);

const send = (type, payload, callback) => {
    chrome.runtime.sendMessage({ type, payload }, callback);
}

const handlers = {
    COUNT: (request, sender, sendResponse) => {
        console.log(`Current count is ${request.payload.count}`);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (handlers[request.type]) {
        handlers[request.type](request, sender, sendResponse)
    }
});


window.addEventListener('load', function () {
    let pageText = [...document.querySelectorAll('div, span, p, i, strong')].map(e => e.innerText).join(' ')
    let words = [ ...new Set(pageText.split(/\s/g).filter(s => s).map(s => s.toLowerCase().replaceAll(/[!\?\.,"'“”’]/g, '')))]
    let translatableWords = words.filter(word => document.en_es[word])

    console.log(translatableWords)

    for (let word of translatableWords) {
        document.body.innerHTML = document.body.innerHTML.replaceAll(
            new RegExp(`(>[^<]*\\s)${word}(\\s[^<]*<)`, `g`),
            (match, p1, p2) => {
                return `${p1}<lgfy translation="${word}">${document.en_es[word]}</lgfy>${p2}`
            }
        );
        
    }
    
    document.addEventListener('mouseover', e => {
        let elem = e.target
        let tooltip = document.querySelector('#lgfy-tooltip')
        if (elem.tagName === 'LGFY') {
            let elemBounds = elem.getBoundingClientRect()
            tooltip.innerText = elem.getAttribute('translation')
            tooltip.style.top = `${elemBounds.top + window.scrollY - 45}px`
            tooltip.style.left = `${(elemBounds.left + elemBounds.right) / 2 + window.scrollX - 75}px`
            tooltip.style.visibility = 'visible'
        } else {
            tooltip.style.visibility = 'hidden'
        }
    })

    let popup = document.createElement('div')
    popup.innerHTML = `
        <div id="lgfy-tooltip" class="lgfy-tooltip-container">
            TEST
        </div>
    `
    document.body.appendChild(popup.firstElementChild)
})


