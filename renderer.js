// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

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


////////////////////
//实时流量图 chart
////////////////////

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



timer = setInterval(server.requestSpeed, 1000);




////////////////////////
// Change view function
////////////////////////
function ViewManager(){
    this.views = document.getElementByIClassName('user_view');
    this.view_buttons = document.getElementsByClassName('view_button');
    
    this.active_view = view[0];
    this.active_view_button = view_buttons[0];

    function init(){
        //inital button
        var buttons = this.view_buttons;
        focusButton(this.active_view_button); 
        for(var i=0; i<buttons.length; i++){
            button[i].value = i;
            buttons[i].viewManager = this;
            buttons[i].addEventListener('click', function(){
                var viewManager = this.viewManager;
                viewManager.onClickViewButton(this);
            });
        }
    }

    function onClickViewButton(ob){
        if(this.active_view_button != ob){
            this.active_view.style.display = 'none';
            this.active_view = this.views[ob.value];
            this.active_view.style.display = 'flex'
            this.chart.resize()
            unfocusButton(this.active_view_button)
            focusButton(ob);
            this.active_view_button = ob;
        }
            
    }

    function focusButton(ob){
        ob.style.backgroundColor = '#1abc9c';
    }
    function unfocusButton(ob){
        ob.style.backgroundColor = '#19997f';
    }
    
}


/////////////////////////
// 流量监控尺度切换
/////////////////////////


/////////////////////////
// 流量来源饼状图
/////////////////////////
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

window.onresize = function(){
    dataflowChart.chart.resize();
    flowSourceChart.chart.resize();
};


////////////////////////////
//来源界面显示模式切换
///////////////////////////
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


function InteractForm(){
    //table
    this.table_ob = document.getElementById('table');
    this.thead_ob = this.table_ob.children[0];
    this.tbody_ob = this.table_ob.children[1];

    //pagination
    this.pagination_ob = document.getElementById('pagination');
    this.last_button_ob = this.pagination_ob.children[0];
    this.num_button_wrapper = this.pagination_ob.children[1];
    this.next_button_ob = this.pagination_ob.children[2];

    //
    this.col_amount = 3;
    this.col_content = ['col1', 'col2', 'col3'];

    //
    this.cp = 0;
    this.item_offset = 0;
    this.cp_item_amount = 0
    this.page_total = 0;
    this.max_per_page = 10;

    this.buff = new Array();
    this.allowEdit = false;

    function generateRowItem(){
        var items = new Array();
        return items;
    }

    function addRow(items){
        if(this.cp_item_amount < this.max_per_page){
            var tr = document.createElement('tr');
            tr.form = this;
            tr.sn = cp_item_amount;
            tr.addEventListener('click', function(){
                var form = tr.form;
                form.onClickRow(this);
            });

            for(var i=0; i<items.length; i++){
                tr.appendChild(items[i]);
            }
            this.tbody_ob.appendChild(tr);
            cp_item_amount++;
        }
    }

}


/////////////////////////////
// strategy form
////////////////////////////
var current_item_focus = -1;
var current_last_item_sn = 0;
var max_item_per_page = 2;

var current_page_sn = 1;
var page_total = 2;
var offset = 0;
var table = document.getElementById('strategy_table');
var itemlist = new Array();
var data_query = 'normal';
var strategy_display_area = document.getElementById('strategy_check').firstElementChild;


function initAttr(){
    var inital_current_item_focus = -1;
    var inital_current_last_item_sn = 0;
    var inital_max_item_per_page = 2;
    var inital_current_page_sn = 0;
    var inital_page_total = 2;

    current_item_focus = inital_current_item_focus;
    current_last_item_sn = inital_current_last_item_sn;
    max_item_per_page = inital_max_item_per_page;

    offset = 0;
    current_page_sn = inital_current_page_sn;
    page_total = inital_page_total;
}

//###################
//  填充表格,翻页操作
//###################

function addRow(data){
    var tbody = table.children[1];
    var tr = document.createElement('tr');
    tr.setAttribute('value', current_last_item_sn);
    tr.setAttribute('onclick', 'onClickStrategyItem(this)')
    
    var td_list = new Array();
    for(var i=0;i<data.length;i++){
        var td = document.createElement('td');
        td.innerHTML = data[i];
        td_list.push(td)
    }
    for(var i=0;i<td_list.length;i++){
        tr.appendChild(td_list[i])
    }
    tbody.appendChild(tr);
    itemlist.push(tr);
    current_last_item_sn++;
}

//生成一行数据, raw_data格式如下[Num, name, description, enable], 该函数定义了行内格式
function generate_row_data(raw_data){
    var data = new Array();
    var enable = (raw_data[3] == true)? 'checked="checked"' : '';
    data.push('<input name="enable" type="checkbox" value="' + raw_data[0] + '"' +  enable + 'onchange="onChoose(this)" disabled="disabled">');
    for(var i=1;i<raw_data.length - 1;i++){
        data.push(raw_data[i]);
    }
    return data;
}

//载入数据到表格
function loadForm(form_data){
    //var checkbox = document.getElementsByName('enable');
    for(var i=0;i<form_data.length;i++){
        var data = generate_row_data(form_data[i]);
        addRow(data);
    }
}

