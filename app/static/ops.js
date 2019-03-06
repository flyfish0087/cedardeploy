
//这个是全局的定时器。
var timeout ;
var timeout1 ;


$("body").on('click', '#open_add_project', function(){
    var status = $('#project_div').attr('status')
    if (status == 'close') {
        push_add_project_table()
        $('#project_div').attr('status','open')
        $('#add_host_table').html("");
        $('#host').html("");
    }else{
        $('#project_div').html("");
        $('#project_div').attr('status','close');
    }
});

$("body").on('click', '#del_project', function(){
    var project = $('#ipt_project').val()
    if (confirm('请确认删除项目及关联主机信息: '+project)) {
        var param = {
            project: project
        }
        $.post('/del_project', param, function(data){
            alert("删除项目 "+project+"  status: "+data.status+" log: "+data.log);
            if (data.status == 'ok') {
                project_list();

                $('#project_div').html("");
                $('#add_host_table').html("");
                $('#host').html("");
            }
        }, 'json');
    };
});


function push_add_host_table(p){
    var project = p
    var param = {
        project: project
    }
    $.getJSON('/project_info', param, function(data){
        var htm=['<table class="table table-hover">'];
        if (data[4]=='python' || data[4]=='nodejs'){
            htm.push('<thead><tr><th>hostname</th><th >ip</th><th >pnum</th><th >env</th><th >add host</th></thead>');
        } else {
            htm.push('<thead><tr><th>hostname</th><th >ip</th><th >env</th><th >add host</th></thead>');
        }
        htm.push('<tr>');
        htm.push('<td>'+'<input type="text" class="form-control" id="add_hostname" placeholder="host-01" value="">'+'</td>');
        htm.push('<td>'+'<input type="text" class="form-control" id="add_ip" placeholder="10.10.10.10" value="">'+'</td>');
        if ( data[4]=='python' || data[4]=='nodejs'){
            htm.push('<td>'+'<input type="text" class="form-control" id="add_variable1" placeholder="" value="">'+'</td>');
        }
        htm.push('<td>'+'<input type="text" class="form-control" id="add_variable6" placeholder="" value="">'+'</td>');
        htm.push('<td><button id="add_host" class="btn btn-small btn-success" project="'+project+'" >确认添加</button></td>');
        htm.push('</tr>');
        htm.push('</table>');
        $('#add_host_table').html(htm.join(''));
    })
};


$("body").on('click', '#open_add_host', function(){
    var project = $('#open_add_host').attr('project')
    var status = $('#open_add_host').attr('status')
    if (status == 'close') {
        push_add_host_table(project)
        $('#open_add_host').attr('status','open')
    }else{
        $('#add_host_table').html("");
        $('#open_add_host').attr('status','close')
    }
});


$("body").on('click', '#open_edit_host', function(){
    var project = $('#open_edit_host').attr('project')
    var status = $('#open_add_host').attr('status')
    if (status == 'close') {
        push_edit_host_table(project)
        $('#open_add_host').attr('status','open')
    }else{
        $('#add_host_table').html("");
        $('#open_add_host').attr('status','close')
    }
});


$("body").on('click', '#add_project', function(){
    if (confirm('请确认项目信息')) {
        var add_type = $('#add_type').val()
        var add_nproject = $('#add_nproject').val()
        var add_environment = $('#add_environment').val()
        var add_git = $('#add_git').val()
        var add_branch = $('#add_branch').val()
        var add_port = $('#add_port').val()
        var add_make = $('#add_make').val()
        var add_istag = $('#add_istag').val()
        var add_isnginx = $('#add_isnginx').val()
        var add_business = $('#add_business').val()
        var add_check = $('#add_check').val()
        var add_checkurl = $('#add_checkurl').val()
        var add_statuscode = $('#add_statuscode').val()

        if(!add_business ){
            alert('business null');
            return false;
        }

        if(!add_environment ){
            alert('environment null');
            return false;
        }
        if(!add_branch ){
            alert('git branch null');
            return false;
        }
        if(!add_nproject ){
            alert('project null');
            return false;
        }
        if(!add_type){
            alert('type null');
            return false;
        }
        if(!add_git){
            alert('git addr null');
            return false;
        }
        if(!add_istag){
            alert('tag yes/no');
            return false;
        }
        if(add_type == 'nodejs'){
            if(add_port < 3000 || add_port >5000){
                alert('python port [3000 - 5000]');
                return false;
            }
        }

        var param = {
            project: add_nproject,
            environment: add_environment,
            branch: add_branch,
            type: add_type,
            port: add_port,
            git: add_git,
            make: add_make,
            istag: add_istag,
            isnginx: add_isnginx,
            business:add_business,
            check: add_check,
            checkurl: add_checkurl,
            statuscode: add_statuscode,
        }

        $.post('/add_project', param, function(data){
            alert(data.status+"  "+data.log);
            if(data.status == 'ok'){
                $('#project_div').html("");
                $('#project_div').attr('status','close')
                project_list();
            }
        }, 'json');
    };
});



$("body").on('click', '#update_project', function(){
    if (confirm('请确认项目信息')) {
        var add_type = $('#add_type').val()
        var add_nproject = $('#add_nproject').val()
        var add_environment = $('#add_environment').val()
        var add_git = $('#add_git').val()
        var add_branch = $('#add_branch').val()
        var add_port = $('#add_port').val()
        var add_make = $('#add_make').val()
        var add_istag = $('#add_istag').val()
        var add_isnginx = $('#add_isnginx').val()
        var add_business = $('#add_business').val()
        var add_check = $('#add_check').val()
        var add_checkurl = $('#add_checkurl').val()
        var add_statuscode = $('#add_statuscode').val()

        if(!add_environment ){
            alert('environment null');
            return false;
        }
        if(!add_branch ){
            alert('git branch null');
            return false;
        }
        if(!add_nproject ){
            alert('project null');
            return false;
        }
        if(!add_type){
            alert('type null');
            return false;
        }
        if(!add_git){
            alert('git addr null');
            return false;
        }
        if(!add_istag){
            alert('tag yes/no');
            return false;
        }

        var param = {
            project: add_nproject,
            environment: add_environment,
            branch: add_branch,
            type: add_type,
            port: add_port,
            git: add_git,
            make: add_make,
            istag: add_istag,
            isnginx: add_isnginx,
            business: add_business,
            check: add_check,
            checkurl: add_checkurl,
            statuscode: add_statuscode,
        }

        $.post('/update_project', param, function(data){
            alert(data.status+"  "+data.log);
            if(data.status == 'ok'){
                $('#project_div').html("");
                $('#project_div').attr('status','close')
                project_list();
            }
        }, 'json');
    };
});



