// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var high_light = '#1abc9c';
var dim  = '#34495e'
/*
const net = require('net');

function communicator(){
    this.host = '127.0.0.1';
    this.port = 1025;
    this.client = new net.Socket();
    
    this.init = init;
    this.requestSpeed = requestSpeed;
    try {
        this.init();
    } catch (error) {
        console.log('连接失败');
    }
    
    function init(){
        this.client.connect(this.port, this.host, function() {
            console.log('connection success');
        });
    
        // 为客户端添加“data”事件处理函数
        // data是服务器发回的数据
        
        this.client.on('data', function(data) {
            var data = JSON.parse(data);
            switch(data.type){
                
            }
        });
        
    
        // 为客户端添加“close”事件处理函数
        this.client.on('close', function() {
            console.log('connection closed')
        });
    }
    
    function requestSpeed(){
        var package = {
            'type':0,
            'data':null
        }
    }
        

    function requestStrategy(){
        var package = {
            'type':0,
            'offset':0,
            'amount':10
        }
    }

}

var server = new communicator()
*/

function appendChildren(father, children){
    for(var i=0; i<children.length; i++){
        father.appendChild(children[i]);
    }
}
function setAttributes(element, attributes){
    for(var i=0; i<attributes.length; i++){
        element.setAttribute(attributes[i][0], attributes[i][1]);
    }
}

function DataflowIndicator(){
    this.board = document.getElementById('current_speed')
    this.gauge = document.getElementById('gauge');

    //回调函数，更新实时流量显示区
    function updateDataflowIndicator(next_data){
        if(next_data > 8){
            gauge.style.backgroundColor = 'red';
        }else if(next_data > 6){
            gauge.style.backgroundColor = 'orange';
        }else{
            gauge.style.backgroundColor = '#1abc9c';
        }
        board.innerHTML = next_data;
    }
}

function DataflowChart(){
    this.chart_moving = true;
    this.chart = echarts.init(document.getElementById('chart'), 'macarons');
    this.chart_option = {
        tooltip:{
            trigger:'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        dataZoom:[
            {
                type:'inside',
                xAxisIndex: 0,
                start: 20,
                end: 100,
            }
        ],
        xAxis: {
            type: 'category',
            data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]  //初始x轴数据
        },
        yAxis: {},
        series: [
            {
                name:'speed',
                type:'line',
                smooth:true,
                data:(function(){
                    var data = new Array()
                    for(var i=0; i<20; i++){
                    data.push(Math.random() * 10);
                    }
                    return data
                })(),
                areaStyle: {
                    normal: {}
                },
            }
        ]

    }; 
    this.chart.setOption(this.chart_option)

    this.scale = 5;
    this.scale_buttons = document.getElementsByClassName('scale_g');
    this.focus(scale_buttons[scale]);

    
    function init(){
        //初始化button
        buttons = this.scale_buttons;
        for(var i=0; i<buttons.length; i++){
            buttons[i].scale = i;
            buttons[i].dataflowChart = this;
            buttons[i].addEventListener('click', function(){
                var dataflowChart = this.dataflowChart;
                dataflowChart.onChangeScale(this);
            });
        }
    }

    function onChangeScale(ob){
        this.unfocus(scale_buttons[scale])
        this.scale = ob.scale;
        this.focus(scale_buttons[scale]);
    }

    //回调函数，更新图表
    function update_chart(next_data){
        data = this.chart_option.series[0].data;
        x = this.chart_option.xAxis.data;
        x.shift();
        x.push(x[x.length - 1] + 1);
        data.shift();
        data.push(next_data);

        if(this.chart_moving == true){
            this.chart.setOption(this.chart_option);
            this.chart_option.animation = true;
        }
        else{
            this.chart_option.animation = false;
        }
    }

    function chart_moving_shift(){
        if(this.chart_moving == false)
          this.chart_moving = true;
        else
          this.chart_moving = false
      }

    function focus(ob){
        ob.style.backgroundColor = '#33C4C5';
    }
    function unfocus(ob){
        ob.style.backgroundColor = '#34495e';
    }
}

function ViewManager(button_list_id, view_class, view_names){
    this.views = document.getElementsByClassName(view_class);
    this.button_wrapper = document.getElementById(button_list_id);
    this.view_names = view_names;

    //函数
    this.init = init;
    this.onClickViewButton = onClickViewButton;

    this.init();

    function init(){
        var view_total = (this.view_names.length < this.views.length)? this.view_names.length : this.views.length;
        for(var i=0; i<view_total; i++){
            var button = document.createElement('button');
            button.value = i;
            button.viewManager = this;
            button.innerHTML = this.view_names[i];
            button.addEventListener('click', function(){
                this.viewManager.onClickViewButton(this);
            });
            this.button_wrapper.appendChild(button);
        }
        this.active_view = this.views[0];
        this.active_button = this.button_wrapper.children[0];
        this.active_view.style.display = 'flex';
        focusButton(this.active_button)
    }

    function onClickViewButton(ob){
        if(this.active_button != ob){
            this.active_view.style.display = 'none';
            this.active_view = this.views[ob.value];
            this.active_view.style.display = 'flex'
            //this.chart.resize()
            unfocusButton(this.active_button)
            focusButton(ob);
            this.active_button = ob;
        }
            
    }

    function focusButton(ob){
        ob.style.backgroundColor = '#1abc9c';
    }
    function unfocusButton(ob){
        ob.style.backgroundColor = '#19997f';
    }
    
}

