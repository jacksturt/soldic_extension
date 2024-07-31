// give slight timeout to make sure the elements are loaded
// import { processParagraphs, createAnnotatedEntry } from "./helpers";
(async () => {
    const src = chrome.runtime.getURL("./helpers.js");
    const {createAnnotatedEntry, processParagraphs} = await import(src);
    addButtonWhenReady();
    function addButtonWhenReady() {
        const intervalId = setInterval(() => {
            const topBarElement = document.getElementsByClassName("speechify-ignore")[1]?.childNodes[1]?.childNodes[1];

            if (topBarElement) {
                clearInterval(intervalId);

                const button = document.createElement("button");
                button.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                button.style.color = "white";
                button.style.padding = "5px 10px";
                button.style.border = "black";
                button.style.borderRadius = "5px";
                button.style.cursor = "pointer";
                button.textContent = "Annotate";
                button.onclick = async () => {
                    await processParagraphs("pw-post-body-paragraph", (parsedSentences) => {
                        parsedSentences.forEach((parsedSentenceAndEntry, index) => {
                            console.log(parsedSentenceAndEntry)
                            const paragraphElement = document.getElementById(parsedSentenceAndEntry.elementId);
                            const parsedSentence = parsedSentenceAndEntry.sentence;
                            paragraphElement.innerHTML = "";
                            paragraphElement.style.display = "inline-block";
                            paragraphElement.style.position = "relative";
                            console.log(parsedSentence)
                            for (let i = 0; i < parsedSentence.length; i++) {
                                const entry = parsedSentence[i];
                                if ("word" in entry) {
                                    const textDiv = document.createElement("div");
                                    textDiv.textContent =  i == 0 ? entry.word + " ": (" " + entry.word + " ");

                                    textDiv.style.display = "inline";
                                    paragraphElement.appendChild(textDiv);
                                } else {
                                    const annotatedEntry = createAnnotatedEntry(entry);
                                    paragraphElement.appendChild(annotatedEntry);
                                }
                            };

                        })
                    });
                };
                topBarElement.prepend(button);
            }
        }, 100); // Check every 100 milliseconds
    }

    // contentMain.testImport();
  })();

// Call the function to add the button when the element is ready