function push_add_project_table(){

    $.getJSON('/group_list', function(data){

    var htm=['<table class="table table-hover ">'];

    htm.push('<tr>');
    htm.push('<td width="120" align="right">Business line:</td>');
    htm.push('<td>'+'<select class="form-control" id="add_business">');
    for(var i=0,len=data.length; i<len; i++){
        htm.push('<option value="'+data[i]+'">'+data[i]+'</option>');
    }
    htm.push('</select></td>');
    htm.push('</tr>');

    htm.push('<tr>');
    htm.push('<td width="120" align="right">type:</td>');
    htm.push('<td>'+'<select class="form-control" id="add_type"><option value="golang" selected = "selected">golang</option><option value="go">go-bin</option><option value="php">php</option><option value="python">python</option><option value="static">static</option><option value="jobs">jobs</option><option value="nodejs">nodejs</option><option value="sh">sh</option></select>'+'</td>');
    htm.push('</tr>');

    htm.push('<tr>');
    htm.push('<td width="120" align="right">project:</td>');
    htm.push('<td>'+'<input type="text" class="form-control" id="add_nproject" placeholder="api" value="">'+'</td>');
    htm.push('</tr>');

    htm.push('<tr>');
    htm.push('<td width="120" align="right">environment:</td>');
    htm.push('<td>'+'<select class="form-control" id="add_environment"><option value="test" selected = "selected">test</option><option value="online">online</option><option value="pre" >pre</option><option value="beta">beta</option><option value="dev">dev</option><option value="offline">offline</option><option value="qa">qa</option><option value="job">job</option></select>'+'</td>');
    htm.push('</tr>');

    htm.push('<tr>');
    htm.push('<td width="120" align="right">git:</td>');
    htm.push('<td>'+'<input type="text" class="form-control" id="add_git" placeholder="git://github.com/sre/op.git" value="">'+'</td>');
    htm.push('</tr>');

    htm.push('<tr>');
    htm.push('<td width="120" align="right">branch:</td>');
    htm.push('<td>'+'<input type="text" class="form-control" id="add_branch" placeholder="online" value="">'+'</td>');
    htm.push('</tr>');

    htm.push('<tr>');
    htm.push('<td width="120" align="right">port:</td>');
    htm.push('<td>'+'<input type="text" class="form-control" id="add_port" placeholder="go port[8000-10000]  nodejs port[3000-5000] python port [5000-7000]" value="">'+'</td>');
    htm.push('</tr>');

    htm.push('<tr>');
    htm.push('<td width="120" align="right">make:</td>');
    htm.push('<td>'+'<input type="text" class="form-control" id="add_make" placeholder="shell cmd1  && shell cmd2" value="">'+'</td>');
    htm.push('</tr>');

    htm.push('<tr>');
    htm.push('<td width="120" align="right">tag:</td>');
    htm.push('<td>'+'<select class="form-control" id="add_istag"><option value="yes">yes</option><option value="no" selected = "selected">no</option></select>'+'</td>');
    htm.push('</tr>');

    htm.push('<tr>');
    htm.push('<td width="120" align="right">Nginx</td>');
    htm.push('<td>'+'<select class="form-control" id="add_isnginx"><option value="no" selected = "selected">no</option><option value="yes">yes</option></select>'+'</td>');
    htm.push('</tr>');


    htm.push('<tr>');
    htm.push('<td width="120" align="right">httpCheck:</td>');
    htm.push('<td>'+'<select class="form-control" id="add_check"><option value="no" selected = "selected">no</option><option value="yes">yes</option></select>'+'</td>');
    htm.push('</tr>');

    htm.push('<tr>');
    htm.push('<td width="120" align="right">checkURL:</td>');
    htm.push('<td>'+'<input type="text" class="form-control" id="add_checkurl" placeholder="/" value="/">'+'</td>');
    htm.push('</tr>');

    htm.push('<tr>');
    htm.push('<td width="120" align="right">statusCode:</td>');
    htm.push('<td>'+'<input type="text" class="form-control" id="add_statuscode" placeholder="200" value="200">'+'</td>');
    htm.push('</tr>');


    htm.push('<tr>');
    htm.push('<td></td>');
    htm.push('<td><button id="add_project" class="btn btn-small btn-success" >确认添加</button></td>');
    htm.push('</tr>');
    htm.push('</table>');

    $('#project_div').html(htm.join(''));

    })
};


$("body").on('click', '#add_host', function(){
    if (confirm('确认提交？')) {
        var add_hostname = $('#add_hostname').val()
        var add_ip = $('#add_ip').val()
        var add_project = $('#add_host').attr('project')
        var add_variable1 = $('#add_variable1').val()
        var add_variable2 = $('#add_variable2').val()
        var add_variable3 = $('#add_variable3').val()
        var add_variable4 = $('#add_variable4').val()
        var add_variable5 = $('#add_variable5').val()
        var add_variable6 = $('#add_variable6').val()
        var add_variable7 = $('#add_variable7').val()
        var add_variable8 = $('#add_variable8').val()
        var add_variable9 = $('#add_variable9').val()
        var param = {
            hostname: add_hostname,
            host: add_ip,
            project: add_project,
            variable1: add_variable1,
            variable2: add_variable2,
            variable3: add_variable3,
            variable4: add_variable4,
            variable5: add_variable5,
            variable6: add_variable6,
            variable7: add_variable7,
            variable8: add_variable8,
            variable9: add_variable9
        }

        $.post('/add_host', param, function(data){
            host_list_table(add_project)
            alert(data.status+"  "+data.log);
        }, 'json');
    };
});


$("body").on('click', '#add_servergroup', function(){
    if (confirm('确认提交？')) {
        var username = $('#current_user').val()
        var servicegroup = $('#add_server_group').val()
        var permissions = $('#add_permissions').val()
        var param = {
            username: username,
            servicegroup: servicegroup,
            permissions: permissions,
        }
        $.post('/adduserservicegroup', param, function(data){
            alert(data.status+"  "+data.log);
            userservicegrouplist(username);
        }, 'json');
    };
});



$("body").on('click', '#delete_servergroup', function(){
    if (confirm('确认提交？')) {
        var username = $(this).attr('username')
        var servicegroup = $(this).attr('servergroup')
        var param = {
            user: username,
            servicegroup: servicegroup,
        }
        $.post('/deleteuserservicegroup', param, function(data){
            alert(data.status+"  "+data.log);
            userservicegrouplist(username);
        }, 'json');
    };
});



$("body").on('click', '#delete_user', function(){
    if (confirm('确认提交？')) {
        var username = $(this).attr('username')
        var param = {
            deleteuser: username,
        }
        $.post('/delete_user', param, function(data){
            alert(data.status+"  "+data.log);
            user_list();
        }, 'json');
    };
});



$("body").on('click', '#add_user', function(){
    if (confirm('确认提交？')) {
        var username = $('#addusername').val()
        var password = $('#addpassword').val()
        var param = {
            adduser: username,
            password: password,
        }
        $.post('/add_user', param, function(data){
            alert(data.status+"  "+data.log);
            user_list();
        }, 'json');
    };
});



$("body").on('click', '#update_host', function(){
    var num = $(this).attr('i')
    var project = $(this).attr('project')
    var hostname = $('#hostname'+num).val()
    var hostip = $('#hostip'+num).val()
    var variable1 = $('#variable1'+num).val()
    var variable6 = $('#variable6'+num).val()

    if (confirm('请确认更新: '+host)) {
        var param = {
            hostip:    hostip,
            hostname:  hostname,
            project:   project,
            variable1: variable1,
            variable6: variable6,
        }
        $.post('/update_host', param, function(data){
            host_list_table(project)
            alert(data.status+"  "+data.log);
        }, 'json');
    }
});


$("body").on('click', '#del_host', function(){
    var host = $(this).attr('host')
    var project = $(this).attr('project')
    if (confirm('请确认删除: '+host)) {
        var param = {
            host:    host,
            project: project,
        }
        $.post('/del_host', param, function(data){
            host_list_table(project)
            alert(data.status+"  "+data.log);
        }, 'json');
    }
});


$("body").on('click', '#deploy_config', function(){
    var deploy_config_host = $(this).attr('host')
    var deploy_config_project = $(this).attr('project')
    if (confirm('警告: 配置文件改动会重启服务. 请确认!!!  '+deploy_config_host)) {
        var param = {
            host:    deploy_config_host,
            project: deploy_config_project,
        }
        $.post('/deploy_config', param, function(data){
            host_list_table(deploy_config_project)
            alert('deploy config '+deploy_config_host+' status: '+data['status']);
        }, 'json');
    }
});



$("#back_submit").on('click', function(){
    var  p = $('#ipt_project').val()
    if (p != undefined){
        var param = {
            project: p,
            operation: 'serviceFallback',
            tag: $('#select_tag').val(),
        };
        $.getJSON('/lock_check', param, function(data){
            if(data['status'] == "ok"){
                if (confirm('请确认回滚'+ p +'？')) {
                    updateonline(param)
                };
            }else{
                alert(data['user'] + '正在操作，请勿重复执行！')
            }
        });
    }
    else{
        alert('project_name null');
    };
});



$("body").on('click', '#btn_submit', function(){
    var  p = $('#ipt_project').val()
    if (p != undefined){
        var param = {
            operation: 'serviceUpdate',
            project: p,
        };
        $.getJSON('/lock_check', param, function(data){
            if(data['status'] == "ok"){
                if (confirm('请确认更新' + p + '并重启服务!')) {
                    updateonline(param)
                    online_tag(p)
                    current_tag(p)
                };
            }else{
                alert(data['user'] + '正在操作' + p + '，请勿重复执行！')
            }
        });
    }
    else{
        alert('project_name null');
    };
});


