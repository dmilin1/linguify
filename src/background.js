
const handlers = {
    GREETINGS: (request, sender, sendResponse) => {
        const message = request.payload.message;
        console.log(message)
        sendResponse({ message: `Hi ${sender.tab ? 'Con' : 'Pop'}, my name is Bac. I am from Background. It's great to hear from you.` });
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (handlers[request.type]) {
        handlers[request.type](request, sender, sendResponse)
    }
});