//翻页，重新填充表格
function changePage(page_sn){
    offset = page_sn * max_item_per_page;
    current_page_sn = page_sn;
    current_last_item_sn = offset;
    var form_data = getFormData(offset, max_item_per_page);
    var tbody = table.children[1];
    tbody.innerHTML = "";
    current_item_focus = -1;
    itemlist = [];
    loadForm(form_data);
}



//后台数据接口
function getFormData(offset, amount){
    var a = [];
    if(offset == 0){
        a.push([2,'hi','hi',false])
        a.push([1,'hello','hello',true]);
    }else if(offset == 2){
        a.push([3,'hdddd','hi',false])
        a.push([4,'haaaa','hello',true]);
    }
  
    return a;
}

function getBackendData(){

}

//################
// 处理表格项目点击
//###############
function unfocus(ob){
    ob.style.backgroundColor = 'lightcyan';
    ob.style.color = 'black';
}

function focus(ob){
    ob.style.backgroundColor = '#1abc9c';
    ob.style.color = 'white';
}

function getStrategyContent(num){
    return 'waiting for server\' response';
}
function onClickStrategyItem(ob){
    var num = Number(ob.getAttribute('value'));
    if(current_item_focus != -1){
        unfocus(itemlist[current_item_focus]);
    }
    strategy_display_area.innerHTML = getStrategyContent(num);
    current_item_focus = num - offset;
    focus(ob)
}

//###################
//strategy checkbox
//###################
function onChoose(object){
}

//##################
//  启动和退出编辑
//##################
var edit = false;
function editEnable(enable){
    //进入/退出编辑状态的UI切换
    edit = enable;
    var b_editing = document.getElementsByClassName('b_editing');
    var b_edited = document.getElementsByClassName('b_edited');
    var checkbox = document.getElementsByName('enable');
    if(enable == true){
        var b_editing_display = "inline";
        var b_edited_display = "none";
        for(var i=0;i<checkbox.length;i++){
            checkbox[i].removeAttribute('disabled');
        }
    }else{
        b_editing_display = "none";
        b_edited_display = "inline";
        for(var i=0;i<checkbox.length;i++){
            checkbox[i].setAttribute('disabled','disabled');
        }
    }

    for(var i=0;i<b_editing.length;i++){
        b_editing[i].style.display = b_editing_display;
    }

    for(var i=0;i<b_edited.length;i++){
        b_edited[i].style.display = b_edited_display;
    }
}

function onEnableEdit(){
    editEnable(true);
}

function onDisableEdit(ob){
    editEnable(false);
    if(ob.innerHTML == '取消'){
        alert('未保存');
    }else{
        alert('已保存');
        var checkbox = document.getElementsByName('enable');
        for(var i=0;i<checkbox.length;i++){
            alert(checkbox[i].checked);
        }
    }

}

var strategy_pagination = document.getElementById('s_p');
var last_button = strategy_pagination.firstElementChild.children[0];
var next_button = strategy_pagination.firstElementChild.children[2];
//#################################
//  翻页指示器（切换翻页按钮的高亮状态）
//#################################
var page_indicators = strategy_pagination.getElementsByTagName('span')[0].children;
function setPageIndicator(enable){
    if(enable == true){
        page_indicators[current_page_sn].style.backgroundColor = '#1abc9c';
    }else{
        page_indicators[current_page_sn].style.backgroundColor = '#34495e';
    }
}


//##################
//  翻页事件
//##################
function setNextLastButton(){
    if(current_page_sn == 0){
        last_button.style.visibility = 'hidden';
    }else{
        last_button.style.visibility = 'visible';
    }

    if(current_page_sn == page_total - 1){
        next_button.style.visibility = 'hidden';
    }else{
        next_button.style.visibility = 'visible';
    }
}

function onStrategySwitchPage(ob){
    if(edit == true){
        var result = confirm("是否继续，将丢失当前未保存的信息");
        if(result == false){
            return;
        }else{
            editEnable(false);
        }
    }
    var value = ob.getAttribute('value');
    setPageIndicator(false);
    switch(value){
        case 'l':
            current_page_sn = current_page_sn - 1;
            break;
        case 'n':
            current_page_sn = current_page_sn + 1;
            break;
        default:
            value = Number(value);
            current_page_sn = value - 1;
            break;
    }
    setNextLastButton();
    changePage(current_page_sn);
    setPageIndicator(true);
}

//#############
//  初始化
//#############
function initalForm(){
    
    initAttr();
    if(page_total > 1){
        strategy_pagination.style.display='flex';
    }
    setNextLastButton();
    changePage(0);
    setPageIndicator(true);
}

initalForm();
////////////////////////
// search event
////////////////////////
function onSearchChange(ob){
}

function onSearchBarBlur(ob){
    if(ob.value == ""){
        ob.style.backgroundColor = '#19997f';
    }
}
function onSearchBarFocus(ob){
    if(ob.value == ""){
        ob.style.backgroundColor = '#1abc9c';
    }
}

////////////////////////////
//  click manager
////////////////////////////
function onAddClick(){
    var name = prompt('请输入新建click的名称');
    setInterval("alert('创建成功')", 1000);
}
