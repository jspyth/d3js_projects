/**
 * Created by DELL on 2016/10/16.
 */
var width = 1350,height = 700;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(
    d3.behavior.zoom()
        .scaleExtent([1,10])
        .on("zoom",zoom)
)
    .append("g");
//zoom是定义缩放事件的
function zoom(){
    svg.attr("transform","translate("+d3.event.translate+")scale("+d3.event.scale+")");
}

var force = d3.layout.force()
    .gravity(0.04)
    .distance(80)
    .charge(-200)
    .size([width, height]);



var label_text_1 = svg.append("text")
    .attr("class","labeltext")
    .attr("x",10)
    .attr("y",16)
    .text("");

var label_text_2 = svg.append("text")
    .attr("class","labeltext")
    .attr("x",10)
    .attr("y",40)
    .text("");


d3.json("information2.json", function(error, json) {
    if (error){throw error;}

    force
        .nodes(json.nodes)
        .links(json.links)
        .start();

    link = svg.selectAll(".link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("id",function(d){
            return d.value;
        });


    node=svg.selectAll(".node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    node.append("circle")
        .attr("r",15)
        .attr("Id",function(d){
            return d.Id;
        })
        .attr("result",function(d){
            return d.degree;
        })
        .style("fill", function(d){
            if(d.picture=="book"){
                return "yellow";
            }
            else{
                return "green";
            }
        });




    var drag = force.drag()
        .on("dragstart", function (d, i) {
            d.fixed = true;    //拖拽开始后设定被拖拽对象为固定
            label_text_2.text("");
        })
        .on("dragend", function (d, i) {
            label_text_2.text("");
        })
        .on("drag", function (d, i) {
            label_text_2.text("");
        });

    node.append("text")
        .attr("dx", -5)//dx值可以调节text文本相对与圆点circle的位置
        .attr("dy", ".35em")
        .attr("degree",function(d){
            return d.degree;
        })
        .attr("cc",function(d){
            return d.result_cc;
        })
        .attr("bc",function(d){
            return d.result_bc;
        })
        .attr("slc",function(d){
            return d.result_slc;
        })
        .text(function (d) {
            return d.name;
        })
        .on("mouseover", function (d, i) {
            d3.select(this)
                .style("font-size", "28px")
                .style("fill", "blue")
                .style("opacity","2.0");
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
                .style("fill", "blue")
                .style("pointer-events", "auto")
                .style("font", "10px sans-serif")
                .style("opacity","0.0");
        })
        .on("dblclick", function (d, i) {
            d.fixed = false;
        })
        .call(drag);

    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });

    n1.onblur = function () {//onblur是当元素id为n1的对象失去焦点时触发操作
        var x = document.getElementById("n1").value;
        var data = document.getElementsByTagName("text");//text标签保存在数组中
        var Circle = document.getElementsByTagName("circle");
        /***********选中和input输入框匹配的text元素并高亮************/
        for (var i = 0; i < data.length; i++) {
            if (data[i].innerHTML == x) {
                data[i].style.fill = "red";
                data[i].style.fontSize = "48px";
                Circle[i-2].style.fill = "blue";
                Circle[i-2].setAttribute("r","30");
                break;
            }
        }
    };

