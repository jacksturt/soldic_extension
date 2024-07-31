// give slight timeout to make sure the elements are loaded
// import { processParagraphs, createAnnotatedEntry } from "./helpers";
(async () => {
    const tweetHeadersClassname = "css-175oi2r r-k4xj1c r-18u37iz r-1wtj0ep";
    const tweetSpanClassname = "css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3"
    const src = chrome.runtime.getURL("./helpers.js");
    const { createAnnotatedEntry, processTweet} = await import(src);

    addButtonWhenReady();
    document.addEventListener("scroll", () => {
        addButtonWhenReady();
    });
    function addButtonWhenReady() {
        const intervalId = setInterval(() => {
            const topBarElement = document.getElementsByClassName(tweetHeadersClassname)

            if (topBarElement?.length > 0) {
                clearInterval(intervalId);
                for (let i = 0; i < topBarElement.length; i++) {
                    if(topBarElement[i].childNodes.length === 3) {
                        continue;
                    }
                    const tweetHeader = topBarElement[i];
                    const button = document.createElement("button");
                button.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                button.style.color = "white";
                button.style.padding = "5px 10px";
                button.style.border = "black";
                button.style.borderRadius = "5px";
                button.style.cursor = "pointer";
                button.textContent = "Annotate";
                button.id = "annotate-button";
                const tweet = tweetHeader.parentElement.parentElement;
                tweet.style.position = "relative";
                const tweetContent = tweet.childNodes[1].childNodes[0];
                button.onclick = async () => {
                    for (let i = 0; i < tweetContent.childNodes.length; i++) {

                        if (tweetContent.childNodes[i].className === tweetSpanClassname) {
                            await processTweet(tweetContent.childNodes[i], (parsedSentences) => {
                                const newTweetContent = document.createElement("div");
                                newTweetContent.className = tweetContent.className.replace("r-1udh08x ", "");

                                newTweetContent.style.display = "inline-block";
                                newTweetContent.style.position = "relative";
                                const parsedSentence = parsedSentences[0].sentence;
                                for (let j = 0; j < parsedSentence.length; j++) {
                                    const entry = parsedSentence[j];
                                    if ("word" in entry) {
                                        const textSpan = document.createElement("span");
                                        textSpan.textContent =  j == 0 ? entry.word + " ": (" " + entry.word + " ");
                                        textSpan.style.display = "inline";
                                        textSpan.style.color = "white";
                                        textSpan.className = "css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3"
                                        newTweetContent.appendChild(textSpan);
                                    } else {
                                        const annotatedEntry = createAnnotatedEntry(entry);
                                        newTweetContent.appendChild(annotatedEntry);
                                    }
                                };
                                tweetContent.childNodes[i].replaceWith(newTweetContent);
                            });
                        }
                    }
                    button.textContent = "Annotated";

                };
                tweetHeader.append(button);
            }}
        }, 100); // Check every 100 milliseconds
    }


    // contentMain.testImport();
  })();

// Call the function to add the button when the element is ready

