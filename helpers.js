export function testImport() {
    console.log("testImport");
}

export function createAnnotatedEntry(entry) {
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

export async function processParagraphs(paragraphClassName, sentencesCallback) {
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


        sentencesCallback(parsedSentences);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}