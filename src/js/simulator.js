var $ = require('jquery');
const superagent = require('superagent');

$(document).ready(function() {
    $(".simulator-tabs-names .tab-name").click(selectTab);
    $(".distribution").click(erlang);
    $("#mm1-button").click(mm1);
    $("#mms-button").click(mms);
    $("#mmsk-button").click(mmsk);
    $("#mg1-button").click(mg1);
})
function selectTab(){
    $(".tab-container").hide();
    $(".simulator-tabs-names .tab-name").removeClass("selected");
    let tab = $(this).attr("data-target");
    $("#" + tab).show();
    $(this).addClass("selected");
    $("#tbody-mm1").html("");
    $("#tbody-mms").html("");
    $("#tbody-mmsk").html("");
    $("#tbody-mg1").html("");
   
    
}   

function erlang(){
    if($('input[value=erlang]').is(':checked')){
        $("#erlang_num").show()
    }else{
        $("#erlang_num").hide()
    }
}

function mm1(){

}

function mms(){

}

function mmsk(){

}

function mg1(){
    
}