$("#restart_submit").on('click', function(){
    var  p = $('#ipt_project').val()
    if (p != undefined){
        var param = {
            operation: 'serviceRestart',
            project: p,
        };
        $.getJSON('/lock_check', param, function(data){
            if(data['status'] == "ok"){
                if (confirm('请确认重启'+ p +'服务!')) {
                    updateonline(param)
                };
            }else{
                alert(data['user'] + '正在操作，请勿重复执行！')
            }
        });
    }
    else{
        alert('project_name null');
    };
});



function updateonline(param){
    if (param['operation'] == 'serviceStop'){
        var num = 1;
    } else {
        var chks = $('.hostList input:checkbox:checked');
        var num = chks.length;
        if(num==0){
            alert('host list null')
            return
        }
        var _arr=[];
        for(var i=0,len=num; i<len; i++){
            _arr.push(chks[i].value) ;
        }
        param.client = _arr.join(",");
    }

    console.log(param);

    $.post('/deploy', param, function(data){
        $("#resDiv").html( "operation:&nbsp;"+data.operation+
            "<br>project:&nbsp;"+data.project+
            "<br>hostlist:&nbsp;"+data.hostlist+
            "<br>taskid:&nbsp;"+data.taskid+
            "<br>tag:&nbsp;"+data.tag+
            "<br>status:&nbsp;"+data.status+
            "<br>logout:&nbsp;"+data.output
            );
        if(data.status == 'wait'){
            if(timeout){clearInterval(timeout)};
            timeout = setInterval(function(){
                next(data.taskid, num);
            },4000);
            $('#cnt').html("");
        } else {
            alert(data.status + '  ' + data.output)
        };
    }, 'json');
};


function pagelist(){
    $.getJSON('/pagelist',  function(data){
        var htm=['<ul class="nav nav-pills navbar-left" role="tablist">'];
        for(var i=0,len=data.length; i<len; i++){
            htm.push('<li role="presentation"><a href="/'+data[i][0]+'">'+data[i][1]+'</a></li>');
        }
        htm.push('</ul>');
        $('#pagelist').html(htm.join(''));
    });
};



function project_list(p){

    var selectgroup = $('#selectgroup').val()
    var functype = $('#leftDiv').attr('path')
    var param = {
        group: selectgroup,
        functype: functype
    }

    $.getJSON('/project', param , function(data){

        var htm=[''];
        $.each(data, function(g, projectlist){
            htm.push('<a href="#'+g+'" class="nav-header menu-first collapsed" data-toggle="collapse" aria-expanded="false"><i class="icon-user-md icon-large"></i><h4>'+g+'</h4></a>');
            htm.push('<ul id="'+g+'" class="collapse in" >');

            var h=projectlist.sort();
            for(var i=0,len=h.length; i<len; i++){

                if(functype == "online"){
                    htm.push('<li ><a class="host_list" data-project='+h[i]+'><i class="icon-user"></i>');
                }
                if(functype == "project_admin"){
                    htm.push('<li ><a class="host_list_admin" data-project='+h[i]+'><i class="icon-user"></i>');
                }
                if(functype == "online_log"){
                    htm.push('<li ><a class="online_log_time" data-project='+h[i]+'><i class="icon-user"></i>');
                }
                htm.push('<p class="text-success">'+h[i]+'</p>');
                htm.push('</a></li>');
            }
            htm.push('</ul><br>');
        })
        $('#project').html(htm.join(''));
        $('#project_div').attr('status','close');

        if (p != undefined ) {
            host_list_push(p);
        }

    });
};



function group_list(){

    var url=window.location.search.substr(1).split("&")
    var avgr = new Array();

    for (var i = 0; i < url.length; i++){
        avgr[url[i].split('=')[0]] = url[i].split('=')[1];
    }
    $.getJSON('/group_list', function(data){
        var htm=['<select class="form-control" id="selectgroup" onchange="project_list()">'];
        for(var i=0,len=data.length; i<len; i++){
            if (avgr['group'] == data[i]){
                htm.push('<option value="'+data[i]+'" selected="selected">'+data[i]+'</option>');
            } else{
                htm.push('<option value="'+data[i]+'">'+data[i]+'</option>');
            }
        }
        htm.push('</select>');
        $('#group').html(htm.join(''));
        project_list(avgr['project']);
    })
};


function user_list(){
    $.getJSON('/user_list', function(data){
        var htm=['<ul type="disc">'];
        for(var i=0,len=data.length; i<len; i++){
            htm.push('<li><a class="userlist" username="'+data[i]+'">'+data[i]+'</a></li>');
        }
        htm.push('</ul>');
        $('#user_list').html(htm.join(''));
    })
};



$("body").on('click', '.userlist', function(){
    var username = $(this).attr('username')
    userservicegrouplist(username)
});


function userservicegrouplist(username){

    var param = {
        user: username
    }

    $.getJSON('/userservicegrouplist', param, function(data){

        var htm=['<table class="table table-hover">'];
        htm.push('<thead><tr><th>username</th><th>server group</th><th>permissions</th><th>operation</th></thead>');
        htm.push('<tr>');
        htm.push('<td>'+'<input type="text" readonly="true" id="current_user" class="form-control"  value="'+username+'">'+'</td>');
        htm.push('<td>'+'<input type="text" id="add_server_group" class="form-control"  value="">'+'</td>');
        htm.push('<td>'+'<select class="form-control" id="add_permissions"><option value="developer"  selected="selected">developer</option><option value="config">config</option><option value="online">online</option></select>'+'</td>');
        htm.push('<td>'+'<button id="add_servergroup" class="btn btn-small btn-success">添加组</button>'+'</td>');
        htm.push('</tr>');
        htm.push('<tr>');
        htm.push('<td></td>');
        htm.push('<td></td>');
        htm.push('<td></td>');
        htm.push('</tr>');

        for(var i=0,len=data.length; i<len; i++){
            htm.push('<tr>');
            htm.push('<td>'+'<input type="text" readonly="true" class="form-control"  value="'+username+'">'+'</td>');
            htm.push('<td>'+'<input type="text" readonly="true" class="form-control"  value="'+data[i][0]+'">'+'</td>');
            htm.push('<td>'+'<input type="text" readonly="true" class="form-control"  value="'+data[i][1]+'">'+'</td>');
            htm.push('<td>'+'<button id="delete_servergroup" username="'+username+'" servergroup="'+data[i][0]+'" class="btn btn-small btn-danger">删除组</button>'+'</td>');
            htm.push('</tr>');
        }

        htm.push('<tr>');
        htm.push('<td>'+'<button id="delete_user" username="'+username+'" class="btn btn-small btn-danger">删除用户</button>'+'</td>');
        htm.push('</tr>');

        htm.push('</table>');
        $('#servergroup_list').html(htm.join(''));
    })
}



