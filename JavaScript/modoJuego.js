let modal = document.getElementById("myModal");
let btn = document.getElementById("buttonModal");
let span = document.getElementsByClassName("close")[0];

btn.addEventListener("click", () => {
    modal.style.display = "block";
});

span.addEventListener("click", (e) => {
    modal.style.display = "none";
});