(() => {
    const rabbits = [
        document.getElementById("rabbit1"),
        document.getElementById("rabbit2"),
        document.getElementById("rabbit3"),
        document.getElementById("rabbit4")
    ];
    const noEggs = document.getElementById("noeggs");
    const slow = document.getElementById("slow");
    let attempts = 0;
    let idx = 0;

    rabbits.forEach((rabbit) => {
        rabbit.addEventListener("mouseover", () => {
            attempts++;
            if (attempts === 4) noEggs.style.visibility = "visible";
            if (attempts === 20) slow.style.visibility = "visible";

            rabbits[idx].style.visibility = "hidden";
            idx = (idx + 1) % rabbits.length;
            rabbits[idx].style.visibility = "visible";
        });
    });
})();