/*******创建degree_num数组保存json文件中的degree指标数据******/
    var degree_num = [];
    for(var k1 = 0;k1 < json.nodes.length;k1++){
        degree_num.push(json.nodes[k1].degree);
    }

    /*****下面是对数组进行排序操作****/
    degree_num.sort(function sortArr(m,n){//sort中的参数必须是函数，没有这个函数数组会按字符方式排序
        return m-n;
    }).reverse();//sort:升序排序 reverse:降序排序
    var r_scale = d3.scale.linear()
        .domain([0,7])
        .range([15,65]);
    n2.onblur = function () {
        var All_text = document.getElementsByTagName("text");
        var All_Circle = document.getElementsByTagName("circle");
        var y = document.getElementById("n2").value;
        var All_line = document.getElementsByTagName("line");

        /*****函数功能：获得top几里的最小的那个指标值在top几中的个数*****/
        function Get_min_num(str1){
            number = 1;//最少为一个
            for(var stc = 2;stc <str1+1;stc++){//将top几中的最后一个值与前面的值做比较
                if(degree_num[str1-1] == degree_num[str1-stc]){
                    number++;
                }
                else{
                    break;
                }
            }
        }
        var b = parseInt(y);//输入框输入的数字
        var xc = 0;
        var ccc = 0;
        var circle_highlight_id = [];//top几的结点对应的id
        var circle_id_second = [];//第二层结点的id
        Get_min_num(b);//执行函数

        /*数组去重函数*/
        function unique(arr) {
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        }

        /*******遍历所有节点，把符合条件的节点高亮出来******/
        for (var s = 0; s < All_text.length; s++) {
            ccc = ccc + 1;
            var a = parseInt(All_text[s + 2].getAttribute('degree'));
            if (a >= degree_num[b-1]) { //当指标值大于等于top几中的最小值
                if (a == degree_num[b - 1]) {//当指标值等于top几中的最小值
                    xc = xc + 1;
                    if (xc <= number) {//top几中的最小值只取number个
                        var c1 = parseInt(All_Circle[s].getAttribute("Id"));
                        All_text[s + 2].style.fill = "black";
                        All_text[s + 2].style.fontSize = "28px";
                        All_text[s + 2].style.opacity = 2.0;
                        All_Circle[s].style.fill = "blue";
                        All_Circle[s].setAttribute("r","30");
                        circle_highlight_id.push(c1);
                    }
                }
                else{//指标值大于top几中最小值的节点
                    var c2 = parseInt(All_Circle[s].getAttribute("Id"));
                    All_text[s + 2].style.fill = "black";
                    All_text[s + 2].style.fontSize = "28px";
                    All_text[s + 2].style.opacity = 2.0;
                    All_Circle[s].style.fill = "blue";
                    All_Circle[s].setAttribute("r","30");
                    circle_highlight_id.push(c2);
                }
            }

            /*******高亮三层子图模块********/
            for(var j2 = 0;j2 < b;j2++){
                for(var j3 = 0;j3 < json.links.length;j3++) {
                    var d1 = parseInt(json.links[j3].source.Id);
                    var d2 = parseInt(circle_highlight_id[j2]);
                    var d3 = parseInt(json.links[j3].target.Id);
                    /*****第二层边*****/
                    if (d1 == d2) {//边的source值和结点id相同
                        All_line[j3].style.stroke = "blue";
                        circle_id_second.push(d3);
                    }
                    if (d3 == d2) {//边的target值和结点id相同
                        All_line[j3].style.stroke = "blue";
                        circle_id_second.push(d1);
                    }
                }
            }
            var id_num = 71;//数据文件的结点数量
            var another = [];//用来保存去重后的circle_id_second数组
            var all_hl_circle = [];//用来保存所有被高亮的结点,未去重
            var all_hl_circle2 = [];
            another = unique(circle_id_second);
            if(ccc == id_num){//对应最外层的循环次数最大值时another数组的长度值也最大
               var bbb = another.length;
                if(another.length == bbb){
                    for(var j4 = 0;j4 < json.links.length;j4++) {
                        var d5 = parseInt(json.links[j4].source.Id);
                        var d6 = parseInt(json.links[j4].target.Id);
                        for (var xxx = 0; xxx < another.length; xxx++) {
                            var d7 = parseInt(another[xxx]);
                            if ((d5 == d7) || (d6 == d7)) {//对高亮的边添加属性
                                All_line[j4].setAttribute('choose_line','h_l');
                                if(d5 == d7) {
                                    all_hl_circle.push(another[xxx]);
                                    all_hl_circle.push(d6);
                                }
                                else if(d6 == d7){
                                    all_hl_circle.push(another[xxx]);
                                    all_hl_circle.push(d5);
                                }
                            }
                        }
                    }
                    /*隐藏不被高亮的结点*/
                    all_hl_circle2 = unique(all_hl_circle);//获得去重后的被高亮结点id
                    for(var point = 0;point < json.nodes.length;point++){
                        var value1 = point;
                        var nu = 0;
                        for(var jie = 0;jie < all_hl_circle2.length;jie++){
                            if(value1 != all_hl_circle2[jie]){
                                nu++;
                                if(nu == all_hl_circle2.length){
                                    All_Circle[point].style.opacity = 0;
                                    All_text[point + 2].setAttribute('u_choose_text','u_l');
                                    All_Circle[point].setAttribute('u_choose_circle','u_l')
                                }
                                else{
                                    continue;
                                }
                            }
                        }
                    }


                    /******将要高亮的边高亮，要隐藏的边隐藏****/
                    for(var j5 = 0;j5 < json.links.length;j5++) {
                        var value = All_line[j5].getAttribute('choose_line');
                        if(value == 'h_l'){
                            All_line[j5].style.stroke = "blue";
                        }
                        else{
                            All_line[j5].style.stroke = "cyan";
                            All_line[j5].setAttribute('u_choose_line','u_l');
                        }
                    }
                    $(document).ready(function(){
                        $("button").click(function(){
                            $("[u_choose_circle='u_l']").remove();//去除多余的圆
                            $("[u_choose_text='u_l']").remove();//去除多余的文本
                            $("[u_choose_line='u_l']").remove();//去除多余的边
                        });
                    });
                }
            }
        }
    };

