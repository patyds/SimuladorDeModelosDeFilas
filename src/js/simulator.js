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
    if($('input[value=mek1]').is(':checked')){
        $("#erlang_num").show()
    }else{
        $("#erlang_num").hide()
    }
}

function mm1(){
    $("#mm1-table-cost").hide();
    movePerson();
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
                            $("#tbody-mm1-p0").text(mm1.p0);
                            $("#mm1-table-cost").show();
                            $("#tbody-mm1-cost").text(mm1.utilizationcost);
                            var resbody =$("#tbody-mm1-p");
                            resbody.html("");
                            for (let index = 0; index < mm1.probs.Observable.length; index++) {
                                var row = $("<div></div>").addClass("trow")
                                var element = $("<div></div>").addClass("tdata number").text(mm1.probs.Observable[index]);
                                $(row).append(element);
                                element = $("<div></div>").addClass("tdata").text(mm1.probs.Probability[index].toFixed(4));
                                $(row).append(element);
                                
                                
                                $(resbody).append(row);
                            }
                            
                        }
                    });
                }
            }else{
                var probss = $("#mm1-prob").val() != "" ? $("#mm1-prob").val(): "" ;
                console.log(probss)
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
                        resbody.html("");
                        for (let index = 0; index < mm1.probs.Observable.length; index++) {
                            var row = $("<div></div>").addClass("trow")
                            var element = $("<div></div>").addClass("tdata number").text(mm1.probs.Observable[index]);
                            $(row).append(element);
                            element = $("<div></div>").addClass("tdata").text(mm1.probs.Probability[index].toFixed(4));
                            $(row).append(element);
                            
                            $(resbody).append(row);
                        }
                    }
                });
            }
        }else{
            alert("Lo sentimos, necesitas tener una conexión a internet para usar el generador")
        }
    }
}

function mms(){
    movePerson()
    $("#mms-table-cost").hide();
    if($("#mms-arrival").val()=="" || $("#mms-service").val()=="" || $("#mms-servers").val()==""){
        alert("Por favor llene los campos requeridos")
    }else if(parseInt($("#mms-arrival").val()) < 0 || parseInt($("#mms-service").val()) < 0 || parseInt($("#mms-servers").val()) < 0){
        alert("Por favor, ingrese números positivos")
    }else{
        if(navigator.onLine){
            if( $('input[name=mms-cost]').is(':checked')){
                if($('#mms-cs').val() == "" || $('#mms-cw').val()== ""){
                    alert("por favor, ingresa los valores para los costos");
                }else{
                    var probss = $("#mms-prob").val() != "" ? $("#mms-prob").val(): "";
                    superagent.get(app+'mms')
                    .query({ lambd: $("#mms-arrival").val(), mu: $("#mms-service").val(), probs : probss, servs: $("#mms-servers").val(), twc: $("#mms-cw").val(), sc: $("#mms-cs").val() })
                    .end((err, res) => {
                        if (err) { 
                            return console.log(err); 
                        }else{
                            var mms = res.body;
                            console.log(res.body);
                            $("#tdata-mms-w").text(mms.w);
                            $("#tdata-mms-wq").text(mms.wq);
                            $("#tdata-mms-l").text(mms.l);
                            $("#tdata-mms-lq").text(mms.lq);
                            $("#tbody-mms-p0").text(mms.p0);
                            $("#mms-table-cost").show();
                            $("#tbody-mms-cost").text(mms.utilizationcost);
                            var resbody =$("#tbody-mms-p");
                            resbody.html("");
                            for (let index = 0; index < mms.probs.Observable.length; index++) {
                                var row = $("<div></div>").addClass("trow")
                                var element = $("<div></div>").addClass("tdata number").text(mms.probs.Observable[index]);
                                $(row).append(element);
                                element = $("<div></div>").addClass("tdata").text(mms.probs.Probability[index].toFixed(4));
                                $(row).append(element);
                                
                                
                                $(resbody).append(row);
                            }
                            
                        }
                    });
                }
            }else{
                var probss = $("#mms-prob").val() != "" ? $("#mms-prob").val(): "" ;
                console.log(probss)
                superagent.get(app+'mms')
                .query({ lambd: $("#mms-arrival").val(), mu: $("#mms-service").val(), probs : probss , servs : $("#mms-servers").val()})
                .end((err, res) => {
                    if (err) { 
                        return console.log(err); 
                    }else{
                        var mms = res.body;
                        console.log(res.body);
                        $("#tdata-mms-w").text(mms.w);
                        $("#tdata-mms-wq").text(mms.wq);
                        $("#tdata-mms-l").text(mms.l);
                        $("#tdata-mms-lq").text(mms.lq);
                        $("#tbody-mms-p0").text(mms.p0);
                        var resbody =$("#tbody-mms-p");
                        resbody.html("");
                        for (let index = 0; index < mms.probs.Observable.length; index++) {
                            var row = $("<div></div>").addClass("trow")
                            var element = $("<div></div>").addClass("tdata number").text(mms.probs.Observable[index]);
                            $(row).append(element);
                            element = $("<div></div>").addClass("tdata").text(mms.probs.Probability[index].toFixed(4));
                            $(row).append(element);
                            
                            $(resbody).append(row);
                        }
                    }
                });
            }
        }else{
            alert("Lo sentimos, necesitas tener una conexión a internet para usar el generador")
        }
    }
}

