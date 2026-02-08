const items = [];
const input = document.getElementById("itemInput");
const list = document.getElementById("list");

document.getElementById("addBtn").addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    items.push(text);
    input.value = "";
    render();
});

document.getElementById("deleteBtn").addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    const index = items.indexOf(text);
    if (index !== -1) items.splice(index, 1);
    input.value = "";
    render();
});

function render() {
    list.innerHTML = "";
    items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
}