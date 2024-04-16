var appConfig = {
    version: "3.1.0",
    buildId: ".1510",
    appUrl:"http://dunizb.b0.upaiyun.com/demo/app/myCalc-3.1.0.apk",
};

window.onload = function(){
    clickFunc();
};

function clickFunc(){
    var container = document.getElementById("container");
    var calc = document.getElementById("calc"),
        spans = document.getElementById("win-tool").getElementsByTagName("span"),
        equals = document.getElementById("equals"),     
        remove = document.getElementById("remove");     

    var close = document.getElementById("close"),       
        max = document.getElementById("max"),           
        resize = document.getElementById("resize");         

    var resultDiv = document.getElementById("result");

    var historyBox = document.getElementById("historyBox"),
        delBtn = historyBox.querySelector(".remove a");
    var historyUl = historyBox.querySelector("ul");

    max.onmouseover = close.onmouseover = function(){
        this.innerHTML = this.dataset.ico;
    };
    max.onmouseout = close.onmouseout = function(){
        this.innerHTML = "&nbsp;";
    };


    close.onclick = function(e){
        var h = calc.offsetHeight + 15;
        calc.style.webkitTransform = "translateY("+ h+"px)";
        calc.style.transform = "translateY("+ h+"px)";
        e.stopPropagation();
    };
    
    resize.onclick = function(e){
        e = e || window.event;
        movePosition("left");
        e.stopPropagation();
    };
    

    max.onclick = function(){
        maxCalc();
    };
    function maxCalc(){
        var that = this;
        var spans = document.querySelectorAll("#bottom .row");
        if(container.classList.contains("flexbox")){
            container.classList.remove("flexbox");
            calc.classList.remove("maxCalc");
            for(var i=0; i<spans.length; i++){
                spans[i].classList.remove("mb");
            }
            document.getElementsByTagName("html")[0].classList.remove("maxhtml");
            that.dataset["ico"] = "Fechar";
            that.title = "Maximizar";
        }else{         
            container.classList.add("flexbox");
            calc.classList.add("maxCalc");
            for(var i=0; i<spans.length; i++){
                spans[i].classList.add("mb");
            }
            document.getElementsByTagName("html")[0].classList.add("maxhtml");
            that.dataset["ico"] = "※";
            that.title = "Restaurar Tamanho";
        }
        isResOverflow("max");
    }

    var keyBorders = document.querySelectorAll("#bottom span"),
        express = document.getElementById("express"),
        res =  document.getElementById("res"),  
        keyBorde = null;       
    var preKey = "",            
        isFromHistory = false;  
    var symbol = {"+":"+","-":"-","×":"*","÷":"/","%":"%","=":"="};

    for(var j=0; j <keyBorders.length; j++){
        keyBorde = keyBorders[j];

        keyBorde.onclick = function() {
            var number = this.dataset["number"];
            clickNumber(number);
        };
    }
    
    function clickNumber(number){
        var resVal = res.innerHTML;      
        var exp = express.innerHTML;   
        var expressEndSymbol = exp.substring(exp.length-1,exp.length);
        if(number !== "←" || number !== "C"){
            var hasPoint = (resVal.indexOf('.') !== -1)?true:false;
            if(hasPoint && number === '.'){
                if(symbol[preKey]){
                    res.innerHTML = "0";
                }else{
                    return false;
                }
            }
            if(isNaN(number)){
                number = number.replace(/\*/g,"×").replace(/\//g,"÷");
            }
            if(!symbol[number] && isResOverflow(resVal.length+1)){
                return false;
            }
            if(symbol[number]){
                if(preKey !== "=" && symbol[preKey]){
                    express.innerHTML = exp.slice(0,-1) + number;
                }else{
                    if(exp == ""){
                        express.innerHTML = resVal + number;
                    }else{
                        express.innerHTML += resVal + number;
                    }
                    if(symbol[expressEndSymbol]){
                        exp = express.innerHTML.replace(/×/g,"*").replace(/÷/,"/");
                        res.innerHTML = eval(exp.slice(0,-1));
                    }
                }                  
            }else{
                if((symbol[number] || symbol[preKey] || resVal=="0") && number !== '.'){
                    res.innerHTML = "";
                }
                res.innerHTML += number;
            }
            preKey = number;
        }
    }

    equals.onclick = function(){
        calcEques();
    };
    
    function calcEques(){
        var expVal = express.innerHTML, val = "";
        var resVal = res.innerHTML;
        if(expVal){
            var expressEndSymbol = expVal.substring(expVal.length-1,expVal.length);
            try{
                if(!isFromHistory){
                    var temp = "";
                    if(symbol[expressEndSymbol] && resVal){
                        temp = expVal.replace(/×/g,"*").replace(/÷/,"/");
                        temp = eval(temp.slice(0,-1)) + symbol[expressEndSymbol] + resVal;
                    }else{
                        temp = expVal.replace(/×/g,"*").replace(/÷/,"/");
                    }
                    val = eval(temp);
                }else{
                    val = resVal;
                }
            }catch(error){
                val = "<span

 style='font-size:1em;color:red'>Erro: Erro ao calcular!</span>";
            }finally{
                express.innerHTML = "";
                res.innerHTML = val;
                preKey = "=";
                saveCalcHistory(expVal+resVal+"="+val);
                isResOverflow(resVal.length);
                isFromHistory = false;
            }
        }
    }
    
    
    $(equals).on("longTap",function(){
        var num = res.innerHTML;
        if(num && num !== "0"){
            var regx = /^1[0-9]{2}[0-9]{8}$/;
            if(regx.test(num)){
                var telPhone = document.getElementById("telPhone");
                telPhone.href = "tel:"+num;
                telPhone.target = "_blank";
                telPhone.click();
            }
        }
    });
    


    var resetBtn = document.getElementById("reset");       
    resetBtn.onclick = function(){
        res.innerHTML = "0";
        express.innerHTML = "";
    };

    remove.onclick = function(){
        var tempRes = res.innerHTML;
        if(tempRes.length>1){
            tempRes = tempRes.slice(0,-1);
            res.innerHTML = tempRes;
        }else{
            res.innerHTML = 0;
        }
    };

    var history = document.getElementById("history"),
        historyBox = document.getElementById("historyBox");
    var about = document.getElementById("about");
    about.onclick = history.onclick = function(e){
        e = e || window.event;
        var target = e.target.id || window.event.srcElement.id;

        historyBox.style.webkitTransform = "none";
        historyBox.style.transform = "none";
        e.stopPropagation();
        if(target == "h"){
            delBtn.style.display = "inline-block";
            
            var keyArray = Mybry.wdb.getKeyArray();
            var separate = Mybry.wdb.constant.SEPARATE;
            keyArray.sort(function(a,b){
                var n = a.split(separate)[1];
                var m = b.split(separate)[1];
                return m - n;
            });
            var html = [],val = "";
            for(var i=0; i<keyArray.length; i++){
                val = Mybry.wdb.getItem(keyArray[i]);
                html.push("<li>"+val+"</li>");
            }
            if(html.length>0){
                historyUl.innerHTML = html.join("");
            }else{
                historyUl.innerHTML = "Sem histórico disponível";
            }

            var hLis = historyUl.querySelectorAll("li");
            for(var i=0; i<hLis.length; i++){
                hLis[i].onclick = function(){
                    var express = this.innerHTML;
                    var exp = express.split("=")[0],
                        res = express.split("=")[1];
                    resultDiv.querySelector("#express").innerHTML = exp;
                    resultDiv.querySelector("#res").innerHTML = res;
                    isFromHistory = true;
                };
            }
        }
        if(target == "au"){
            delBtn.style.display = "none";
            historyBox.children[0].children[0].innerHTML = "<div style='padding:5px;color:#000;'>"
                + "<p><i class='iconfont'>&#xe608;</i> Escrito puramente em HTML, CSS, JS</p>"
                + "<p><i class='iconfont'>&#xe608;</i> O layout desta calculadora usa layout CSS3 FlexBox</p>"
                + "<p><i class='iconfont'>&#xe608;</i> O aplicativo móvel foi construído usando HBuild</p>"
                + "<p><i class='iconfont'>&#xe608;</i> No aplicativo, após inserir um número de telefone, pressionar e segurar o sinal de igual permite discar o número de telefone</p>"
                + "<p><i class='iconfont'>&#xe608;</i> No aplicativo, deslizar para a esquerda ou direita permite alternar para o modo de uma mão</p>"
                + "<p><i class='iconfont'>&#xe601;</i> Autor/ID na rede: dunizb</p>"
                + "<p><i class='iconfont'>&#xe605;</i> QQ: 1438010826, Email: dunizb@foxmail.com</p>"
                + "<p id='updateApp'><i class='iconfont updateAppIcon'>&#xe604;</i> Verificar nova versão</p>"
                + "<p id='downloadApp'><a href='"+ appConfig.appUrl +"' target='_blank'>Clique para baixar o aplicativo Android</a></p>"
                + "<p><i class='iconfont build'>&#xe60f;</i> Build "+ appConfig.buildId +". Versão："+ appConfig.version +"</p>"
                + "</div>";
            
            updateApp();    
        }
    };

    window.onclick = function(e){
        var e = e || window.event;
        var target = e.target.className || e.target.nodeName;
        var notTarget =  {"con":"con","remove":"remove","UL":"UL","P":"P"};
        if(!notTarget[target]){
            var ts = historyBox.style.transform || historyBox.style.webkitTransform;
            if(ts && ts == "none"){
                historyBox.style.webkitTransform = "translateY(102%)";
                historyBox.style.transform = "translateY(102%)";
            }
        }
    };

    delBtn.onclick = function(e){
        var e = e || window.event;
        e.stopPropagation();
        if(Mybry.wdb.deleteItem("*")){
            historyUl.innerHTML = "Sem histórico disponível";
        }
    };

    
    function saveCalcHistory(val){
        var key = Mybry.wdb.constant.TABLE_NAME + Mybry.wdb.constant.SEPARATE + Mybry.wdb.getId();
        window.localStorage.setItem(key,val);
    }

    function isResOverflow(leng){
        var calc = document.getElementById("calc");
        var w = calc.style.width || getComputedStyle(calc).width || calc.currentStyle.width;
            w = parseInt(w);

        if((Mybry.browser.versions.android || Mybry.browser.versions.iPhone || Mybry.browser.versions.iPad) && !symbol[preKey]) {
            if(leng > 15){
                return true;
            }
        }else{
            if(leng > 10){
                if(w == 300) {
                    maxCalc();
                }else{
                    if(leng > 16){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    singleModel();
}

function updateApp(){
    var updateApp = document.getElementById("updateApp");
    updateApp.onclick = function(){
        var _this = this;
        $.ajax({
            type:'get',
            url:'http://duni.sinaapp.com/demo/app.php?jsoncallback=?',
            dataType:'jsonp',
            beforeSend : function(){
                _this.innerHTML = "<i class='iconfont updateAppIcon updateAppIconRotate'>&#xe604;</i> Verificando nova versão...";
            },
            success:function(data){
                var newVer = data[0].version;
                if(newVer > appConfig.version){
                    var log = data[0].log;
                    var downloadUrl

 = data[0].downloadUrl;
                    if(confirm("Verificou uma nova versão【"+newVer+"】. Deseja baixá-la agora?\n Registo de atualização:\n " + log)){
                        var a = document.getElementById("telPhone");
                        a.href = downloadUrl;
                        a.target = "_blank";
                        a.click();
                    }
                }else{
                    alert("Você já está usando a versão mais recente!");
                }
                _this.innerHTML = "<i class='iconfont updateAppIcon'>&#xe604;</i> Verificar nova versão";
            },
            error:function(msg){
                _this.innerHTML = "<i class='iconfont updateAppIcon'>&#xe604;</i> Verificar nova versão";
                alert("Falha ao verificar: "+msg.message);
            }
        });
    }
}

function singleModel(){
    var calc = document.getElementById("calc");
    var startX = 0,moveX = 0,distanceX = 0;
    var distance = 100;   
    var width = calc.offsetWidth;

    calc.addEventListener("touchstart",function(e){
        startX = e.touches[0].clientX;
    });
    calc.addEventListener("touchmove",function(e){
        moveX = e.touches[0].clientX;
        distanceX = moveX - startX;
        isMove = true;
    });
    window.addEventListener("touchend",function(e){
        if(Math.abs(distanceX) > width/3 && isMove){
            if( distanceX > 0 ){
                positionFun("right");
            }else{
                positionFun("left");
            }
        }
        startY = moveY = 0;
        isMove = false;
    });    
}

function movePosition( posi ){
    var telPhone = document.getElementById("telPhone");
    var flag = telPhone.dataset.flag;
    var styles = calc.getAttribute("style");
    
    if(flag){
        if(styles){
            var w = styles.split(";")[0].split(":")[1];
            if(w == "80%"){
                calc.setAttribute("style","width: 100%; height: 100%; position: absolute;left: 0px; bottom: 0px;");
            }
        }
        if(posi === "left"){
            calc.setAttribute("style","width: 100%; height: 100%; position: absolute;left: 0px; bottom: 0px;");
        }else{
            calc.setAttribute("style","width: 80%; height: 70%; position: absolute;right: 0px; bottom: 0px;");
        }
        document.getElementById("result").style.minHeight = "90px";
        document.getElementById("res").style.fontSize = "4.5rem";
        telPhone.dataset.flag = "";
    }else{
        positionFun(posi);
    }
}

function positionFun(postion){
    if(postion === "left"){
        calc.setAttribute("style","width: 80%; height: 70%; position: absolute;left: 0px; bottom: 0px;");
    }else{
        calc.setAttribute("style","width: 80%; height: 70%; position: absolute;right: 0px; bottom: 0px;");
    }
    document.getElementById("result").style.minHeight = "0";
    document.getElementById("res").style.fontSize = "3.5rem";
    telPhone.dataset.flag = "yes";
}