function project_info(p){
    var status = $('#project_div').attr('status')
    if (status == 'close') {
        var param = {
            project: p
        }
        $.getJSON('/project_info', param, function(data){
            var htm=['<table class="table table-hover">'];

            htm.push('<tr>');
            htm.push('<td width="120" align="right">Business line:</td>');
            htm.push('<td>'+data[9]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">project:</td>');
            htm.push('<td>'+data[0]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">environment:</td>');
            htm.push('<td>'+data[1]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">git:</td>');
            htm.push('<td>'+data[2]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">branch:</td>');
            htm.push('<td>'+data[3]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">type:</td>');
            htm.push('<td>'+data[4]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">port:</td>');
            htm.push('<td>'+data[5]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">make:</td>');
            htm.push('<td>'+data[6]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">tag:</td>');
            htm.push('<td>'+data[7]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">isnginx:</td>');
            htm.push('<td>'+data[8]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">httpCheck:</td>');
            htm.push('<td>'+data[10]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">checkURL:</td>');
            htm.push('<td>'+data[11]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">statusCode:</td>');
            htm.push('<td>'+data[12]+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td></td>');
            htm.push('<td><button id="clean_git_cache" class="btn btn-small btn-danger">清除git缓存</button></td>');
            htm.push('</tr>');

            htm.push('</table>');
            $('#project_div').html(htm.join(''));
        });
        $('#project_div').attr('status','open')
    }else{
        $('#project_div').html("");
        $('#project_div').attr('status','close')
    }
};


function config_info(p){
    var status = $('#config_div').attr('status')
    if (status == 'close') {
        var param = {
            project: p
        }
        $.getJSON('/config_info', param, function(data){
            var htm=['<table class="table table-hover">'];
            htm.push('<tr>');
            htm.push('<td colspan="2">'+'ip = $ip$'+'</td>');
            htm.push('</tr>');
            htm.push('<tr>');
            htm.push('<td colspan="2">'+'numprocs = $pnum$'+'</td>');
            htm.push('</tr>');

                for(var i=0,len=data.length; i<len; i++){
                    htm.push('<tr>');
                    htm.push('<td width="120" align="right">'+data[i][0]+':</td>');
                    htm.push('<td><textarea id="config'+i+'" rows="5" cols="100"  readonly="readonly" >'+data[i][1]+'</textarea></td>');
                    htm.push('</tr>');
                }

            htm.push('</table>');
            $('#config_div').html(htm.join(''));
        });
        $('#config_div').attr('status','open')
    }else{
        $('#config_div').html("");
        $('#config_div').attr('status','close')
    }
};


function host_list_table(p){
    var param={ project:p};
    $.getJSON('/hostlist', param,  function(data){
        var htm=['<table class="table table-hover">'];
        if (data!='' && data!=undefined && data!=null){
            if($('#leftDiv').attr('path') == "online"){
                if (data[0][3]=='python' || data[0][3]=='nodejs'){
                    htm.push('<thead><tr><th>hostname</th><th>ip</th><th>pnum</th><th>status</th><th>checkTime</th><th>commitID</th><th>UpdateTime</th><th>stop</th></thead>');
                } else {
                    htm.push('<thead><tr><th>hostname</th><th>ip</th><th>status</th><th>checkTime</th><th>commitID</th><th>UpdateTime</th><th>stop</th></thead>');
                }
                for(var i=0,len=data.length; i<len; i++){
                    if(data[i][1] != "essExpansion"){
                        htm.push('<tr>');
                        if (p.indexOf("online")!=0){
                            htm.push('<td>'+'<input type="checkbox" name="onlinehost" value="'+data[i][0]+'" checked="checked">'+data[i][1]+'</td>');
                        } else {
                            htm.push('<td>'+'<input type="checkbox" name="onlinehost" value="'+data[i][0]+'" >'+data[i][1]+'</td>');
                        }
                        htm.push('<td>'+data[i][0]+'</td>');
                        if (data[0][3]=='python' || data[0][3]=='nodejs'){
                            htm.push('<td>'+data[i][4]+'</td>');
                        }
                        if(data[i][5] == "RUNNING"){
                            htm.push('<td><div id="status'+data[i][0].replace(/\./g,"-")+'" class="sidebar-menu"><font color="Lime">'+data[i][5]+'</font></div></td>');
                        } else if(data[i][5] == "SSHOK"){
                            htm.push('<td><div id="status'+data[i][0].replace(/\./g,"-")+'" class="sidebar-menu"><font color="#FF9900">'+data[i][5]+'</font></div></td>');
                        } else {
                            htm.push('<td><div id="status'+data[i][0].replace(/\./g,"-")+'" class="sidebar-menu"><font color="red">'+data[i][5]+'</font></div></td>');
                        }
                        htm.push('<td><div id="checkTime'+data[i][0].replace(/\./g,"-")+'" class="sidebar-menu">'+data[i][8]+'</div></td>');
                        htm.push('<td><div id="commitID'+data[i][0].replace(/\./g,"-")+'" class="sidebar-menu">'+data[i][6]+'</div></td>');
                        htm.push('<td><div id="UpdateTime'+data[i][0].replace(/\./g,"-")+'" class="sidebar-menu">'+data[i][7]+'</div></td>');
                        htm.push('<td>'+'<a href="javascript:;" onclick=stop_submit("'+data[i][0]+'");>stop</a>'+'</td>');
                        htm.push('</tr>');
                    }
                }
            }

            if($('#leftDiv').attr('path') == "project_admin"){
                if (data[0][3]=='python'|| data[0][3]=='nodejs'){
                    htm.push('<thead><tr><th>hostname</th><th>ip</th><th>pnum</th><th>status</th><th>ENV</th><th>DeployConf</th><th>save</th><th>delete</th></tr></thead>');
                } else {
                    htm.push('<thead><tr><th>hostname</th><th>ip</th><th>status</th><th>ENV</th><th>DeployConf</th><th>save</th><th>delete</th></tr></thead>');
                }
                for(var i=0,len=data.length; i<len; i++){
                    if(data[i][1] != "essExpansion"){
                        htm.push('<tr>');
                        htm.push('<td>'+'<input type="text" class="form-control" id="hostname'+i+'" placeholder="hostname" value="'+data[i][1]+'">'+'</td>');
                        htm.push('<td>'+'<input type="text" readOnly="true" class="form-control" id="hostip'+i+'" placeholder="data[i][0]" value="'+data[i][0]+'">'+'</td>');
                        if (data[0][3]=='nodejs' || data[0][3]=='python'){
                            htm.push('<td>'+'<input type="text" class="form-control" id="variable1'+i+'" placeholder="variable1" value="'+data[i][4]+'">'+'</td>');
                        }
                        if(data[i][5] == "RUNNING"){
                            htm.push('<td>'+'<font color="Lime">'+data[i][5]+'</font>'+'</td>');
                        } else if(data[i][5] == "SSHOK"){
                            htm.push('<td>'+'<font color="#FF9900">'+data[i][5]+'</font>'+'</td>');
                        }else{
                            htm.push('<td>'+'<font color="red">'+data[i][5]+'</font>'+'</td>');
                        }
                        htm.push('<td>'+'<input type="text" class="form-control" id="variable6'+i+'" placeholder="a=1,b=2" value="'+data[i][9]+'">'+'</td>');
                        htm.push('<td><button id="deploy_config" host="'+data[i][0]+'" class="btn btn-sm btn-danger" project="'+p+'" >更新配置</button></td>');
                        htm.push('<td><button id="update_host" host="'+data[i][0]+'" i="'+i+'" class="btn btn-sm btn-danger" project="'+p+'" >保存</button></td>');
                        htm.push('<td><button id="del_host" host="'+data[i][0]+'" class="btn btn-sm btn-danger" project="'+p+'" >delete</button></td>');
                        htm.push('</tr>');
                    }
                }
            }
        }
        htm.push('</table>');
        $('#host').html(htm.join(''));
    });
};


function host_list_status(p){
    var param={ project:p};
    $.getJSON('/hostlist', param,  function(data){
        if (data!='' && data!=undefined && data!=null){
            for(var i=0,len=data.length; i<len; i++){
                if(data[i][5] == "RUNNING"){
                    $('#status'+data[i][0].replace(/\./g,"-")).html('<font color="Lime">'+data[i][5]+'</font>');
                } else if(data[i][5] == "SSHOK"){
                    $('#status'+data[i][0].replace(/\./g,"-")).html('<font color="#FF9900">'+data[i][5]+'</font>');
                } else {
                    $('#status'+data[i][0].replace(/\./g,"-")).html('<font color="red">'+data[i][5]+'</font>');
                }
                $('#checkTime'+data[i][0].replace(/\./g,"-")).html(data[i][8]);
                $('#commitID'+data[i][0].replace(/\./g,"-")).html(data[i][6]);
                $('#UpdateTime'+data[i][0].replace(/\./g,"-")).html(data[i][7]);
            }

        }
    });

};


function push_edit_host_table(p){
    var param={ project:p};
    $.getJSON('/hostlist', param,  function(data){
        var htm=['<table class="table table-hover">'];

        if($('#leftDiv').attr('path') == "project_admin"){
            htm.push('<thead><tr><th>hostname</th><th>ip</th><th>pnum</th><th>project</th></tr></thead>');
            $.each(data, function(ip, data){
                if(data[0] != "essExpansion"){
                    htm.push('<tr>');
                    htm.push('<td>'+'<input type="text" class="form-control" id="add_git" placeholder="hostname" value="'+data[0]+'">'+'</td>');
                    htm.push('<td>'+'<input type="text" readOnly="true" class="form-control" id="add_git" placeholder="ip" value="'+ip+'">'+'</td>');
                    htm.push('<td>'+'<input type="text" class="form-control" id="add_git" placeholder="pnum" value="'+data[1]+'">'+'</td>');
                    htm.push('<td>'+'<input type="text" readOnly="true" class="form-control" id="add_git" placeholder="project" value="'+data[2]+'">'+'</td>');
                    htm.push('</tr>');
                }
            })
            htm.push('<tr><td><button id="edit_host" class="btn btn-small btn-danger" project="'+p+'" >更新主机信息</button></td></tr>');
        }
        htm.push('</table>');
        $('#add_host_table').html(htm.join(''));

    });
};


$("body").on('click', '.host_list', function(){
    var p = $(this).attr('data-project')
    host_list_push(p)
});

function host_list_argv(p){

    host_list_push(avgr['project'])
}

function host_list_push(p){

    $('p').css('background','');
    $($('[data-project="'+p+'"]').find('p')[0]).css({"backgroundColor":"#C1FFC1"});

    host_list_table(p)
    online_tag(p)
    current_tag(p)

    var htm1=['<input type="hidden" name="project" id="ipt_project" value="'+p+'" />'];
    $('#select_project').html(htm1.join(''));

    var htm3=['<a href="javascript:;" class="project_info_table" status="close" onclick=\'project_info("'+p+'");\'>项目信息</a>'];
    $('#project_button').html(htm3.join(''));

    var htm4=['<a href="javascript:;" class="config_info_table" status="close" onclick=\'config_info("'+p+'");\'>配置信息</a>'];
    $('#config_button').html(htm4.join(''));

    if(p.split("_",1) == "online"){
        var htm5=['<button id="btn_submit" class="btn btn-warning" type="button">'+p.split("_",1)+'更新</button>'];
    }else{
        var htm5=['<button id="btn_submit" class="btn btn-success" type="button">'+p.split("_",1)+'更新</button>'];
    }

    $('#updatebutton').html(htm5.join(''));

    $('#ProgressBarDiv').html('');
    $('#cnt').html("");
    $('#resDiv').html("");
    $('#add_host_table').html("");
    $('#project_div').html("");
    $('#project_div').attr('status','close');
    $('#config_div').html("");
    $('#config_div').attr('status','close');

    clearInterval(timeout);

    if(timeout1){clearInterval(timeout1)};
        timeout1 = setInterval(function(){
            host_list_status(p);
    },4000);

}


$("body").on('click', '.host_list_admin', function(){
    $('p').css('background','');
    $($(this).find('p')[0]).css({"backgroundColor":"#C1FFC1"});

    var p = $(this).attr('data-project')

    host_list_table(p)

    var htm1=['<input type="hidden" name="project" id="ipt_project" value="'+p+'" />'];
    $('#select_project').html(htm1.join(''));

    $('#ProgressBarDiv').html('');
    $('#cnt').html("");
    $('#resDiv').html("");
    $('#add_host_table').html("");
    $('#project_div').html("");
    $('#project_div').attr('status','close');
    $('#config_div').html("");
    $('#config_div').attr('status','close');
    project_button_div();
    config_button_div();
    push_add_host_table(p)
});


function selectAll(n){
    var a = document.getElementsByName(n);
    if(typeof(a[0]) != 'undefined'){
        if(a[0].checked){
            for(var i=0; i<a.length; i++){
                if (a[i].name == n) a[i].checked = false;
            }
        }else{
            for(var i=0; i<a.length; i++){
                if (a[i].name == n) a[i].checked = true;
            }
        }
    }
}


function next(i, hostLen){
    var param={ taskid:i };
    $.getJSON('/cmdreturns', param,  function(data){
        var percentage=parseInt(data.length * 100 / (hostLen+1));
        if(percentage<10){
            var percentage=10;
        }

        var ProgressBar='<div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="'+percentage+'" aria-valuemin="0" aria-valuemax="100" style="width: '+percentage+'%">'+percentage+'%</div>';

        var ProgressBarDanger='<div class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar" aria-valuenow="'+percentage+'" aria-valuemin="0" aria-valuemax="100" style="width: '+percentage+'%">'+percentage+'%</div>';

        $('#ProgressBarDiv').html(ProgressBar);

        if(data.length == hostLen+1){
            clearInterval(timeout);
        }

        var htm=['<table class="table table-bordered">'];
        htm.push('<tr><th>host</th><th>完成时间</th><th>状态</th><th>执行结果</th></tr>');
        for(var i=0,len=data.length; i<len; i++){
            htm.push('<tr>');
            htm.push('<td>'+data[i][0]+'</td>');
            htm.push('<td>'+data[i][1]+'</td>');
            if(data[i][2] == 'ok' ){
               htm.push('<td class="success">'+data[i][2]+'</td>');
            }else{
               htm.push('<td class="danger">'+data[i][2]+'</td>');
               $('#ProgressBarDiv').html(ProgressBarDanger);
               clearInterval(timeout);
            }
            htm.push('<td><textarea rows="30" cols="80" readonly="readonly">'+data[i][3]+'</textarea></td>');
            htm.push('</tr>');
        }
        htm.push('</table>');
        $('#cnt').html(htm.join(''));
    });
};

function hostlisterrweb(){

    $.getJSON('/hostlisterr', function(data){
        var htm=['<table class="table table-bordered">'];
        htm.push('<tr><th>project_name</th><th>hostname</th><th>ip</th><th>status</th></tr>');

        for(var i=0,len=data.length; i<len; i++){
            var DataTime = getLocalTime(data[i][1])

            htm.push('<tr>');
            htm.push('<td>'+data[i][2]+'</td>');
            htm.push('<td>'+data[i][1]+'</td>');
            htm.push('<td>'+data[i][0]+'</td>');
            htm.push('<td>'+data[i][5]+'</td>');
            htm.push('</tr>');
        }
        $('#statistics').html(htm.join(''));
    });
};

function postlist(){

    $.getJSON('/port_list', function(data){
        var htm=['<table class="table table-bordered">'];
        htm.push('<tr><th>port</th><th>project</th></tr>');

        for(var i=0,len=data.length; i<len; i++){
            htm.push('<tr>');
            htm.push('<td>'+data[i][0]+'</td>');
            htm.push('<td>'+data[i][1]+'</td>');
            htm.push('</tr>');
        }
        $('#statistics').html(htm.join(''));
    });
};

function projectall(){

    $.getJSON('/project_list', function(data){
        var htm=['<table class="table table-bordered">'];
        htm.push('<tr><th>group</th><th>project</th><th>port</th></tr>');

        for(var i=0,len=data.length; i<len; i++){
            htm.push('<tr>');
            htm.push('<td>'+data[i][0]+'</td>');
            htm.push('<td>'+data[i][1]+'</td>');
            htm.push('<td>'+data[i][2]+'</td>');
            htm.push('</tr>');
        }
        $('#statistics').html(htm.join(''));
    });
};

function online_log_time(p){
    var param={ project:p };
    $.getJSON('/online_log_time', param, function(data){
        var htm=['<table class="table table-bordered">'];
        htm.push('<tr><th>time</th><th>operation</th><th>taskid</th><th>tag</th><th>project</th><th>output</th><th>user</th></tr>');

        for(var i=0,len=data.length; i<len; i++){
            var DataTime = getLocalTime(data[i][1])

            htm.push('<tr>');
            htm.push('<td>'+'<a href="javascript:;" onclick="online_log_info(\''+data[i][1]+'\');">'+DataTime+'</a>'+'</td>');
            htm.push('<td>'+data[i][0]+'</td>');
            htm.push('<td>'+data[i][1]+'</td>');
            htm.push('<td>'+data[i][2]+'</td>');
            htm.push('<td>'+data[i][3]+'</td>');
            htm.push('<td>'+data[i][4]+'</td>');
            htm.push('<td>'+data[i][5]+'</td>');
            htm.push('</tr>');
        }
        $('#online_log_time').html(htm.join(''));
        $('#online_log').html("");

    });
};


$("body").on('click', '.online_log_time', function(){
    $('p').css('background','');
    $($(this).find('p')[0]).css({"backgroundColor":"#C1FFC1"});

    var p = $(this).attr('data-project')

    var param={ project:p };
    $.getJSON('/online_log_time', param, function(data){
        var htm=['<table class="table table-bordered">'];
        htm.push('<tr><th>time</th><th>operation</th><th>taskid</th><th>tag</th><th>project</th><th>output</th><th>user</th></tr>');

        for(var i=0,len=data.length; i<len; i++){
            var DataTime = getLocalTime(data[i][1])

            htm.push('<tr>');
            htm.push('<td>'+'<a href="javascript:;" onclick="online_log_info(\''+data[i][1]+'\');">'+DataTime+'</a>'+'</td>');
            htm.push('<td>'+data[i][0]+'</td>');
            htm.push('<td>'+data[i][1]+'</td>');
            htm.push('<td>'+data[i][2]+'</td>');
            htm.push('<td>'+data[i][3]+'</td>');
            htm.push('<td>'+data[i][4]+'</td>');
            htm.push('<td>'+data[i][5]+'</td>');
            htm.push('</tr>');
        }
        $('#online_log_time').html(htm.join(''));
        $('#online_log').html("");

    });
});

function online_log_all(){

    $.getJSON('/online_log_all', function(data){
        var htm=['<table class="table table-bordered">'];
        htm.push('<tr><th>time</th><th>operation</th><th>taskid</th><th>tag</th><th>project</th><th>output</th><th>user</th></tr>');

        for(var i=0,len=data.length; i<len; i++){
            var DataTime = getLocalTime(data[i][1])

            htm.push('<tr>');
            htm.push('<td>'+'<a href="javascript:;" onclick="online_log_info(\''+data[i][1]+'\');">'+DataTime+'</a>'+'</td>');
            htm.push('<td>'+data[i][0]+'</td>');
            htm.push('<td>'+data[i][1]+'</td>');
            htm.push('<td>'+data[i][2]+'</td>');
            htm.push('<td>'+data[i][3]+'</td>');
            htm.push('<td>'+data[i][4]+'</td>');
            htm.push('<td>'+data[i][5]+'</td>');
            htm.push('</tr>');
        }
        $('#online_log_time').html(htm.join(''));
        $('#online_log').html("");

    });
};

function online_log_info(id){
    var param={ taskid:id };
    $.getJSON('/cmdreturns', param,  function(data){
        var htm=['<table class="table table-bordered">'];
        htm.push('<tr><th>host</th><th>完成时间</th><th>状态</th><th>执行结果</th></tr>');
        for(var i=0,len=data.length; i<len; i++){
            htm.push('<tr>');
            htm.push('<td>'+data[i][0]+'</td>');
            htm.push('<td>'+data[i][1]+'</td>');
            if(data[i][2] == 'ok' ){
               htm.push('<td class="success">'+data[i][2]+'</td>');
            }else{
               htm.push('<td class="danger">'+data[i][2]+'</td>');
            }
            htm.push('<td><textarea rows="30" cols="80" readonly="readonly">'+data[i][3]+'</textarea></td>');
            htm.push('</tr>');
        }
        htm.push('</table>');
        $('#online_log').html(htm.join(''));
    });
};


//function getLocalTime(nS) {
//    return new Date(parseInt(nS) * 1000 ).toLocaleString()
//}


function add0(m){return m<10?'0'+m:m }


function getLocalTime(nS) {
    var date=new Date(parseInt(nS)* 1000);
    var year=date.getFullYear();
    var mon = date.getMonth()+1;
    var day = date.getDate();
    var hours = date.getHours();
    var minu = date.getMinutes();
    var sec = date.getSeconds();

    return year+'-'+add0(mon)+'-'+add0(day)+' '+add0(hours)+':'+add0(minu)+':'+add0(sec);
}



function project_button_div(){
    $('#project_button').html('<button id="open_add_project_edit" status="close" type="button" class="btn btn-small btn-info">编辑项目</button>');
};


function config_button_div(){
    $('#config_button').html('<button id="open_add_config_edit" status="close" type="button" class="btn btn-small btn-info">编辑配置</button>');
};

$("body").on('click', '#open_add_config_edit', function(){
    var  p = $('#ipt_project').val()
    if (p != undefined){
        push_edit_config_table(p);
    }
    else{
        alert('project_name null');
    };
});

$("body").on('click', '#open_add_project_edit', function(){
    var  p = $('#ipt_project').val()
    if (p != undefined){
        push_edit_project_table(p);
    }
    else{
        alert('project_name null');
    };
});


function push_edit_project_table(p){
    var status = $('#project_div').attr('status')
    if (status == 'close') {
        var param = {
            project: p
        }
        $.getJSON('/project_info', param, function(data){
            var htm=['<table class="table table-hover ">'];

            htm.push('<tr>');
            htm.push('<td width="120" align="right">Business line:</td>');
            htm.push('<td>'+'<input type="text" class="form-control" id="add_business" placeholder="" value="'+data[9]+'">'+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">project:</td>');
            htm.push('<td>'+'<input type="text" readOnly="true" class="form-control" id="add_nproject" placeholder="api" value="'+data[0]+'">'+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">environment:</td>');
            htm.push('<td>'+'<input type="text" readOnly="true" class="form-control" id="add_environment" placeholder="hockey" value="'+data[1]+'">'+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">git:</td>');
            htm.push('<td>'+'<input type="text" class="form-control" id="add_git" placeholder="git://github.com/sre/op.git" value="'+data[2]+'">'+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">branch:</td>');
            htm.push('<td>'+'<input type="text" class="form-control" id="add_branch" placeholder="python" value="'+data[3]+'">'+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">type:</td>');
            htm.push('<td>'+'<input type="text" readOnly="true" class="form-control" id="add_type" placeholder="python" value="'+data[4]+'">'+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">port:</td>');
            htm.push('<td>'+'<input type="text" class="form-control" id="add_port" placeholder="go port[8000-10000]  python port[3000-5000]" value="'+data[5]+'">'+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">make:</td>');
            htm.push('<td>'+'<input type="text" class="form-control" id="add_make" placeholder="shell cmd1  && shell cmd2" value="'+data[6]+'">'+'</td>');
            htm.push('</tr>');

            if (data[7]=="yes"){
                htm.push('<tr>');
                htm.push('<td width="120" align="right">tag:</td>');
                htm.push('<td>'+'<select class="form-control" id="add_istag"><option value="yes" selected = "selected">yes</option><option value="no">no</option></select>'+'</td>');
                htm.push('</tr>');
            }else{
                htm.push('<tr>');
                htm.push('<td width="120" align="right">tag:</td>');
                htm.push('<td>'+'<select class="form-control" id="add_istag"><option value="yes">yes</option><option value="no" selected = "selected">no</option></select>'+'</td>');
                htm.push('</tr>');
            }

            if (data[8]=="yes"){
                htm.push('<tr>');
                htm.push('<td width="120" align="right">isnginx:</td>');
                htm.push('<td>'+'<select class="form-control" id="add_isnginx"><option value="yes" selected = "selected">yes</option><option value="no">no</option></select>'+'</td>');
                htm.push('</tr>');
            }else{
                htm.push('<tr>');
                htm.push('<td width="120" align="right">isnginx:</td>');
                htm.push('<td>'+'<select class="form-control" id="add_isnginx"><option value="yes">yes</option><option value="no" selected = "selected">no</option></select>'+'</td>');
                htm.push('</tr>');
            }

            if (data[10]=="yes"){
                htm.push('<tr>');
                htm.push('<td width="120" align="right">httpCheck:</td>');
                htm.push('<td>'+'<select class="form-control" id="add_check"><option value="yes" selected = "selected">yes</option><option value="no">no</option></select>'+'</td>');
                htm.push('</tr>');
            }else{
                htm.push('<tr>');
                htm.push('<td width="120" align="right">httpCheck:</td>');
                htm.push('<td>'+'<select class="form-control" id="add_check"><option value="yes">yes</option><option value="no" selected = "selected">no</option></select>'+'</td>');
                htm.push('</tr>');
            }

            htm.push('<tr>');
            htm.push('<td width="120" align="right">checkURL:</td>');
            htm.push('<td>'+'<input type="text" class="form-control" id="add_checkurl" placeholder="/" value="'+data[11]+'">'+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td width="120" align="right">statusCode:</td>');
            htm.push('<td>'+'<input type="text" class="form-control" id="add_statuscode" placeholder="200" value="'+data[12]+'">'+'</td>');
            htm.push('</tr>');

            htm.push('<tr>');
            htm.push('<td></td>');
            htm.push('<td><div><div style="float:left"><button id="update_project" class="btn btn-small btn-success" >确认保存</button></div><div style="float:right"><button id="del_project" class="btn btn-small btn-danger">删除项目及关联的主机</button></div></div></td>');
            htm.push('</tr>');

            htm.push('</table>');
            $('#project_div').html(htm.join(''));
        });
        $('#project_div').attr('status','open')
    }else{
        $('#project_div').html("");
        $('#project_div').attr('status','close')
    }
};


$("#rmlock").on('click', function(){
    var  p = $('#ipt_project').val();
    if (p != undefined){
        var param = {
            project: p
        };

        $.getJSON('/rmpkl', param, function(data){
            alert(p + ' lock clear done!');
        });
    }
    else{
        alert('project_name null');
    };
});

$("body").on('click', '#clean_git_cache', function(){
    var  p = $('#ipt_project').val();
    if (p != undefined){
        var param = {
            project: p
        };

        $.getJSON('/clean_git_cache', param, function(data){
            alert(p + ' git cache clear done!' + data);
        });
    }
    else{
        alert('project_name null');
    };
});


function push_edit_config_table(p){
    var status = $('#config_div').attr('status')
    if (status == 'close') {
        var param = {
            project: p
        }
        $.getJSON('/config_info', param, function(data){
            var htm=['<table class="table table-hover">'];

            htm.push('<tr>');
            htm.push('<td colspan="2">'+'ip = $ip$'+'</td>');
            htm.push('</tr>');
            htm.push('<tr>');
            htm.push('<td colspan="2">'+'numprocs = $pnum$'+'</td>');
            htm.push('</tr>');

            for(var i=0,len=data.length; i<len; i++){
                htm.push('<tr>');
                htm.push('<td width="120" align="right">'+data[i][0]+':</td>');
                htm.push('<td><textarea id="config'+i+'" rows="5" cols="100" >'+data[i][1]+'</textarea></td>');
                htm.push('</tr>');
            }

            htm.push('<tr>');
            htm.push('<td></td>');
            htm.push('<td><button id="update_config" class="btn btn-small btn-success" >确认保存</button></td>');
            htm.push('</tr>');
            htm.push('</table>');
            $('#config_div').html(htm.join(''));
        });
        $('#config_div').attr('status','open')
    }else{
        $('#config_div').html("");
        $('#config_div').attr('status','close')
    }
};


function online_tag(p){
    var param = {
        project: p
    }
    $.getJSON('/online_tag', param, function(data){
        var htm=['<select id="select_tag" class="form-control">'];
        if(data.length == 0){
            htm.push('<option value="null">null update</option>');
        }
        else{
            for(var i=0,len=data.length; i<len; i++){
                htm.push('<option value="'+data[i]+'">'+data[i]+'</option>');
            }
        }
        htm.push('</select>');
        $('#tag_div').html(htm.join(''));
    });
};


function current_tag(p){
    var param = {
        project: p
    }
    $.getJSON('/current_tag', param, function(data){
        $('#online_tag_div').html(data[0]);
    });
};




$("#lastlog").on('click', function(){
    var  p = $('#ipt_project').val()
    if (p != undefined){
        var param={ project:p };
        $.getJSON('/lastlog', param,  function(data){
            var htm=['<table class="table table-bordered">'];
            htm.push('<tr><th>host</th><th>完成时间</th><th>状态</th><th>执行结果</th></tr>');
            for(var i=0,len=data.length; i<len; i++){
                htm.push('<tr>');
                htm.push('<td>'+data[i][0]+'</td>');
                htm.push('<td>'+data[i][1]+'</td>');
                if(data[i][2] == 'fail' ){
                   htm.push('<td class="danger">'+data[i][2]+'</td>');
                   clearInterval(timeout);
                }else{
                   htm.push('<td class="success">'+data[i][2]+'</td>');
                }
                htm.push('<td><textarea rows="30" cols="80" readonly="readonly">'+data[i][3]+'</textarea></td>');
                htm.push('</tr>');
            }
            htm.push('</table>');
            $('#cnt').html(htm.join(''));
        });
    }
    else{
        alert('project_name null');
    };
});


$("body").on('click', '#update_config', function(){
    if (confirm('请确认配置信息')) {

        var project = $('#ipt_project').val()
        var config1 = $('#config0').val()
        var config2 = $('#config1').val()
        var config3 = $('#config2').val()
        var config4 = $('#config3').val()
        var config5 = $('#config4').val()
        var config6 = $('#config5').val()
        var config7 = $('#config6').val()
        var config8 = $('#config7').val()
        var config9 = $('#config8').val()
        var config10 = $('#config9').val()

        if(!project ){
            alert('project null');
            return false;
        }

        var param = {
            project: project,
            config1: config1,
            config2: config2,
            config3: config3,
            config4: config4,
            config5: config5,
            config6: config6,
            config7: config7,
            config8: config8,
            config9: config9,
            config10: config10,
        }

        $.post('/update_config', param, function(data){
            alert(data.status+"  "+data.log);
            if(data.status == 'ok'){
                $('#config_div').html("");
                $('#config_div').attr('status','close')
                project_list();
            }
        }, 'json');
    };
});


function online_statistics(){
    $.getJSON('/online_statistics', function(data){
        var htm=['<table class="table table-hover" border="2">'];


        htm.push('<tr><td rowspan="2"><h5>project</h5></td><td colspan="3"><h5>前1周</h5></td><td colspan="3"><h5>前2周</h5></td><td colspan="3"><h5>前3周</h5></td><td colspan="3"><h5>前4周</h5></td></tr>');

        htm.push('<tr><td><h5>update</h5></td><td><h5>restart</h5></td><td><h5>fallback</h5></td><td><h5>update</h5></td><td><h5>restart</h5></td><td><h5>fallback</h5></td><td><h5>update</h5></td><td><h5>restart</h5></td><td><h5>fallback</h5></td><td><h5>update</h5></td><td><h5>restart</h5></td><td><h5>fallback</h5></td></tr>');

        $.each(data, function(i, h){
            htm.push('<tr>');
            htm.push('<td>'+i+'</td>');
            htm.push('<td>'+h[0]+'</td>');
            htm.push('<td>'+h[1]+'</td>');
            htm.push('<td>'+h[2]+'</td>');
            htm.push('<td>'+h[3]+'</td>');
            htm.push('<td>'+h[4]+'</td>');
            htm.push('<td>'+h[5]+'</td>');
            htm.push('<td>'+h[6]+'</td>');
            htm.push('<td>'+h[7]+'</td>');
            htm.push('<td>'+h[8]+'</td>');
            htm.push('<td>'+h[9]+'</td>');
            htm.push('<td>'+h[10]+'</td>');
            htm.push('<td>'+h[11]+'</td>');
            htm.push('</tr>');

        })

        htm.push('</table>');
        $('#statistics').html(htm.join(''));
    })
};

function cmslog(){
    $.getJSON('/cmslog', function(data){
        var htm=['<table class="table table-hover" border="2">'];
        htm.push('<tr><td><h5>@timestamp</h5></td><td><h5>auth_name</h5></td><td><h5>method</h5></td><td><h5>status</h5></td><td><h5>request_api</h5></td><td><h5>remote_addr</h5></td><td><h5>request_time</h5></td></tr>');
        for(var i=0,len=data.length; i<len; i++){
            htm.push('<tr>');
            for(var u=0,len1=data[i].length; u<len1; u++){
                if(u==0){
                    var DataTime = getLocalTime(data[i][0])
                    htm.push('<td>'+DataTime+'</td>');
                }else{
                    htm.push('<td>'+data[i][u]+'</td>');
                }
            }
            htm.push('</tr>');
        }

        htm.push('</table>');
        $('#cms_log').html(htm.join(''));
    })
};


function erplog(){
    $.getJSON('/erplog', function(data){
        var htm=['<table class="table table-hover" border="2">'];
        htm.push('<tr><td><h5>@timestamp</h5></td><td><h5>auth_name</h5></td><td><h5>method</h5></td><td><h5>status</h5></td><td><h5>request_api</h5></td><td><h5>parameter</h5></td><td><h5>description</h5></td><td><h5>error_message</h5></td><td><h5>platform</h5></td></tr>');
        for(var i=0,len=data.length; i<len; i++){
            htm.push('<tr>');
            for(var u=0,len1=data[i].length; u<len1; u++){
                if(u==0){
                    var DataTime = getLocalTime(data[i][0])
                    htm.push('<td>'+DataTime+'</td>');
                }else{
                    htm.push('<td>'+data[i][u]+'</td>');
                }
            }
            htm.push('</tr>');
        }

        htm.push('</table>');
        $('#erp_log').html(htm.join(''));
    })
};


function stop_submit(ip){
    var p = $('#ipt_project').val()
    if (p != undefined){
        if (confirm('请确认停止服务'+ p +'!')) {
            var param = {
                operation: 'serviceStop',
                project: p,
                client: ip,
            };
            updateonline(param)
        };
    }
    else{
        alert('project_name null');
    };
};


function stopserver(param){

    $.post('/stopserver', param, function(data){
        $("#resDiv").html( "&nbsp;&nbsp;&nbsp;&nbsp;operation:&nbsp;&nbsp;"+data.operation+"<br>&nbsp;&nbsp;&nbsp;&nbsp;taskid:&nbsp;&nbsp;"+data.taskid+"<br>&nbsp;&nbsp;&nbsp;&nbsp;logout:&nbsp;&nbsp;"+data.output+"<br>&nbsp;&nbsp;&nbsp;&nbsp;hostlist:&nbsp;&nbsp;"+data.host+"<br>&nbsp;&nbsp;&nbsp;&nbsp;tag:&nbsp;&nbsp;"+data.tag+"<br>&nbsp;&nbsp;&nbsp;&nbsp;project:&nbsp;&nbsp;"+data.project);
        if(timeout){clearInterval(timeout)};
        timeout = setInterval(function(){
            next(data.taskid, 1);
        },4000);
        $('#cnt').html("");
    }, 'json');
};


function workorder_group_list(){
    $.getJSON('/group_list', function(data){
        var htm=['<select class="form-control" id="selectgroup" onchange="workorder_project_list()">'];
        for(var i=0,len=data.length; i<len; i++){
            htm.push('<option value="'+data[i]+'">'+data[i]+'</option>');
        }
        htm.push('</select>');
        $('#group').html(htm.join(''));
        workorder_project_list();
    })
};


function workorder_project_list(){

    var selectgroup = $('#selectgroup').val()
    var param = {
        group: selectgroup,
        functype: 'workorder'
    }

    $.getJSON('/project', param , function(data){
        var htm=['<select class="form-control" id="selectproject">'];
        $.each(data, function(g, projectlist){
            var h=projectlist.sort();
            for(var i=0,len=h.length; i<len; i++){
                if(h[i].indexOf("online_")>-1){
                    htm.push('<option value="'+h[i]+'">'+h[i]+'</option>');
                }
            }
        })
        htm.push('</select>');
        $('#project').html(htm.join(''));
    });
};


$("body").on('click', '.workordermenu', function(){
    var menu = $(this).attr('menu');
    //userservicegrouplist(username)
    selectworkmenu(menu)
});


function selectworkmenu(menu){
    if(menu == 'createworkorder'){
        createworkorder()
        workorder_group_list()

    } else if(menu == 'waitworkorder'){
        waitworkorder()
    } else if(menu == 'doneworkorder'){
        doneworkorder()
    }
};

function createworkorder(){
    var htm=['<table class="table table-hover" border="2">'];
    htm.push('<tr>');
    htm.push('<td>group:</td>');
    htm.push('<td><div id="group"></div></td>');
    htm.push('</tr>');
    htm.push('<tr>');
    htm.push('<td>project:</td>');
    htm.push('<td><div id="project"></div></td>');
    htm.push('</tr>');
    htm.push('<tr>');
    htm.push('<td>remarks:</td>');
    htm.push('<td><textarea id="remarks" rows="5" cols="100"></textarea></td>');
    htm.push('</tr>');
    htm.push('<tr>');
    htm.push('<td></td>');
    htm.push('<td><button id="subworkorder" class="btn btn-small btn-success">提交工单</button></td>');
    htm.push('</tr>');
    htm.push('</table>');

    $('#workorder_div').html(htm.join(''));
}
function waitworkorder(){
    $.getJSON('/wait_workorder', function(data){
        var htm=['<table class="table table-hover" border="2">'];
        htm.push('<tr>');
        htm.push('<td>组</td>');
        htm.push('<td>项目</td>');
        htm.push('<td>申请人</td>');
        htm.push('<td>申请时间</td>');
        htm.push('<td>状态</td>');
        //htm.push('<td>执行人</td>');
        //htm.push('<td>完成时间</td>');
        htm.push('<td>关闭工单</td>');
        htm.push('<td>备注</td>');
        htm.push('</tr>');

        for(var i=0,len=data.length; i<len; i++){
            var applicationtime = getLocalTime(data[i][3])
            //var completiontime = getLocalTime(data[i][6])
            htm.push('<tr>');
            htm.push('<td>'+data[i][0]+'</td>');
            htm.push('<td><a href="/online?group='+data[i][0]+'&project='+data[i][1]+'" target="_blank">'+data[i][1]+'</a></td>');
            htm.push('<td>'+data[i][2]+'</td>');
            htm.push('<td>'+applicationtime+'</td>');
            htm.push('<td>'+data[i][4]+'</td>');
            //htm.push('<td>'+data[i][5]+'</td>');
            //htm.push('<td>'+data[i][6]+'</td>');
            htm.push('<td><button id="downworkorder" time="'+data[i][3]+'" class="btn btn-small btn-success">关闭工单</button></td>');
            htm.push('<td><textarea id="remarks" rows="3" cols="40">'+data[i][7]+'</textarea></td>');
            htm.push('</tr>');
        }
        htm.push('</table>');
        $('#workorder_div').html(htm.join(''));
    })

}
function doneworkorder(){
    $.getJSON('/done_workorder', function(data){
        var htm=['<table class="table table-hover" border="2">'];
        htm.push('<tr>');
        htm.push('<td>组</td>');
        htm.push('<td>项目</td>');
        htm.push('<td>申请人</td>');
        htm.push('<td>申请时间</td>');
        htm.push('<td>状态</td>');
        htm.push('<td>执行人</td>');
        htm.push('<td>完成时间</td>');
        htm.push('<td>备注</td>');
        htm.push('</tr>');
        for(var i=0,len=data.length; i<len; i++){
            var applicationtime = getLocalTime(data[i][3])
            var completiontime = getLocalTime(data[i][6])

            htm.push('<tr>');
            htm.push('<td>'+data[i][0]+'</td>');
            htm.push('<td>'+data[i][1]+'</td>');
            htm.push('<td>'+data[i][2]+'</td>');
            htm.push('<td>'+applicationtime+'</td>');
            htm.push('<td>'+data[i][4]+'</td>');
            htm.push('<td>'+data[i][5]+'</td>');
            htm.push('<td>'+completiontime+'</td>');
            htm.push('<td><textarea id="remarks" rows="2" cols="25">'+data[i][7]+'</textarea></td>');
            htm.push('</tr>');
        }
        htm.push('</table>');
        $('#workorder_div').html(htm.join(''));
    })
}




$("body").on('click', '#subworkorder', function(){
    if (confirm('请确认提交工单信息')) {
        var group   = $('#selectgroup').val()
        var project = $('#selectproject').val()
        var remarks = $('#remarks').val()
        if (project != undefined){
            var param = {
                group:    group,
                project:  project,
                remarks:  remarks,
            };
            $.post('/add_workorder', param, function(data){
                alert(data.status+"  "+data.log);
            }, 'json');
        }
        else{
            alert('workorder project name null');
        };
    }
});




$("body").on('click', '#downworkorder', function(){
    var applicationtime = $(this).attr('time')
    if (confirm('请确认关闭工单')) {
        var param = {
            applicationtime: applicationtime
        }
        $.post('/update_workorder', param, function(data){
            alert(data.status+"  "+data.log);
            waitworkorder();

        }, 'json');
    };
});




$("body").on('click', '.statistics', function(){
    var menu = $(this).attr('menu');
    if(menu == 'portlist'){
        postlist()
    } else if(menu == 'projectlist'){
        projectall()
    } else if(menu == 'hostlisterr'){
        hostlisterrweb()
    } else if(menu == 'onlinenum'){
        online_statistics()
    }
});


