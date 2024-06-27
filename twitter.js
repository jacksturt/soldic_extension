// give slight timeout to make sure the elements are loaded
// import { processParagraphs, createAnnotatedEntry } from "./helpers";
(async () => {
    const tweetHeadersClassname = "css-175oi2r r-k4xj1c r-18u37iz r-1wtj0ep";
    const src = chrome.runtime.getURL("./helpers.js");
    const {testImport, createAnnotatedEntry, processTweet} = await import(src);
    console.log(testImport);
    testImport();
    addButtonWhenReady();
    function addButtonWhenReady() {
        const intervalId = setInterval(() => {
            const topBarElement = document.getElementsByClassName(tweetHeadersClassname)

            if (topBarElement?.length > 0) {
                clearInterval(intervalId);
                for (let i = 0; i < topBarElement.length; i++) {
                    const tweetHeader = topBarElement[i];
                    const button = document.createElement("button");
                button.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                button.style.color = "white";
                button.style.padding = "5px 10px";
                button.style.border = "black";
                button.style.borderRadius = "5px";
                button.style.cursor = "pointer";
                button.textContent = "Annotate";
                const tweet = tweetHeader.parentElement.parentElement;
                tweet.style.position = "relative";
                const tweetContent = tweet.childNodes[1].childNodes[0];
                button.onclick = async () => {
                    await processTweet(tweetContent, (parsedSentences) => {
                        const newTweetContent = document.createElement("div");
                        newTweetContent.className = tweetContent.className.replace("r-1udh08x ", "");

                        newTweetContent.style.display = "inline-block";
                        newTweetContent.style.position = "relative";
                        tweetContent.innerHTML = "";
                        const parsedSentence = parsedSentences[0].sentence;
                        for (let i = 0; i < parsedSentence.length; i++) {
                            const entry = parsedSentence[i];
                            if (typeof entry === "string") {
                                const textSpan = document.createElement("span");
                                textSpan.textContent =  " " + entry + " ";
                                textSpan.style.display = "inline";
                                textSpan.className = "css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3"
                                newTweetContent.appendChild(textSpan);
                            } else {
                                const annotatedEntry = createAnnotatedEntry(entry);
                                newTweetContent.appendChild(annotatedEntry);
                            }
                        };
                        tweet.childNodes[1].replaceWith(newTweetContent);
                    });
                };
                tweetHeader.append(button);
            }}
        }, 100); // Check every 100 milliseconds
    }

    // contentMain.testImport();
  })();

// Call the function to add the button when the element is ready

