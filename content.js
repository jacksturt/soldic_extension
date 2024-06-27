// give slight timeout to make sure the elements are loaded

// const getURLfromSentence = (sentence) => `https://soldic.xyz/api/trpc/sentenceParser.parse?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22sentence%22%3A%22${sentence.replace(/ /g, "%20")}%22%7D%7D%7D`
const getURLfromSentence = (sentence) => `https://soldic.xyz/api/extension/sentenceParser`
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
                await processParagraphs("pw-post-body-paragraph");
            };
            topBarElement.prepend(button);
        }
    }, 100); // Check every 100 milliseconds
}

// Call the function to add the button when the element is ready
addButtonWhenReady();

async function processParagraphs(paragraphClassName) {
    const paragraphElements = document.getElementsByClassName(paragraphClassName);
    const mappedParagraphs = [];
    let index = 0;

    Array.from(paragraphElements).forEach(async (paragraphElement) => {
        paragraphElement.id = `paragraph-${index}`;
        mappedParagraphs.push({
            elementId: `paragraph-${index}`,
            sentence: paragraphElement.textContent,
        });
        index++;


    });
    try {
        console.log(mappedParagraphs)
        const response = await fetch(`https://testnextjscors.vercel.app/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sentences: mappedParagraphs }),
        });

        const data = await response.json();
        const { data: { parsedSentences } } = data;
        console.log(parsedSentences);


        parsedSentences.forEach((parsedSentenceAndEntry, index) => {
            const paragraphElement = document.getElementById(parsedSentenceAndEntry.elementId);
            const parsedSentence = parsedSentenceAndEntry.sentence;
            paragraphElement.innerHTML = "";
            paragraphElement.style.display = "inline-block";
            paragraphElement.style.position = "relative";
            console.log(parsedSentence)
            for (let i = 0; i < parsedSentence.length; i++) {
                const entry = parsedSentence[i];
                if (typeof entry === "string") {
                    const textDiv = document.createElement("div");
                    textDiv.textContent =  " " + entry + " ";
                    textDiv.style.display = "inline";
                    paragraphElement.appendChild(textDiv);
                } else {
                    const annotatedEntry = createAnnotatedEntry(entry);
                    paragraphElement.appendChild(annotatedEntry);
                }
            };

        })

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call the async function to process paragraphs


// fetch(`https://testnextjscors.vercel.app/api/users`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//         sentence: firstParagraphContent
//     }),
//   }).then(response => {
//     return response.json();
//   }).then(data => {
//     const {data: {parsedSentence}} = data;

// paragraphElements[0].innerHTML = "";
//     console.log(parsedSentence);
//     parsedSentence.forEach((entry, index) => {
//         if (typeof entry === "string") {
//         const textDiv = document.createElement("div");
//         textDiv.textContent = (index === 0 ?"": " ")+ entry + " ";
//         textDiv.style.display = "inline";
//         paragraphElements[0].appendChild(textDiv);
//         } else {
//             const annotatedEntry = createAnnotatedEntry(entry);
//             paragraphElements[0].appendChild(annotatedEntry);
//         }
//     });
//   });

// fetch(getURLfromSentence(firstParagraphContent)).then(response => {
//     return response.json();
// }).then(parsedSentence => {
//     console.log(parsedSentence);
//     // Append new elements based on the parsedSentence array

// });



function createAnnotatedEntry(entry) {
    const annotatedEntry = document.createElement("div");
    annotatedEntry.className = "hover:bg-gray-100";
    annotatedEntry.style.display = "inline";
    annotatedEntry.style.cursor = "pointer";
    annotatedEntry.style.textDecoration = "underline";
    annotatedEntry.style.color = "blue";
    annotatedEntry.style.backgroundColor = "rgba(0, 0, 0, 0)";
    annotatedEntry.textContent = entry.type === "acronym" ? entry.entry.acronym : entry.term;

    // Tooltip for definition
    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.left = "0";
    tooltip.style.top = "60px";
    tooltip.style.color = "black";
    tooltip.style.backgroundColor = "rgba(255, 255, 255)";
    tooltip.style.border = "1px solid black";
    tooltip.style.borderRadius = "5px";
    tooltip.style.padding = "5px 10px";
    tooltip.textContent = entry.term + ": " + entry.entry.definition;
    tooltip.style.display = "none";
    annotatedEntry.appendChild(tooltip);

    // Show tooltip on hover
    annotatedEntry.addEventListener("mouseenter", () => {
        tooltip.style.display = "block";
        annotatedEntry.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    });

    // Hide tooltip on mouse leave
    annotatedEntry.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
        annotatedEntry.style.backgroundColor = "rgba(0, 0, 0, 0)";
    });


    return annotatedEntry;
}