function mmsk(){
    movePerson()
    $("#mmsk-table-cost").hide();
    if($("#mmsk-arrival").val()=="" || $("#mmsk-service").val()=="" || $("#mmsk-servers").val()==""|| $("#mmsk-k").val()==""){
        alert("Por favor llene los campos requeridos")
    }else if(parseInt($("#mmsk-arrival").val()) < 0 || parseInt($("#mmk-service").val()) < 0 || parseInt($("#mmsk-servers").val()) < 0 || parseInt($("#mmsk-k").val()) < 0){
        alert("Por favor, ingrese números positivos")
    }else{
        if(navigator.onLine){
            console.log($("#mmsk-k").val())
            if( $('input[name=mmsk-cost]').is(':checked')){
                if($('#mmsk-cs').val() == "" || $('#mmsk-cw').val()== ""){
                    alert("por favor, ingresa los valores para los costos");
                }else{
                    var probss = $("#mmsk-prob").val() != "" ? $("#mmsk-prob").val(): "";
                    superagent.get(app+'mmsk')
                    .query({ lambd: $("#mmsk-arrival").val(), mu: $("#mmsk-service").val(), probs : probss, servs: $("#mmsk-servers").val(), twc: $("#mmsk-cw").val(), sc: $("#mmsk-cs").val(), k: $("#mmsk-k").val()  })
                    .end((err, res) => {
                        if (err) { 
                            return console.log(err); 
                        }else{
                            var mmsk = res.body;
                            console.log(res.body);
                            $("#tdata-mmsk-w").text(mmsk.w);
                            $("#tdata-mmsk-wq").text(mmsk.wq);
                            $("#tdata-mmsk-ef").text(mmsk.le);
                            $("#tdata-mmsk-l").text(mmsk.l);
                            $("#tdata-mmsk-lq").text(mmsk.lq);
                            $("#tbody-mmsk-p0").text(mmsk.p0);
                            $("#mmsk-table-cost").show();
                            $("#tdata-mmsk-cost").text(mmsk.utilizationcost);
                            var resbody =$("#tbody-mmsk-p");
                            resbody.html("");
                            for (let index = 0; index < mmsk.probs.Observable.length; index++) {
                                var row = $("<div></div>").addClass("trow")
                                var element = $("<div></div>").addClass("tdata number").text(mmsk.probs.Observable[index]);
                                $(row).append(element);
                                element = $("<div></div>").addClass("tdata").text(mmsk.probs.Probability[index].toFixed(4));
                                $(row).append(element);
                                
                                
                                $(resbody).append(row);
                            }
                            
                        }
                    });
                }
            }else{
                var probss = $("#mmsk-prob").val() != "" ? $("#mmsk-prob").val(): "" ;
                console.log(probss)
                superagent.get(app+'mmsk')
                .query({ lambd: $("#mmsk-arrival").val(), mu: $("#mmsk-service").val(), probs : probss , servs : $("#mmsk-servers").val(), k : $("#mmsk-k").val()})
                .end((err, res) => {
                    if (err) { 
                        return console.log(err); 
                    }else{
                        var mmsk = res.body;
                        console.log(res.body);
                        $("#tdata-mmsk-w").text(mmsk.w);
                        $("#tdata-mmsk-ef").text(mmsk.le);
                        $("#tdata-mmsk-wq").text(mmsk.wq);
                        $("#tdata-mmsk-l").text(mmsk.l);
                        $("#tdata-mmsk-lq").text(mmsk.lq);
                        $("#tbody-mmsk-p0").text(mmsk.p0);
                        var resbody =$("#tbody-mmsk-p");
                        resbody.html("");
                        for (let index = 0; index < mmsk.probs.Observable.length; index++) {
                            var row = $("<div></div>").addClass("trow")
                            var element = $("<div></div>").addClass("tdata number").text(mmsk.probs.Observable[index]);
                            $(row).append(element);
                            element = $("<div></div>").addClass("tdata").text(mmsk.probs.Probability[index].toFixed(4));
                            $(row).append(element);
                            
                            $(resbody).append(row);
                        }
                    }
                });
            }
        }else{
            alert("Lo sentimos, necesitas tener una conexión a internet para usar el generador")
        }
    }
}

