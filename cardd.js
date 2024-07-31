(async () => {
    addButtonWhenReady();
    function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function createAnnotatedEntry(entry) {
        const annotatedEntry = document.createElement("div");
        annotatedEntry.className = "p";
        annotatedEntry.style.display = "inline";
        annotatedEntry.style.cursor = "pointer";
        annotatedEntry.style.textDecoration = "underline";
        annotatedEntry.style.color = "#863EDE";
        annotatedEntry.style.backgroundColor = "rgba(0, 0, 0, 0)";
        if ("rawContent" in entry){

            annotatedEntry.innerHTML = entry.rawContent;
        } else {
            annotatedEntry.innerHTML = entry.type === "acronym" ? entry.acronym : entry.term;
        }


        // Tooltip for definition
        const tooltip = document.createElement("div");
        tooltip.style.position = "absolute";
        tooltip.style.left = "0";
        tooltip.style.top = "80px";
        tooltip.style.color = "black";
        tooltip.style.backgroundColor = "rgba(255, 255, 255)";
        tooltip.style.border = "1px solid black";
        tooltip.style.borderRadius = "5px";
        tooltip.style.padding = "10px 10px";
        tooltip.textContent = capitalizeFirstLetter(entry.term) + ": " + entry.entry.definition;
        tooltip.style.display = "none";
        tooltip.style.zIndex = "1000";
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

    async function processParagraphs(paragraphClassName, sentencesCallback) {
        const paragraphElements = document.getElementsByClassName(paragraphClassName);
        const mappedParagraphs = [];
        let index = 0;

        Array.from(paragraphElements).forEach(async (paragraphElement) => {
            paragraphElement.id = `paragraph-${index}`;
            mappedParagraphs.push({
                elementId: `paragraph-${index}`,
                sentence: paragraphElement.innerHTML,
            });
            index++;


        });
        try {
            const response = await fetch(`https://testnextjscors.vercel.app/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sentences: mappedParagraphs }),
            });

            const data = await response.json();
            const { data: { parsedSentences } } = data;


            sentencesCallback(parsedSentences);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function addButtonWhenReady() {
        const intervalId = setInterval(() => {
            const pElement = document.getElementsByClassName("p")[0];

            if (pElement) {
                clearInterval(intervalId);



                    processParagraphs("p", (parsedSentences) => {
                        parsedSentences.forEach((parsedSentenceAndEntry, index) => {
                            const paragraphElement = document.getElementById(parsedSentenceAndEntry.elementId);
                            const parsedSentence = parsedSentenceAndEntry.sentence;
                            paragraphElement.innerHTML = "";

                            for (let i = 0; i < parsedSentence.length; i++) {
                                const entry = parsedSentence[i];
                                if ('word' in entry) {
                                    const textDiv = document.createElement("div");

                                        textDiv.innerHTML =  " " + entry.word + " ";

                                    textDiv.style.display = "inline";
                                    paragraphElement.appendChild(textDiv);
                                } else {
                                    const annotatedEntry = createAnnotatedEntry(entry);
                                    paragraphElement.appendChild(annotatedEntry);
                                }
                            };

                        })
                    });

            }
        }, 100);
    }

    })();