/*******创建cc_num数组保存json文件中的cc指标数据******/
    var cc_num = [];
    for(var k2 = 0;k2 < json.nodes.length;k2++){
        cc_num.push(json.nodes[k2].result_cc);
    }

    /*****下面是对数组进行排序操作****/
    cc_num.sort(function sortArr(m,n){//sort中的参数必须是函数，没有这个函数数组会按字符方式排序
        return m-n;
    }).reverse();//sort:升序排序 reverse:降序排序
    //alert(cc_num);

    n3.onblur = function (){
        var All_text = document.getElementsByTagName("text");
        var All_Circle = document.getElementsByTagName("circle");
        var y = document.getElementById("n3").value;
        var All_line = document.getElementsByTagName("line");

        /*****函数功能：获得top几里的最小的那个指标值在top几中的个数*****/
        function Get_min_num(str1){
            number = 1;//最少为一个
            for(var stc = 2;stc <str1+1;stc++){//将top几中的最后一个值与前面的值做比较
                if(cc_num[str1-1] == cc_num[str1-stc]){
                    number++;
                }
                else{
                    break;
                }
            }
        }

        var b = parseInt(y);//输入框输入的数字
        var xc = 0;
        var ccc = 0;
        var circle_highlight_id = [];//top几的结点对应的id
        var circle_id_second = [];//第二层结点的id
        Get_min_num(b);//执行函数

        /*数组去重函数*/
        function unique(arr) {
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        }

        /*******遍历所有节点，把符合条件的节点高亮出来******/
        for (var s = 0; s < All_text.length; s++) {
            ccc = ccc + 1;
            var a = parseFloat(All_text[s + 2].getAttribute("cc"));
            if (a >= cc_num[b-1]) { //当指标值大于等于top几中的最小值
                if(a == cc_num[b-1]){//当指标值等于top几中的最小值
                    xc = xc + 1;
                    if(xc <= number) {//top几中的最小值只取number个
                        var c1 = parseInt(All_Circle[s].getAttribute("Id"));
                        All_text[s + 2].style.fill = "black";
                        All_text[s + 2].style.fontSize = "28px";
                        All_text[s + 2].style.opacity = 2.0;
                        All_Circle[s].style.fill = "blue";
                        All_Circle[s].setAttribute("r","30");
                        circle_highlight_id.push(c1);
                    }
                }
                else{//指标值大于top几中最小值的节点
                    var c2 = parseInt(All_Circle[s].getAttribute("Id"));
                    All_text[s + 2].style.fill = "black";
                    All_text[s + 2].style.fontSize = "28px";
                    All_text[s + 2].style.opacity = 2.0;
                    All_Circle[s].style.fill = "blue";
                    All_Circle[s].setAttribute("r","30");
                    circle_highlight_id.push(c2);
                }
            }
            /*******高亮三层子图模块********/
            for(var j2 = 0;j2 < b;j2++){
                for(var j3 = 0;j3 < json.links.length;j3++) {
                    var d1 = parseInt(json.links[j3].source.Id);
                    var d2 = parseInt(circle_highlight_id[j2]);
                    var d3 = parseInt(json.links[j3].target.Id);
                    /*****第二层边*****/
                    if (d1 == d2) {//边的source值和结点id相同
                        All_line[j3].style.stroke = "blue";
                        circle_id_second.push(d3);
                    }
                    if (d3 == d2) {//边的target值和结点id相同
                        All_line[j3].style.stroke = "blue";
                        circle_id_second.push(d1);
                    }
                }
            }
            var another = [];//用来保存去重后的circle_id_second数组
            var id_num = 71;//数据文件的结点数量
            var all_hl_circle = [];//用来保存所有被高亮的结点,未去重
            var all_hl_circle2 = [];
            another = unique(circle_id_second);
            if(ccc == id_num){//对应最外层的循环次数最大值时another数组的长度值也最大
                var bbb = another.length;
                if(another.length == bbb){
                    for(var j4 = 0;j4 < json.links.length;j4++) {
                        var d5 = parseInt(json.links[j4].source.Id);
                        var d6 = parseInt(json.links[j4].target.Id);
                        for (var xxx = 0; xxx < another.length; xxx++) {
                            var d7 = parseInt(another[xxx]);
                            if ((d5 == d7) || (d6 == d7)) {//对高亮的边添加属性
                                All_line[j4].setAttribute('choose_line','high_light');
                                if(d5 == d7) {
                                    all_hl_circle.push(another[xxx]);
                                    all_hl_circle.push(d6);
                                }
                                if(d6 == d7){
                                    all_hl_circle.push(another[xxx]);
                                    all_hl_circle.push(d5);
                                }
                            }
                        }

                    }
                    /*隐藏不被高亮的结点*/
                    all_hl_circle2 = unique(all_hl_circle);//获得去重后的被高亮结点id
                    for(var point = 0;point < json.nodes.length;point++){
                        //var value1 = parseInt(All_Circle[point].getAttribute('Id'));
                        var value1 = point;
                        var nu = 0;
                        for(var jie = 0;jie < all_hl_circle2.length;jie++){
                            console.log(all_hl_circle2[jie]);
                            if(value1 != all_hl_circle2[jie]){
                                nu++;
                                //console.log(nu);
                                if(nu == all_hl_circle2.length){
                                    All_Circle[point].style.opacity = 0;
                                    All_text[point + 2].setAttribute('u_choose_text','u_l');
                                    All_Circle[point].setAttribute('u_choose_circle','u_l')
                                }
                                else{
                                    continue;
                                }
                            }
                        }
                    }
                    /******将要高亮的边高亮，要隐藏的边隐藏****/
                    for(var j5 = 0;j5 < json.links.length;j5++) {
                        var value = All_line[j5].getAttribute('choose_line');
                        if(value == 'high_light'){
                            All_line[j5].style.stroke = "blue";
                        }
                        else{
                            All_line[j5].style.stroke = "cyan";
                            All_line[j5].setAttribute('u_choose_line','u_l');
                        }
                    }
                    $(document).ready(function(){
                        $("button").click(function(){
                            $("[u_choose_circle='u_l']").remove();//去除多余的圆
                            $("[u_choose_text='u_l']").remove();//去除多余的文本
                            $("[u_choose_line='u_l']").remove();//去除多余的边
                        });
                    });
                }
            }
        }
    };

    /*******创建bc_num数组保存json文件中的bc指标数据******/
    var bc_num = [];
    for(var k3 = 0;k3 < json.nodes.length;k3++){
        bc_num.push(json.nodes[k3].result_bc);
    }

    /*****下面是对数组进行排序操作****/
    bc_num.sort(function sortArr(m,n){//sort中的参数必须是函数，没有这个函数数组会按字符方式排序
        return m-n;
    }).reverse();//sort:升序排序 reverse:降序排序

    n4.onblur = function () {
        var All_text = document.getElementsByTagName("text");
        var All_Circle = document.getElementsByTagName("circle");
        var y = document.getElementById("n4").value;
        var All_line = document.getElementsByTagName("line");

        /*****函数功能：获得top几里的最小的那个指标值在top几中的个数*****/
        function Get_min_num(str1) {
            number = 1;//最少为一个
            for (var stc = 2; stc < str1 + 1; stc++) {//将top几中的最后一个值与前面的值做比较
                if (bc_num[str1 - 1] == bc_num[str1 - stc]) {
                    number++;
                }
                else {
                    break;
                }
            }
        }

        var b = parseInt(y);//输入框输入的数字
        var xc = 0;
        var ccc = 0;
        var circle_highlight_id = [];//top几的结点对应的id
        var circle_id_second = [];//第二层结点的id
        Get_min_num(b);//执行函数

        /*数组去重函数*/
        function unique(arr) {
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        }

        /*******遍历所有节点，把符合条件的节点高亮出来******/
        for (var s = 0; s < All_text.length; s++) {
            ccc = ccc + 1;
            var a = parseInt(All_text[s + 2].getAttribute("bc"));
            if (a >= bc_num[b - 1]) { //当指标值大于等于top几中的最小值
                if (a == bc_num[b - 1]) {//当指标值等于top几中的最小值
                    xc = xc + 1;
                    if (xc <= number) {//top几中的最小值只取number个
                        var c1 = parseInt(All_Circle[s].getAttribute("Id"));
                        All_text[s + 2].style.fill = "black";
                        All_text[s + 2].style.fontSize = "28px";
                        All_text[s + 2].style.opacity = 2.0;
                        All_Circle[s].style.fill = "blue";
                        All_Circle[s].setAttribute("r","30");
                        circle_highlight_id.push(c1);
                    }
                }
                else {//指标值大于top几中最小值的节点
                    var c2 = parseInt(All_Circle[s].getAttribute("Id"));
                    All_text[s + 2].style.fill = "black";
                    All_text[s + 2].style.fontSize = "28px";
                    All_text[s + 2].style.opacity = 2.0;
                    All_Circle[s].style.fill = "blue";
                    All_Circle[s].setAttribute("r","30");
                    circle_highlight_id.push(c2);
                }
            }
            /*******高亮三层子图模块********/
            for(var j2 = 0;j2 < b;j2++){
                for(var j3 = 0;j3 < json.links.length;j3++) {
                    var d1 = parseInt(json.links[j3].source.Id);
                    var d2 = parseInt(circle_highlight_id[j2]);
                    var d3 = parseInt(json.links[j3].target.Id);
                    /*****第二层边*****/
                    if (d1 == d2) {//边的source值和结点id相同
                        All_line[j3].style.stroke = "blue";
                        circle_id_second.push(d3);
                    }
                    if (d3 == d2) {//边的target值和结点id相同
                        All_line[j3].style.stroke = "blue";
                        circle_id_second.push(d1);
                    }
                }
            }
            var another = [];//用来保存去重后的circle_id_second数组
            var id_num = 71;//数据文件的结点数量
            var all_hl_circle = [];//用来保存所有被高亮的结点,未去重
            var all_hl_circle2 = [];
            another = unique(circle_id_second);
            if(ccc == id_num){//对应最外层的循环次数最大值时another数组的长度值也最大
                var bbb = another.length;
                if(another.length == bbb){
                    for(var j4 = 0;j4 < json.links.length;j4++) {
                        var d5 = parseInt(json.links[j4].source.Id);
                        var d6 = parseInt(json.links[j4].target.Id);
                        for (var xxx = 0; xxx < another.length; xxx++) {
                            var d7 = parseInt(another[xxx]);
                            if ((d5 == d7) || (d6 == d7)) {//对高亮的边添加属性
                                All_line[j4].setAttribute('choose_line','high_light');
                                if(d5 == d7) {
                                    all_hl_circle.push(another[xxx]);
                                    all_hl_circle.push(d6);
                                }
                                if(d6 == d7){
                                    all_hl_circle.push(another[xxx]);
                                    all_hl_circle.push(d5);
                                }
                            }
                        }

                    }
                    /*隐藏不被高亮的结点*/
                    all_hl_circle2 = unique(all_hl_circle);//获得去重后的被高亮结点id
                    for(var point = 0;point < json.nodes.length;point++){
                        //var value1 = parseInt(All_Circle[point].getAttribute('Id'));
                        var value1 = point;
                        var nu = 0;
                        for(var jie = 0;jie < all_hl_circle2.length;jie++){
                            console.log(all_hl_circle2[jie]);
                            if(value1 != all_hl_circle2[jie]){
                                nu++;
                                //console.log(nu);
                                if(nu == all_hl_circle2.length){
                                    All_Circle[point].style.opacity = 0;
                                    All_text[point + 2].setAttribute('u_choose_text','u_l');
                                    All_Circle[point].setAttribute('u_choose_circle','u_l')
                                }
                                else{
                                    continue;
                                }
                            }
                        }
                    }
                    /******将要高亮的边高亮，要隐藏的边隐藏****/
                    for(var j5 = 0;j5 < json.links.length;j5++) {
                        var value = All_line[j5].getAttribute('choose_line');
                        if(value == 'high_light'){
                            All_line[j5].style.stroke = "blue";
                        }
                        else{
                            All_line[j5].style.stroke = "cyan";
                            All_line[j5].setAttribute('u_choose_line','u_l');
                        }
                    }
                    $(document).ready(function(){
                        $("button").click(function(){
                            $("[u_choose_circle='u_l']").remove();//去除多余的圆
                            $("[u_choose_text='u_l']").remove();//去除多余的文本
                            $("[u_choose_line='u_l']").remove();//去除多余的边
                        });
                    });
                }
            }
        }
    };

    /*******创建slc_num数组保存json文件中的slc指标数据******/
    var slc_num = [];
    for(var k4 = 0;k4 < json.nodes.length;k4++){
        slc_num.push(json.nodes[k4].result_slc);
    }

    /*****下面是对数组进行排序操作****/
    slc_num.sort(function sortArr(m,n){//sort中的参数必须是函数，没有这个函数数组会按字符方式排序
        return m-n;
    }).reverse();//sort:升序排序 reverse:降序排序

    n5.onblur = function () {
        var All_text = document.getElementsByTagName("text");
        var All_Circle = document.getElementsByTagName("circle");
        var y = document.getElementById("n5").value;
        var All_line = document.getElementsByTagName("line");

        /*****函数功能：获得top几里的最小的那个指标值在top几中的个数*****/
        function Get_min_num(str1){
            number = 1;//最少为一个
            for(var stc = 2;stc <str1+1;stc++){//将top几中的最后一个值与前面的值做比较
                if(slc_num[str1-1] == slc_num[str1-stc]){
                    number++;
                }
                else{
                    break;
                }
            }
        }
        var b = parseInt(y);//输入框输入的数字
        var xc = 0;
        var ccc = 0;
        var circle_highlight_id = [];//top几的结点对应的id
        var circle_id_second = [];//第二层结点的id
        Get_min_num(b);//执行函数

        /*数组去重函数*/
        function unique(arr) {
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        }

        /*******遍历所有节点，把符合条件的节点高亮出来******/
        for (var s = 0; s < All_text.length; s++) {
            ccc = ccc + 1;
            var a = parseInt(All_text[s + 2].getAttribute("slc"));
            if (a >= slc_num[b-1]) { //当指标值大于等于top几中的最小值
                if(a == slc_num[b-1]){//当指标值等于top几中的最小值
                    xc = xc + 1;
                    if(xc <= number) {//top几中的最小值只取number个
                        var c1 = parseInt(All_Circle[s].getAttribute("Id"));
                        All_text[s + 2].style.fill = "black";
                        All_text[s + 2].style.fontSize = "28px";
                        All_text[s + 2].style.opacity = 2.0;
                        All_Circle[s].style.fill = "blue";
                        All_Circle[s].setAttribute("r","30");
                        circle_highlight_id.push(c1);
                    }
                }
                else{//指标值大于top几中最小值的节点
                    var c2 = parseInt(All_Circle[s].getAttribute("Id"));
                    All_text[s + 2].style.fill = "black";
                    All_text[s + 2].style.fontSize = "28px";
                    All_text[s + 2].style.opacity = 2.0;
                    All_Circle[s].style.fill = "blue";
                    All_Circle[s].setAttribute("r","30");
                    circle_highlight_id.push(c2);
                }
            }
            /*******高亮三层子图模块********/
            for(var j2 = 0;j2 < b;j2++){
                for(var j3 = 0;j3 < json.links.length;j3++) {
                    var d1 = parseInt(json.links[j3].source.Id);
                    var d2 = parseInt(circle_highlight_id[j2]);
                    var d3 = parseInt(json.links[j3].target.Id);
                    /*****第二层边*****/
                    if (d1 == d2) {//边的source值和结点id相同
                        All_line[j3].style.stroke = "blue";
                        circle_id_second.push(d3);
                    }
                    if (d3 == d2) {//边的target值和结点id相同
                        All_line[j3].style.stroke = "blue";
                        circle_id_second.push(d1);
                    }
                }
            }
            var another = [];//用来保存去重后的circle_id_second数组
            var id_num = 71;//数据文件的结点数量
            var all_hl_circle = [];//用来保存所有被高亮的结点,未去重
            var all_hl_circle2 = [];
            another = unique(circle_id_second);
            if(ccc == id_num){//对应最外层的循环次数最大值时another数组的长度值也最大
                var bbb = another.length;
                if(another.length == bbb){
                    for(var j4 = 0;j4 < json.links.length;j4++) {
                        var d5 = parseInt(json.links[j4].source.Id);
                        var d6 = parseInt(json.links[j4].target.Id);
                        for (var xxx = 0; xxx < another.length; xxx++) {
                            var d7 = parseInt(another[xxx]);
                            if ((d5 == d7) || (d6 == d7)) {//对高亮的边添加属性
                                All_line[j4].setAttribute('choose_line','high_light');
                                if(d5 == d7) {
                                    all_hl_circle.push(another[xxx]);
                                    all_hl_circle.push(d6);
                                }
                                if(d6 == d7){
                                    all_hl_circle.push(another[xxx]);
                                    all_hl_circle.push(d5);
                                }
                            }
                        }

                    }
                    /*隐藏不被高亮的结点*/
                    all_hl_circle2 = unique(all_hl_circle);//获得去重后的被高亮结点id
                    for(var point = 0;point < json.nodes.length;point++){
                        //var value1 = parseInt(All_Circle[point].getAttribute('Id'));
                        var value1 = point;
                        var nu = 0;
                        for(var jie = 0;jie < all_hl_circle2.length;jie++){
                            console.log(all_hl_circle2[jie]);
                            if(value1 != all_hl_circle2[jie]){
                                nu++;
                                //console.log(nu);
                                if(nu == all_hl_circle2.length){
                                    All_Circle[point].style.opacity = 0;
                                    All_text[point + 2].setAttribute('u_choose_text','u_l');
                                    All_Circle[point].setAttribute('u_choose_circle','u_l')
                                }
                                else{
                                    continue;
                                }
                            }
                        }
                    }
                    /******将要高亮的边高亮，要隐藏的边隐藏****/
                    for(var j5 = 0;j5 < json.links.length;j5++) {
                        var value = All_line[j5].getAttribute('choose_line');
                        if(value == 'high_light'){
                            All_line[j5].style.stroke = "blue";
                        }
                        else{
                            All_line[j5].style.stroke = "cyan";
                            All_line[j5].setAttribute('u_choose_line','u_l');
                        }
                    }
                    $(document).ready(function(){
                        $("button").click(function(){
                            $("[u_choose_circle='u_l']").remove();//去除多余的圆
                            $("[u_choose_text='u_l']").remove();//去除多余的文本
                            $("[u_choose_line='u_l']").remove();//去除多余的边
                        });
                    });
                }
            }
        }
    }
});
