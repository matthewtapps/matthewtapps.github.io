"use strict";

let activeItem;
let contentItemMap = {};

document.addEventListener("DOMContentLoaded", async function() {
    let navItems = document.querySelectorAll(".navigation-list .item");
    activeItem = navItems[0];
    document.body.classList.add('loaded');

    await loadContent(activeItem.innerText.toLowerCase());
    positionTriangleUnder(activeItem);
    openBubble();

    navItems.forEach(item => {
        item.addEventListener("click", async function() {
            if (activeItem != item) {
                activeItem = item;
                await closeBubble();
                if(!contentItemMap[item.innerText.toLowerCase()]){
                    await loadContent(item.innerText.toLowerCase());
                } else {
                    displayContent(item.innerText.toLowerCase());
                }
                await positionTriangleUnder(item);
                openBubble();
            }
        });
    });
});

window.onresize = function() {
    if (activeItem) {
        positionTriangleUnder(activeItem);
    }
}

function positionTriangleUnder(item) {
    return new Promise((resolve) => {
        let triangle = document.querySelector(".triangle");
        let itemPos = item.getBoundingClientRect();
        let trianglePos = triangle.getBoundingClientRect();
        let newLeftPosition = itemPos.left + (itemPos.width / 2) - (trianglePos.width / 2);

        triangle.style.left = newLeftPosition + "px";
        
        triangle.addEventListener('transitionend', function onEnd() {
            triangle.removeEventListener('transitionend', onEnd);
            resolve();
        });
    });
}

async function loadContent(id) {
    let activeDiv = document.querySelector(`.index-content-box #${id}`);
    
    return fetch(`./assets/content/${id}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load content for ${id}. Status: ${response.status}`);
            }
            contentItemMap[id] = true;
            return response.text();
        })
        .then(content => {
            let contentDivs = document.querySelectorAll('.index-content-box .content');
            contentDivs.forEach(div => {
                div.classList.add('hidden');
            });

            activeDiv.innerHTML = content;
            activeDiv.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error in loadContent:', error);
        });
    }

function displayContent(id) {
    let contentDivs = document.querySelectorAll('.index-content-box .content');
    contentDivs.forEach(div => {
        if (div.id === id) {
            div.classList.remove('hidden');
        } else {
            div.classList.add('hidden');
        }
    });
}

function openBubble() {
    let contentBox = document.querySelector('.index-content-box');
    contentBox.style.height = 'auto';
    let height = contentBox.offsetHeight;
    contentBox.style.height = '9px';
    contentBox.offsetHeight;
    contentBox.style.height = height + 'px';
}

function closeBubble() {
    return new Promise((resolve) => {
        let contentBox = document.querySelector('.index-content-box');
        contentBox.style.height = '9px';
        
        contentBox.addEventListener('transitionend', function onEnd() {
            contentBox.removeEventListener('transitionend', onEnd);
            resolve();
        });
    });
}
