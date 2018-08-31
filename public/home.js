document.addEventListener("DOMContentLoaded", function() {
    var setHour = document.querySelectorAll(".setHour");
    var setMinute = document.querySelectorAll(".setMinute");
    var submitButton = document.getElementById("set");

    var controlButton = document.querySelectorAll('#control input[type="checkbox"]');
    for(x of controlButton) {
        x.onchange = function() {
            if(this.checked) {console.log(this.getAttribute("id")+"on")}
            else {console.log(this.getAttribute("id")+"off")}
        }
    }

    submitButton.onclick = function() {
        
    }
    
    for(x of setHour) {
        x.addEventListener("keyup", function() {
            if(this.value > 23 || this.value < 0) {
                if (this.value > 23) {this.value = 0}
                else if (this.value < 0) {this.value = 0}
            }
        });
    }

    for(y of setMinute) {
        y.addEventListener("keyup", function() {
            if(this.value > 59 || this.value < 0) {
                if (this.value > 59) {this.value = 0}
                else if (this.value < 0) {this.value = 0}
            }
        });
    }
});