view_manager = new ViewManager("view_buttons", "user_view", ["系统状态", "流量来源", "策略管理", "click管理"]);

function FlowSourceChart(){
    this.chart = echarts.init(document.getElementById('pie_chart'));

    this.chart_option = {
    
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
    
        series : [
            {
                type:'pie',
                radius : [0, '85%'],
                center : ['50%', '50%'],
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                lableLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                data:[
                    {value:10, name:'rose1'},
                    {value:5, name:'rose2'},
                    {value:15, name:'rose3'},
                    {value:25, name:'rose4'},
                    {value:20, name:'rose5'},
                    {value:35, name:'rose6'},
                    {value:30, name:'rose7'},
                    {value:40, name:'rose8'}
                ]
            },
        ]
    };
    this.chart.setOption(chart_option)
                
}
function SourceViewStyleManager(){
    this.pie_style = document.getElementById('pie_chart_wrapper');
    this.list_style = document.getElementById('list_wrapper');
    this.active_style = list_style;

    function change_view_style(ob){
        this.active_style.style.display = "none";
        var option = ob.value;
        if(option == 'Form'){
            this.list.style.display = "flex";
            this.active_style = this.list_style;
        }
        else{
            this.pie_style.style.display = "flex";
            this.active_style = this.pie_style;
            flowSourceChart.resize();
        }
    }
}

function InteractForm(table_id, pagination_id){
    //table
    this.table_ob = document.getElementById(table_id);
    this.table_ob.setAttribute('border', '0');
    this.table_ob.setAttribute('cellspacing', '0');
    this.thead_ob = document.createElement('thead');
    this.tbody_ob = document.createElement('tbody');
    appendChildren(this.table_ob, [this.thead_ob, this.tbody_ob])
   
    //pagination
    this.pagination_ob = document.getElementById(pagination_id);
    this.last_button_ob = document.createElement('li');
    this.last_button_ob.innerHTML = '<';
    this.num_button_wrapper = document.createElement('span');
    this.next_button_ob = document.createElement('li');
    this.next_button_ob.innerHTML = '>';
    appendChildren(this.pagination_ob, [this.last_button_ob, this.num_button_wrapper, this.next_button_ob]);

    //table header data
    this.col_amount = 3;
    this.col_content = ['col1', 'col2', 'col3'];

    //table state
    //页内
    this.cp_focus = 0;
    this.cp_row_amount = 0;
    //页间
    this.cp = 0;
    this.cp_row_offset = 0;
    this.page_total = 0;

    //table attr
    this.max_per_page = 10;

    this.buff = new Array();
    this.allowEdit = false;

    //数据管理
    this.dataProvider = new Object();
    this.dataProvider.remote = null;
    this.dataProvider.form = this;
    this.dataProvider.requestPageData = function(a,b){
        //this.remote.requestData()
        var data = [[1,2,3],[1,2,3]];
        this.form.loadPage(data);
    };
    this.dataProvider.requestInitData = function(){
        this.form.init(10);
    }

    //接口函数定义
    this.generateTds = generateTds;
    this.onClickRow = onClickRow;
    this.onChangePage = onChangePage;
    this.setEditable = setEditable;

    //内部函数定义
    this.init = init;
    this.setPaginationLastNextButton = setPaginationLastNextButton;
    this.setPaginationButtonFocus = setPaginationButtonFocus;
    this.setPaginationButtonState = setPaginationButtonState;
    this.initPagination = initPagination;
    this.initThead = initThead;
    this.setPage = setPage;
    this.loadPage = loadPage;
    this.init = init;
    this.addTr = addTr;

    this.dataProvider.requestInitData();
    
    //接口
    function generateTds(row_data){
        var tds = new Array();
        for(var i=0; i<row_data.length; i++){
            var td = document.createElement('td');
            td.innerHTML = row_data[i];
            tds.push(td);
        }
        return tds;
    }
    function setEditable(flag){
        alert(flag);
        this.allowEdit = flag;
    }
    function onClickRow(ob){
        alert(ob.sn);
    }
    function onChangePage(ob){
        alert(ob.p_value);
    }
    
    

    function setPaginationLastNextButton(){
        if(this.cp == 0){
            this.last_button_ob.style.visibility = 'hidden';
        }else{
            this.last_button_ob.style.visibility = 'visible';
        }
    
        if(this.cp == this.page_total - 1){
            this.next_button_ob.style.visibility = 'hidden';
        }else{
            this.next_button_ob.style.visibility = 'visible';
        }
    }
    function setPaginationButtonFocus(focus, page_num){
        if(focus == true){
            this.num_button_wrapper.children[page_num].style.backgroundColor = '#1abc9c';
        }else{
            this.num_button_wrapper.children[page_num].style.backgroundColor = '#34495e';
        }
    }

    function setPaginationButtonState(page_num){
        this.setPaginationLastNextButton();
        this.setPaginationButtonFocus(false, this.cp);
        this.setPaginationButtonFocus(true, page_num);
    }

    function pagination_button_callback(){
        this.form.onChangePage(this);
    }

    function initPagination(){
        if(this.page_total > 1){
            //初始化控件
            this.last_button_ob.p_value = 'l';
            this.last_button_ob.form = this;
            this.last_button_ob.addEventListener('click', pagination_button_callback);
            this.next_button_ob.p_value = 'n';
            this.next_button_ob.form = this;
            this.next_button_ob.addEventListener('click', pagination_button_callback);
    
            for(var i=0; i<this.page_total; i++){
                var li = document.createElement('li');
                li.p_value = i;
                li.innerHTML = i + 1;
                li.form = this;
                li.addEventListener('click', pagination_button_callback);
                this.num_button_wrapper.appendChild(li);
    
            }
            //设置控件显示状态
            this.pagination_ob.style.display = "flex";
            this.setPaginationButtonState(this.cp);
        }
        

       
    }

    function initThead(){
        var tr = document.createElement('tr');
        for(var i=0; i<this.col_amount; i++){
            var th = document.createElement('th');
            th.innerHTML = this.col_content[i];
            tr.appendChild(th);
        }
        this.thead_ob.appendChild(tr);
    }

    function init(page_total){
        this.page_total = page_total;
        this.initThead();
        this.setPage(0);
        this.initPagination();
    }
    

    function addTr(tds){
        if(this.cp_row_amount < this.max_per_page){
            var tr = document.createElement('tr');
            //增加两个属性
            tr.form = this;
            tr.sn = this.cp_row_amount;
            //事件监听
            tr.addEventListener('click', function(){
                this.form.onClickRow(this);
            });

            if(tds.length != this.col_amount){
                console.warn("Data doesn't match col amount");
            }

            for(var i=0; i<tds.length; i++){
                tr.appendChild(tds[i]);
            }
            this.tbody_ob.appendChild(tr);
            this.cp_row_amount++;
        }
    }

    function setPage(page_num){
        //调整页际属性
        this.cp = page_num;
        this.cp_row_offset = page_num * this.max_per_page;
        //初始化页内属性
        this.cp_focus = 0;
        this.cp_row_amount = 0;

        
        //请求服务器数据
        this.dataProvider.requestPageData(this.cp_row_offset, this.max_per_page);
    }

    function loadPage(data){
        var total = (data.length < this.max_per_page)? data.length : this.max_per_page;
        for(var i=0; i<total; i++){
            var tds = this.generateTds(data[i]);
            this.addTr(tds);
        }
    }
}

