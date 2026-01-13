function respond(event) {
    alert("You clicked me!");
}

const node = document.getElementById("clickme");
node.addEventListener("click", respond);