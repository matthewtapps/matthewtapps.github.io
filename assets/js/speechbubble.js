"use strict";

let activeItem

document.addEventListener("DOMContentLoaded", function() {
    let navItems = document.querySelectorAll(".navigation-list .item");
    activeItem = navItems[0]
    document.body.classList.add('loaded');

    activeItem = navItems[0]
    positionTriangleUnder(activeItem);
    closeBubble()
    fetchContent(activeItem.innerText, () => {
        openBubble();
    })    

    navItems.forEach(item => {
        item.addEventListener("click", function() {
            activeItem = item
            closeBubble(() => {
                fetchContent(item.innerText, () => {
                    positionTriangleUnder(item, () => {
                        openBubble();
                    });
                });                
            });
        });
    });
});

window.onresize = function() {
    if (activeItem) {
        positionTriangleUnder(activeItem);
    }
}

function positionTriangleUnder(item, callback) {
    let triangle = document.querySelector(".triangle");
    let itemPos = item.getBoundingClientRect();
    let trianglePos = triangle.getBoundingClientRect();
    let newPosition = itemPos.left + (itemPos.width / 2) - (trianglePos.width / 2);

    triangle.style.left = newPosition + "px";
    triangle.style.transform = 'none';
    triangle.addEventListener('transitionend', function onEnd() {
        triangle.removeEventListener('transitionend', onEnd);
        if (callback) callback();
    });
}

function fetchContent(file, callback) {
    fetch('./assets/content/' + file + '.txt')
    .then(response => response.text())
    .then(content => {
        let contentBox = document.querySelector('.index-content-box .content');
        contentBox.textContent = content;
        if (callback) callback();
    })
    .catch(error => {
        console.error('Error fetching content .txt file', error);
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

function closeBubble(callback) {
    let contentBox = document.querySelector('.index-content-box');
    contentBox.style.height = '9px';
    contentBox.addEventListener('transitionend', function onEnd() {
        contentBox.removeEventListener('transitionend', onEnd);
        if (callback) callback();
    });
}