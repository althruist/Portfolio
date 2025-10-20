import { getImage, getImageSize } from "./data";

function escapeHTML(str) {
    if (typeof str !== "string") return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderMarks(child, markDefs = []) {
    const marks = child.marks || [];
    let openTags = "";
    let closeTags = "";

    marks.forEach(mark => {
        switch (mark) {
            case "strong":
            case "em":
                openTags += `<${mark}>`;
                closeTags = `</${mark}>` + closeTags;
                break;
            case "underline":
                openTags += "<u>";
                closeTags = "</u>" + closeTags;
                break;
            case "strike-through":
                openTags += "<s>";
                closeTags = "</s>" + closeTags;
                break;
        }
    });

    marks.forEach(mark => {
        const def = markDefs.find(md => md._key === mark && md.href);
        if (def) {
            openTags = `<a href="${def.href}">` + openTags;
            closeTags += "</a>";
        }
    });

    return openTags + child.text + closeTags;
}

export function formatDateTime(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function renderBody(body) {
    const finalArray = [];
    let currentList = null;
    let currentLevel = 0;

    body.forEach(paragraph => {
        let innerHTML = "";
        if (paragraph._type === "block") {
            innerHTML = paragraph.children
                .map(child => renderMarks(child, paragraph.markDefs))
                .join("");

            let openTag = "<p>", closeTag = "</p>";
            switch (paragraph.style) {
                case "h1": openTag = "<h1>"; closeTag = "</h1>"; break;
                case "h2": openTag = "<h2>"; closeTag = "</h2>"; break;
                case "h3": openTag = "<h3>"; closeTag = "</h3>"; break;
                case "h4": openTag = "<h4>"; closeTag = "</h4>"; break;
                case "h5": openTag = "<h5>"; closeTag = "</h5>"; break;
                case "h6": openTag = "<h6>"; closeTag = "</h6>"; break;
                case "blockquote": openTag = "<blockquote>"; closeTag = "</blockquote>"; break;
            }

            if (paragraph.listItem) {
                const listTag = paragraph.listItem === "bullet" ? "ul" : "ol";
                const level = paragraph.level || 1;

                if (!currentList || currentList !== listTag || level !== currentLevel) {
                    if (currentList) finalArray.push(`</${currentList}>`);
                    finalArray.push(`<${listTag}>`);
                    currentList = listTag;
                    currentLevel = level;
                }

                finalArray.push(`<li>${openTag}${innerHTML}${closeTag}</li>`);
            } else {
                if (currentList) {
                    finalArray.push(`</${currentList}>`);
                    currentList = null;
                    currentLevel = 0;
                }

                finalArray.push(`${openTag}${innerHTML}${closeTag}`);
            }

        } else if (paragraph._type === "code") {
            if (currentList) {
                finalArray.push(`</${currentList}>`);
                currentList = null;
                currentLevel = 0;
            }

            if (paragraph.code) {
                finalArray.push(
                    `<pre><code><div class="codeLanguage">${paragraph.language || ""}</div><hr><br>${escapeHTML(paragraph.code)}</code></pre>`
                );
            }
        } else if (paragraph._type === "image") {
            if (currentList) {
                finalArray.push(`</${currentList}>`);
                currentList = null;
                currentLevel = 0;
            }
            let imageSize = getImageSize(paragraph.asset._ref)
            finalArray.push(`<img src=${getImage(paragraph.asset._ref)} width=${imageSize[0]} height=${imageSize[1]} alt="${paragraph.alt}">`);
        }
    });

    if (currentList) finalArray.push(`</${currentList}>`);

    return finalArray.join(" ");
}