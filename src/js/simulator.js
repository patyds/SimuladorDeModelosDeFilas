var $ = require('jquery');
const superagent = require('superagent');
const app = "https://mononucleo-modelos-filas.herokuapp.com/";
var persons = [];
var personNumber = 10;
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
    populateHeader();
})
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function populateHeader(){
    for(var x = 0; x < personNumber; x++)
    {
        persons.push("<div class='person p"+x+"' style=\"top: 0; background-image: url('./src/assets/person.png'); animation-delay: " + (x/2) + "s; transform: rotateZ("+ (getRandomInt(10) - getRandomInt(20)) +"deg);\"></div>");
        $(".header").append(persons[x]);
    }
    setTimeout(function(){
        for(var x = 0; x < personNumber; x++)
        {
            $(".p"+x).css("animation-play-state", "paused");
        }
    }, 4500);
    
}
function movePerson()
{
    for(var x = 0; x < personNumber; x++)
    {
        $(".p"+x).css("animation-play-state", "running");
    }
    setTimeout(function(){
        for(var x = 0; x < personNumber; x++)
        {
            $(".p"+x).css("animation-play-state", "paused");
        }
    }, 500);
}
function selectTab(){
    movePerson();
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
    movePerson();
    $("#tbody-mg1-w").html("");
    if($("#mm1-arrival").val()=="" || $("#mm1-service").val()==""){
        alert("Por favor llene los campos requeridos")
    }else if(parseInt($("#mm1-arrival").val()) < 0 || parseInt($("#mm1-service").val()) < 0){
        alert("Por favor, ingrese números positivos")
    }else{
        if(navigator.onLine){
            if( $('input[name=mm1-cost]').is(':checked')){
                if($('#mm1-cs').val() == "" || $('#mm1-cw').val()== ""){
                    alert("por favor, ingresa los valores para los costos");
                }else{
                    var probss = $("#mm1-prob").val() != "" ? $("#mm1-prob").val(): "";
                    superagent.get(app+'mm1')
                    .query({ lambd: $("#mm1-arrival").val(), mu: $("#mm1-service").val(), probs : probss, twc: $("#mm1-cw").val(), sc: $("#mm1-cs").val() })
                    .end((err, res) => {
                        if (err) { 
                            return console.log(err); 
                        }else{
                            var mm1 = res.body;
                            console.log(res.body);
                            $("#tdata-mm1-w").text(mm1.w);
                            $("#tdata-mm1-wq").text(mm1.wq);
                            $("#tdata-mm1-l").text(mm1.l);
                            $("#tdata-mm1-lq").text(mm1.lq);
                            $("#tbody-mm1-p0").html(mm1.p0);
                            var resbody =$("#tbody-mm1-p");
                            for (let index = 0; index < mm1.Probs.length; index++) {
                                var row = $("<div></div>").addClass("trow")
                                var element = $("<div></div>").addClass("tdata number").text(mm1.Probs.Observable[index]);
                                $(row).append(element);
                                element = $("<div></div>").addClass("tdata").text(mm1.Probs.Probability[index]);
                                $(row).append(element);
                                
                                
                                $(resbody).append(row);
                            }
                        }
                    });
                }
            }else{
                var probss = $("#mm1-prob").val() != "" ? $("#mm1-prob").val(): "" ;
                superagent.get(app+'mm1')
                .query({ lambd: $("#mm1-arrival").val(), mu: $("#mm1-service").val(), probs : probss })
                .end((err, res) => {
                    if (err) { 
                        return console.log(err); 
                    }else{
                        var mm1 = res.body;
                        console.log(res.body);
                        $("#tdata-mm1-w").text(mm1.w);
                        $("#tdata-mm1-wq").text(mm1.wq);
                        $("#tdata-mm1-l").text(mm1.l);
                        $("#tdata-mm1-lq").text(mm1.lq);
                        $("#tdata-mm1-p0").html(mm1.p0);
                        var resbody =$("#tbody-mm1-p");
                        for (let index = 0; index < mm1.Probs.length; index++) {
                            var row = $("<div></div>").addClass("trow")
                            var element = $("<div></div>").addClass("tdata number").text(mm1.Probs.Observable[index]);
                            $(row).append(element);
                            element = $("<div></div>").addClass("tdata").text(mm1.Probs.Probability[index]);
                            $(row).append(element);
                            
                            $(resbody).append(row);
                        }
                        /*var resbody =$("#tbody-ms");
                        if(ms.Randoms.length < $("#ms-lim").val()){
                            alert("El periodo se cumplió antes del límite de números random")
                        }
                        for (let index = 0; index < ms.Randoms.length; index++) {
                            var row = $("<div></div>").addClass("trow")
                            var element = $("<div></div>").addClass("tdata number").text(index+1);
                            $(row).append(element);
                            element = $("<div></div>").addClass("tdata").text(ms.Seed[index]);
                            $(row).append(element);
                            element = $("<div></div>").addClass("tdata").text(ms.Generator[index]);
                            $(row).append(element);
                            element = $("<div></div>").addClass("tdata").text(ms.Generated[index]);
                            $(row).append(element);
                            element = $("<div></div>").addClass("tdata").text(ms.Randoms[index].toFixed(4));
                            $(row).append(element);
                            $(resbody).append(row);
                        }*/
                    }
                });
            }
        }else{
            alert("Lo sentimos, necesitas tener una conexión a internet para usar el generador")
        }
    }
}
function mms(){
    movePerson();
}

function mmsk(){
    movePerson();
}

function mg1(){
    movePerson();
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
