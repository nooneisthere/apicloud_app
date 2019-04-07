function printobj(obj){
    printout(JSON.stringify(obj));
}

//api.toLauncher();
//setInterval(myalarm,3000);


/*
但是多了sh000001=所以第一个元素变成sh000001,索引+1,日期变成5
0： sh000001
1：”大秦铁路”，股票名字；
2：”27.55″，今日开盘价；
3：”27.25″，昨日收盘价；
4：”26.91″，当前价格；
30(5)  2008-01-11 日期
sz399001 深指 sz399006  创业板 USDCNY 美金汇
XAUUSD=21:58:53,0.0000,0.0000,
#4                         最高       最低       #9
1287.4900,50500,1287.4800,1290.5000,1285.4500,1289.1200,黄金美元,2019-04-02
1287.4900,57500,1287.4800,1291.2000,1285.4500,1290.3300,黄金美元,2019-04-02
1291.8700,23900,1291.7800,1292.6700,1290.2800,1292.2000,黄金美元,2019-04-03
1292.2300,86400,1292.2600,1293.2300,1284.5900,1291.5500,黄金美元,2019-04-06
//3->4  9->3  10->1 11->5 XAUUSD USDCNY
*/

function get_stock(theID){
    $api.get('http://hq.sinajs.cn/format=text&list=' + theID,
    function(data){
        console.log(data);
        var sinfo = data.split(/,|=/g);
        sinfo[5] = sinfo[31];
        process_data(sinfo.slice(0,6),1,5);
    },
    'text'
    );
}

//3->4  9->3  10->1 11->5 XAUUSD USDCNY
function get_aux(theID){
    $api.get('http://hq.sinajs.cn/format=text&list=' + theID,
    function(data){
        printobj(data);
        var sinfo = data.split(/,|=/g);
        sinfo[1] = sinfo[10];
        sinfo[2] = sinfo[4];
        sinfo[4] = sinfo[9];
        sinfo[5] = sinfo[11];
        process_data(sinfo.slice(0,6),1,10);
    },
    'text'
    );
}

//the idea is to save 5 days records, if 3 days raise then alert
function process_data(new_data,score,days){
    score = score || 3;
    days =  days || 5;
    var last_day ;
    var saved_data = mygetStorage(new_data[0]) || [];
    //alert(saved_data);
    var cur_date = {'date':new_data[5],'data':new_data};

    if (saved_data[0] && saved_data[0].date == new_data[5]){
        saved_data[0]=cur_date;
        //console.log('already have '+new_data[5]);
    }else{
        saved_data.unshift(cur_date);
        if (saved_data.length > days){
            saved_data.pop();
        }
    }

    var result = alert_condition(saved_data,score);
    if (result && checktime()){
        var title = new_data[1];
        title += result > 0 ? ' UP' : ' Down';
        var details =  [result, new_data[4], new_data[5]].join(' - ');
        myalarm(title, details);
    }
    mysetStorage(new_data[0], saved_data);
    return saved_data;
}

function get_status(new_data,last_day){
    var status = 0;
    status += new_data[4] <  new_data[2] ?  -1 : 1;
    if (last_day){
        status += new_data[4] <  last_day[4] ?  -1 : 1;
    }
    return status;
}

function alert_condition (saved_data,score){
    result =  0;
    var status;
    console.log(saved_data);
    for (i = 0; i<saved_data.length;i++){
        var lastday = (i+1 < saved_data.length) ? saved_data[i+1]['data'] : undefined;
        status = get_status(saved_data[i]['data'],lastday) ;
        saved_data[i]['status'] = status;
        result += status;
        if (Math.abs(result) >= score){
            return result;
        }
    }
    return false;
}


function checktime(){
    var myDate = new Date();
    //myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
    var curHour = myDate.getHours();       //获取当前小时数(0-23)

    return curHour >7 && curHour <23 ;
    //console.log(myDate.getHours());

}


//-------------------------------------------------------

if (typeof(apifs) != 'undefined'){
    api.addEventListener({name:'pause'}, function(ret,err) {
        onPause();//监听应用进入后台，通知jpush暂停事件
    })

    api.addEventListener({name:'resume'}, function(ret,err) {
        onResume();//监听应用恢复到前台，通知jpush恢复事件
    })
}

function onResume(){
    console.log('jpush.onResume()');
}
function onPause(){
    console.log('jpush.onPause()');
}

function test2(){
    test=[123,'test',4,7,6,201912];
    process_data(test);
    console.log(JSON.stringify(mygetStorage(123)));
}


function call_fun1(){

    var data = [
    mygetStorage('USDCNY'),
    mygetStorage('XAUUSD'),
    mygetStorage('sz399001'),
    mygetStorage('sz399006'),
    ];
    printobj(data);
}

function call_fun2(){
    document.getElementById('show_msg').innerHTML='';

}

function call_fun3(){
    $api.clearStorage ();
    //$api.rmStorage('USDCNY');
}


function thejob (){
    get_stock('sz399001');
    get_stock('sz399006');
    get_aux('XAUUSD');
    get_aux('USDCNY');

}

thejob();
setInterval(thejob,2000 * 1000);