function mg1(){
    movePerson()
    $("#mg1-table-cost").hide();
    if($("#mg1-arrival").val()=="" || $("#mg1-service").val()==""){
        alert("Por favor llene los campos requeridos")
    }else if(parseInt($("#mg1-arrival").val()) < 0 || parseInt($("#mg1-service").val()) < 0){
        alert("Por favor, ingrese números positivos")
    }else if($("input[name='general']:checked").val()== undefined){
        alert("Por favor, selecciona una distribución")
    }else{
        if(navigator.onLine){
            if( $('input[name=mg1-cost]').is(':checked')){
                if($('#mg1-cs').val() == "" || $('#mg1-cw').val()== ""){
                    alert("por favor, ingresa los valores para los costos");
                }else{
                    var probss = $("#mg1-prob").val() != "" ? $("#mg1-prob").val(): "";
                    if($("input[name='general']:checked").val()== "mek1"){
                        if($("#mg1-k").val() == ""){
                            alert("Tiener que ingresar el valor de 'k'");
                        }else{
                            superagent.get(app+$("input[name='general']:checked").val())
                            .query({ lambd: $("#mg1-arrival").val(), mu: $("#mg1-service").val(), probs : probss, twc: $("#mg1-cw").val(), sc: $("#mg1-cs").val(), k: $("#mg1-k").val() })
                            .end((err, res) => {
                                if (err) { 
                                    return console.log(err); 
                                }else{
                                    var mg1 = res.body;
                                    console.log(res.body);
                                    $("#tdata-mg1-w").text(mg1.w);
                                    $("#tdata-mg1-wq").text(mg1.wq);
                                    $("#tdata-mg1-l").text(mg1.l);
                                    $("#tdata-mg1-lq").text(mg1.lq);
                                    $("#tbody-mg1-p0").text(mg1.p0);
                                    $("#mg1-table-cost").show();
                                    $("#tbody-mg1-cost").text(mg1.utilizationcost);
                                    var resbody =$("#tbody-mg1-p");
                                    resbody.html("");
                                    for (let index = 0; index < mg1.probs.Observable.length; index++) {
                                        var row = $("<div></div>").addClass("trow")
                                        var element = $("<div></div>").addClass("tdata number").text(mg1.probs.Observable[index]);
                                        $(row).append(element);
                                        element = $("<div></div>").addClass("tdata").text(mg1.probs.Probability[index].toFixed(4));
                                        $(row).append(element);
                                        
                                        
                                        $(resbody).append(row);
                                    }
                                    
                                }
                            });
                        }
                    }else{
                    
                        superagent.get(app+$("input[name='general']:checked").val())
                        .query({ lambd: $("#mg1-arrival").val(), mu: $("#mg1-service").val(), probs : probss, twc: $("#mg1-cw").val(), sc: $("#mg1-cs").val() })
                        .end((err, res) => {
                            if (err) { 
                                return console.log(err); 
                            }else{
                                var mg1 = res.body;
                                console.log(res.body);
                                $("#tdata-mg1-w").text(mg1.w);
                                $("#tdata-mg1-wq").text(mg1.wq);
                                $("#tdata-mg1-l").text(mg1.l);
                                $("#tdata-mg1-lq").text(mg1.lq);
                                $("#tbody-mg1-p0").text(mg1.p0);
                                $("#mg1-table-cost").show();
                                $("#tbody-mg1-cost").text(mg1.utilizationcost);
                                var resbody =$("#tbody-mg1-p");
                                resbody.html("");
                                for (let index = 0; index < mg1.probs.Observable.length; index++) {
                                    var row = $("<div></div>").addClass("trow")
                                    var element = $("<div></div>").addClass("tdata number").text(mg1.probs.Observable[index]);
                                    $(row).append(element);
                                    element = $("<div></div>").addClass("tdata").text(mg1.probs.Probability[index].toFixed(4));
                                    $(row).append(element);
                                    
                                    
                                    $(resbody).append(row);
                                }
                                
                            }
                        });
                    }
                }
            }else{
                var probss = $("#gm1-prob").val() != "" ? $("#mg1-prob").val(): "" ;
                if($("input[name='general']:checked").val()== "mek1"){
                    if($("#mg1-k").val() == ""){
                        alert("Tiener que ingresar el valor de 'k'");
                    }else{
                        superagent.get(app+$("input[name='general']:checked").val())
                        .query({ lambd: $("#mg1-arrival").val(), mu: $("#mg1-service").val(), probs : probss, k: $("#mg1-k").val() })
                        .end((err, res) => {
                            if (err) { 
                                return console.log(err); 
                            }else{
                                var mg1 = res.body;
                                console.log(res.body);
                                $("#tdata-mg1-w").text(mg1.w);
                                $("#tdata-mg1-wq").text(mg1.wq);
                                $("#tdata-mg1-l").text(mg1.l);
                                $("#tdata-mg1-lq").text(mg1.lq);
                                $("#tbody-mg1-p0").text(mg1.p0);
                                $("#mg1-table-cost").show();
                                $("#tbody-mg1-cost").text(mg1.utilizationcost);
                                var resbody =$("#tbody-mg1-p");
                                resbody.html("");
                                for (let index = 0; index < mg1.probs.Observable.length; index++) {
                                    var row = $("<div></div>").addClass("trow")
                                    var element = $("<div></div>").addClass("tdata number").text(mg1.probs.Observable[index]);
                                    $(row).append(element);
                                    element = $("<div></div>").addClass("tdata").text(mg1.probs.Probability[index].toFixed(4));
                                    $(row).append(element);
                                    
                                    
                                    $(resbody).append(row);
                                }
                                
                            }
                        });
                    }
                }else{
                    superagent.get(app+$("input[name='general']:checked").val())
                    .query({ lambd: $("#mg1-arrival").val(), mu: $("#mg1-service").val(), probs : probss })
                    .end((err, res) => {
                        if (err) { 
                            return console.log(err); 
                        }else{
                            var mg1 = res.body;
                            console.log(res.body);
                            $("#tdata-mg1-w").text(mg1.w);
                            $("#tdata-mg1-wq").text(mg1.wq);
                            $("#tdata-mg1-l").text(mg1.l);
                            $("#tdata-mg1-lq").text(mg1.lq);
                            $("#tdata-mg1-p0").html(mg1.p0);
                            var resbody =$("#tbody-mg1-p");
                            resbody.html("");
                            for (let index = 0; index < mg1.probs.Observable.length; index++) {
                                var row = $("<div></div>").addClass("trow")
                                var element = $("<div></div>").addClass("tdata number").text(mg1.probs.Observable[index]);
                                $(row).append(element);
                                element = $("<div></div>").addClass("tdata").text(mg1.probs.Probability[index].toFixed(4));
                                $(row).append(element);
                                
                                $(resbody).append(row);
                            }
                        }
                    });
                }
            }
        }else{
            alert("Lo sentimos, necesitas tener una conexión a internet para usar el generador")
        }
    }
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