source_form = new InteractForm('source_table', 'source_pagination');
strategy_form = new InteractForm('strategy_table', 'strategy_pagination');
click_form = new InteractForm('click_table', 'click_pagination');
window.onresize = function(){
    dataflowChart.chart.resize();
    flowSourceChart.chart.resize();
};

/*
<div class="source_nav">
    <div id="search_bar">
        <input id = "source_search" type="text" placeholder="search" onchange="onSearchChange(this)">
        <button class="cb">搜索</button>
    </div>
</div>
*/

function NavBar(nv_id){
    this.nav = document.getElementById(nv_id);
    this.left_wrapper = document.createElement('div');
    this.right_wrapper = document.createElement('div');
    this.left_wrapper.style.paddingLeft = "10px";
    this.right_wrapper.style.paddingRight = "10px";
    appendChildren(this.nav, [this.left_wrapper, this.right_wrapper]);

    //功能函数
    this.initSearchBar = initSearchBar;
    this.addLeftButton = addLeftButton;
    this.addRightButton = addRightButton;
    //接口
    
    function initSearchBar(buttonEventHandle){
        //初始化搜索栏
        this.searchBarWrapper = document.createElement('div');
        this.inputElement = document.createElement('input');
        setAttributes(this.inputElement, [['type','text'], ['placeholder', 'Search']]);
        this.searchButton = document.createElement('button');
        this.searchButton.innerHTML = "搜索"
        this.searchButton.navBar = this;
        this.searchButton.addEventListener('click', buttonEventHandle)
        appendChildren(this.searchBarWrapper, [this.inputElement, this.searchButton]);
        this.left_wrapper.appendChild(this.searchBarWrapper);
        this.left_wrapper.style.paddingLeft = "0";
        
    }
    function addLeftButton(button_name, buttonEventHandle){
        var button = document.createElement('button');
        button.innerHTML = button_name;
        button.navBar = this;
        button.addEventListener('click', buttonEventHandle);
        this.left_wrapper.appendChild(button);
    }
    function addRightButton(button_name, buttonEventHandle){
        var button = document.createElement('button');
        button.innerHTML = button_name;
        button.navBar = this;
        button.addEventListener('click', buttonEventHandle);
        this.right_wrapper.appendChild(button);
    }
}

source_nav = new NavBar('source_nav_bar');
strategy_nav = new NavBar('strategy_nav_bar');
click_nav = new NavBar('click_nav_bar');