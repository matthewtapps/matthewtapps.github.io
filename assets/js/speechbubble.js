"use strict";

let activeItem

document.addEventListener("DOMContentLoaded", async function() {
    let navItems = document.querySelectorAll(".navigation-list .item");
    activeItem = navItems[0];
    document.body.classList.add('loaded');

    positionTriangleUnder(activeItem);
    await loadContent(activeItem.innerText.toLowerCase());
    openBubble();

    navItems.forEach(item => {
        item.addEventListener("click", async function() {
            activeItem = item;
            await closeBubble();
            await loadContent(item.innerText.toLowerCase());
            await positionTriangleUnder(item);
            openBubble();
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
        let newPosition = itemPos.left + (itemPos.width / 2) - (trianglePos.width / 2);

        triangle.style.left = newPosition + "px";
        triangle.style.transform = 'none';
        
        triangle.addEventListener('transitionend', function onEnd() {
            triangle.removeEventListener('transitionend', onEnd);
            resolve();
        });
    });
}

async function loadContent(id) {
    return fetch(`./assets/content/${id}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load content for ${id}. Status: ${response.status}`);
            }
            return response.text();
        })
        .then(content => {
            let contentDivs = document.querySelectorAll('.index-content-box .content');
            contentDivs.forEach(div => {
                div.classList.add('hidden');
            });

            let activeDiv = document.querySelector(`.index-content-box #${id}`);
            activeDiv.innerHTML = content;
            activeDiv.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error in loadContent:', error);
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
