window.addEventListener("load", function () {

    const node = document.getElementById("clickme");
    
    node.addEventListener("click", function(event) {
        alert("You clicked me!");
    });

});