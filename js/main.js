const menu = document.getElementById("menu");
const action = document.getElementById("action");
menu.addEventListener('click',()=>{
    action.classList.toggle('active');
});