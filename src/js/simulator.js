var $ = require('jquery');
const superagent = require('superagent');

$(document).ready(function() {
    $(".simulator-tabs-names .tab-name").click(selectTab);
})
function selectTab(){
    $(".tab-container").hide();
    $(".simulator-tabs-names .tab-name").removeClass("selected");
    let tab = $(this).attr("data-target");
    $("#" + tab).show();
    $(this).addClass("selected");
    $("#tbody-mm1").html("");
    $("#tbody-mms").html("");
    /*$("#tbody-lc").html("");
    $("#tbody-lcm").html("");
    $("#tbody-lcc").html(""); */
    $(".test").hide();
}   