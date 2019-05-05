var $ = require('jquery');
const superagent = require('superagent');

$(document).ready(function() {
    $(".simulator-tabs-names .tab-name").click(selectTab);
    $(".distribution").click(erlang);
    $(".mm1-cost").click(mm1cost);
    $(".mms-cost").click(mmscost);
    $(".mmsk-cost").click(mmskcost);
    $(".mg1-cost").click(mg1cost);
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

function mm1cost(){
    if($('input[name=mm1-cost]').is(':checked')){
        $('.mm1-cost-input').show()
    }else{
        $('.mm1-cost-input').hide()
    }
}

function mmskcost(){
    if($('input[name=mmsk-cost]').is(':checked')){
        $('.mmsk-cost-input').show()
    }else{
        $('.mmsk-cost-input').hide()
    }
}

function mmscost(){
    if($('input[name=mms-cost]').is(':checked')){
        $('.mms-cost-input').show()
    }else{
        $('.mms-cost-input').hide()
    }
}

function mg1cost(){
    if($('input[name=mg1-cost]').is(':checked')){
        $('.mg1-cost-input').show()
    }else{
        $('.mg1-cost-input').hide()
    }
}
