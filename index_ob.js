
/////////////////////////////
// strategy form
////////////////////////////
function StrategyForm()
{//cp == current_page, sn = sequence number

    this.cp_item_focus = -1;
    this.cp_item_total = 0;
    this.max_item_per_page = 2;

    this.offset = 0;
    this.cp_sn = 0;
    this.page_total = 2;

    this.data_query = 'normal';

    //html控件
    this.table = document.getElementById('strategy_table');
    this.cp_itemlist = new Array();
    this.strategy_display_area = document.getElementById('strategy_check').firstElementChild;
    this.strategy_pagination = document.getElementById('s_p');
    this.last_button = strategy_pagination.firstElementChild.children[0];
    this.next_button = strategy_pagination.firstElementChild.children[2];
    this.page_indicators = strategy_pagination.getElementsByTagName('span')[0].children;

    //方法声明
    this.initAttr = initAttr;
    this.initForm = initForm;
    this.addRow = addRow;
    this.drawCol = drawCol;
    this.drawPage = drawPage;
    this.loadPage = loadPage;
    this.getFormData = getFormData;
    this.setEditState = setEditState;
    this.unfocus = unfocus;
    this.focus = focus;
    this.getStrategyContent = getStrategyContent;
    this.setPageIndicator = setPageIndicator;
    this.setNextLastButton = setNextLastButton;
    this.onEnableEdit = onEnableEdit;
    this.onDisableEdit = onDisableEdit;
    this.onClickStrategyItem = onClickStrategyItem;
    this.onStrategySwitchPage = onStrategySwitchPage;
    this.onSearchBarBlur = onSearchBarBlur;
    this.onSearchBarFocus = onSearchBarFocus;
    this.onSearchChange = onSearchChange;
    
    //方法定义
    function initAttr()
    {//初始化属性
        this.cp_item_focus = -1;
        this.cp_item_total = 0;
        this.max_item_per_page = 2;

        this.offset = 0;
        this.cp_sn = 0;
        this.page_total = 2;
    }

    function initForm()
    {//初始化表格
        this.initAttr();
        if(this.page_total > 1){
            this.strategy_pagination.style.display='flex';
        }
        this.setNextLastButton();
        this.loadPage(0);
        this.setPageIndicator(true);
    }

    function drawCol(raw_data)
    {//生成一行的界面绘制数据, raw_data格式如下[Num, name, description, enable], 该函数定义了每列的格式
        var data = new Array();
        var enable = (raw_data[3] == true)? 'checked="checked"' : '';
        data.push('<input name="enable" type="checkbox" value="' + raw_data[0] + '"' +  enable + 'onchange="onChoose(this)" disabled="disabled">');
        for(var i=1;i<raw_data.length - 1;i++){
            data.push(raw_data[i]);
        }
        return data;
    }

    function addRow(col_data_list)
    {//向table中填充一行，该函数定义了行的属性，
        var tbody = this.table.children[1];
        //创建行
        var tr = document.createElement('tr');
        tr.sform = this;
        tr.setAttribute('value', this.cp_item_total);
        //tr.setAttribute('onclick', 'sform.onClickStrategyItem(this)')
        tr.onclick = function(){
            var sform = this.sform;
            sform.onClickStrategyItem(this);
        };
        
        //创建列
        for(var i=0;i<col_data_list.length;i++){
            var td = document.createElement('td');
            td.innerHTML = col_data_list[i];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        this.cp_itemlist.push(tr);
        this.cp_item_total++;
    }

    function drawPage(form_data)
    {//载入数据到表格
        var length = (this.max_item_per_page < form_data.lenght)? this.max_item_per_page:form_data.length;
        for(var i=0;i<length;i++){
            var data = drawCol(form_data[i]);
            this.addRow(data);
        }
    }

    
    function loadPage(page_sn)
    {//翻页，重新填充表格

        this.offset = page_sn * this.max_item_per_page;
        var form_data = getFormData(this.offset, max_item_per_page);
        var tbody = table.children[1];

        this.cp_sn = page_sn;
        this.cp_item_total = 0;
        tbody.innerHTML = "";
        this.cp_item_focus = -1;
        this.cp_itemlist = new Array();
        this.drawPage(form_data);
    }

    function getFormData(offset, amount)
    {//后台数据接口
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

    function setEditState(enable)
    {//进入/退出编辑状态的UI切换
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
    
    function unfocus(ob)
    {//表格项目失去焦点
        ob.style.backgroundColor = 'lightcyan';
        ob.style.color = 'black';
    }
    
    function focus(ob)
    {//表格项目获得焦点
        ob.style.backgroundColor = '#1abc9c';
        ob.style.color = 'white';
    }
    
    function getStrategyContent(num)
    {//获取策略内容
        return 'waiting for server\' response';
    }
    
    function setPageIndicator(enable)
    {//切换翻页按钮的高亮状态
        if(enable == true){
            this.page_indicators[this.cp_sn].style.backgroundColor = '#1abc9c';
        }else{
            this.page_indicators[this.cp_sn].style.backgroundColor = '#34495e';
        }
    }


    function setNextLastButton()
    {//处理前一页和后一页按钮的显示
        if(this.cp_sn == 0){
            this.last_button.style.visibility = 'hidden';
        }else{
            this.last_button.style.visibility = 'visible';
        }

        if(this.cp_sn == this.page_total - 1){
            this.next_button.style.visibility = 'hidden';
        }else{
            this.next_button.style.visibility = 'visible';
        }
    }


    //响应交互事件
    function onEnableEdit()
    {//启用编辑界面
        setEditState(true);
    }
    
    function onDisableEdit(ob)
    {//退出编辑界面
        setEditState(false);
        if(ob.innerHTML == '取消'){
            alert('未保存');
        }else{
            alert('已保存');
            var checkbox = document.getElementsByName('enable');
        }
    
    }

    function onClickStrategyItem(ob)
    {//点击表格项目
        var item_sn = Number(ob.getAttribute('value'));
        if(this.cp_item_focus != -1){
            unfocus(this.cp_itemlist[this.cp_item_focus]);
        }
        strategy_display_area.innerHTML = getStrategyContent(this.offset + item_sn);
        this.cp_item_focus = item_sn;
        focus(ob)
    }

    function onStrategySwitchPage(ob)
    {//点击翻页按钮
        var page_num = ob.getAttribute('value');
        this.setPageIndicator(false);
        switch(page_num){
            case 'l':
                this.cp_sn = this.cp_sn - 1;
                break;
            case 'n':
                this.cp_sn = this.cp_sn + 1;
                break;
            default:
                page_num = Number(page_num);
                this.cp_sn = page_num - 1;
                break;
        }
        this.setNextLastButton();
        this.loadPage(this.cp_sn);
        this.setPageIndicator(true);
    }

    function onSearchChange(ob)
    {//搜索事件
    }
    
    function onSearchBarBlur(ob)
    {
        if(ob.value == ""){
            ob.style.backgroundColor = '#19997f';
        }
    }
    function onSearchBarFocus(ob)
    {
        if(ob.value == ""){
            ob.style.backgroundColor = '#1abc9c';
        }
    }
}
var sform = new StrategyForm();
sform.initForm();

