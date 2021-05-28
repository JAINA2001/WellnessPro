var affirm =["You are Beautiful","You can do this","Together we can"];
var i = 0;
document.getElementById("affirmbtn").addEventListener("click", function() {
  document.getElementById("text").innerHTML = "Affirmations!";  
  document.getElementById("res").innerHTML = affirm[i];  
  i++;

});
