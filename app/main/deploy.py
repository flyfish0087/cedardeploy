#!/usr/bin/env python
# coding: utf-8
from __future__ import print_function
import json
import time
import sys
import os
import subprocess
import datetime
import requests
import socket
import commands
import random
import cPickle
import MySQLdb as mysql

print('%s' % sys.path[0])

sys.path.append("..")
from configdb import *
from config import *



reload(sys);
sys.setdefaultencoding('utf8');


mdb = mysql.connect(user=user, passwd=passwd, host=host, port=port, db=dbname, charset=charset)
mdb.autocommit(True)
c = mdb.cursor()


def project_info(project):
    print(project)
    sql = "SELECT * FROM `projectinfo` WHERE project_name = '%s';" % (project)
    c.execute(sql)
    ones = c.fetchall()
    return ones[0]

def config_info(project):
    print(project)
    sql = "SELECT * FROM `project_config` WHERE project_name = '%s';" % (project)
    c.execute(sql)
    ones = c.fetchall()
    return ones[0]

def gethostname(project):
    print(project)
    sql = "SELECT `ip`,`hostname` FROM `serverinfo` WHERE project_name = '%s';" % (project)
    c.execute(sql)
    ones = c.fetchall()
    hostnameinfo = {}
    for i in ones:
        hostnameinfo[i[0]] = i[1]
    return hostnameinfo

def getworkorder(project):
    sql = "SELECT `applicant`,`remarks` FROM `workorder`  WHERE status = 'wait' and project = '%s';" % (project)
    c.execute(sql)
    ones = c.fetchall()
    print(ones)
    if ones:
        workorderinfo = {'status':'ok', 'applicant':ones[-1][0], 'remarks':ones[-1][1]}
    else:
        workorderinfo = {'status':'null'}
    return workorderinfo



class Deploy:
    def __init__(self, project, tag, taskid, hostlist, operation, currentuser, reason):

        self.project = project
        self.tag = tag
        self.taskid = taskid
        self.hostlist = hostlist
        self.operation = operation
        self.currentuser = currentuser
        self.reason = reason

        pinfo = project_info(project)
        cinfo = config_info(project)
        self.hostnameinfo = gethostname(project)
        self.workorderinfo = getworkorder(project)

        print(pinfo)
        print(cinfo)
        print(self.hostnameinfo)
        print(self.workorderinfo)

        self.p = pinfo[1]
        self.environment = pinfo[2]
        self.branch =  pinfo[3]
        self.Type = pinfo[4]
        self.git = pinfo[5]
        self.port = pinfo[6]
        self.make = pinfo[7]
        self.istag = pinfo[8]
        self.isnginx = pinfo[9]
        self.business = pinfo[10]
        self.ischeck = pinfo[11]
        self.checkurl = pinfo[12]
        self.statuscode = pinfo[13]


        self.config1 = cinfo[1]
        self.config2 = cinfo[2]
        self.config3 = cinfo[3]
        self.config4 = cinfo[4]
        self.config5 = cinfo[5]


        self.host = 'Deploy'
        self.status = 'ok'
        self.commitid = ''

        self.exec_user = exec_user
        self.project_path = project_path
        self.basicGlist = basicGlist
        self.manyPort = manyPort
        self.businessRobot = businessRobot
        self.sreRobot = sreRobot
        self.autotestURL = autotestURL
        self.autolist = autolist

        print(self.autolist)

        if self.Type == 'go' or self.Type == 'golang':
            self.host_path = go_host_path
        elif self.Type == 'jobs':
            self.host_path = jobs_host_path
        else:
            self.host_path = host_path

        self.pkl_file = '%s/deploy.%s.lock' %(lock_path, project)
        self.loginfo = 'user: %s\nhostlist: %s\noperation: %s\nproject: %s\ntag: %s\ntaskid: %s\n' %(
                        self.currentuser, self.hostlist, self.operation, self.project, self.tag, self.taskid)


        self.makeFun      = {   "serviceStop":         self.notexec,
                                "serviceUpdate":       self.makeUpdate,
                                "serviceFallback":     self.makeFallback,
                                "serviceExpansion":    self.makeExpansion,
                                "serviceRestart":      self.notexec
                            }


        self.remoteFun    = {   "serviceStop":         self.serviceStop,
                                "serviceUpdate":       self.serviceUpdate,
                                "serviceFallback":     self.serviceUpdate,
                                "serviceExpansion":    self.serviceUpdate,
                                "serviceRestart":      self.serviceRestart
                            }

        self.stop         = {   "java":                self.stopJava,
                                "sh":                  self.stopSupervisor,
                                "jobs":                self.notexec,
                                "static":              self.notexec,
                                "php":                 self.notexec,
                                "go":                  self.stopSupervisor,
                                "golang":              self.stopSupervisor,
                                "python":              self.stopSupervisorPort,
                                "nodejs":              self.stopSupervisorPort
                            }

        self.rsyncCode    = {   "java":                self.rsyncJava,
                                "sh":                  self.rsyncDir,
                                "jobs":                self.rsyncDir,
                                "static":              self.rsyncDir,
                                "php":                 self.rsyncPhp,
                                "go":                  self.rsyncDir,
                                "golang":              self.rsyncGolang,
                                "python":              self.rsyncDir,
                                "nodejs":              self.rsyncDir
                            }

        self.restart      = {   "java":                self.restartJava,
                                "sh":                  self.restartSupervisor,
                                "jobs":                self.notexec,
                                "static":              self.notexec,
                                "php":                 self.notexec,
                                "go":                  self.restartSupervisor,
                                "golang":              self.restartSupervisor,
                                "python":              self.restartSupervisorPort,
                                "nodejs":              self.restartSupervisorPort
                            }


    def makeOperation(self):
        self.makeFun[self.operation]()
        self.wlogsql()

    def hostOperation(self):
        self.remoteFun[self.operation]()
        self.updateHostCommit()
        self.wlogsql()

    def serviceStop(self):
        if self.Type in self.manyPort:
            portlist = self.getport()
        else:
            portlist = [self.port]

        for port in portlist:
            self.removeService(port)
            self.stop[self.Type](port)

    def serviceRestart(self):
        if self.Type in self.manyPort:
            portlist = self.getport()
        else:
            portlist = [self.port]

        for port in portlist:
            self.removeService(port)
            self.restart[self.Type](port)
            self.check_status(port)
            self.http_check(port)
            self.autotest(port)
            self.increaseService(port)
            #self.getloginfo(port)

    def serviceUpdate(self):
        self.rsyncCode[self.Type]()
        self.serviceRestart()


    def currenthost(self, host):
        self.host = host

    def addlog(self, newlog):
        self.loginfo = '%s\n%s' %(self.loginfo, newlog)

    def wlogsql(self):
        try:
            host_name = self.hostnameinfo[self.host]
        except:
            host_name = self.host

        rtime = time.strftime('%Y%m%d_%H%M%S')
        loginfo = self.loginfo.replace("'","\'\'")
        sql = "INSERT INTO `updatelog` (`taskid`,`project_name`,`host`,`tag`,`rtime`,`status`,`loginfo`)  \
                      VALUES('%s', '%s', '%s', '%s', '%s', '%s', '%s'); " % (
                      self.taskid, self.project, host_name, self.tag, rtime, self.status, loginfo)
        print(sql)
        try:
            c.execute(sql)
            self.loginfo = ''
        except Exception as err:
            print('ERROR: wlogsql execute SQL fail')
            print(str(err))
            self.done()

    def updateHostCommit(self):
        if self.commitid:
            sql = "update `serverinfo` set `variable3`='%s',`variable4`='%s' \
                           where project_name='%s' and ip='%s';   " % (
                           self.commitid, self.tag, self.project, self.host)
            print(sql)
            try:
                c.execute(sql)
            except:
                print('ERROR: updateHostCommit execute SQL fail')
                self.done()

    def updateTaskStatus(self):
        sql = "update `updateoperation` set `loginfo`='%s',`tag`='%s' \
                       where project_name='%s' and taskid='%s';  " % (
                       self.status, self.tag, self.project, self.taskid)
        print(sql)
        try:
            c.execute(sql)
        except Exception as err:
            print('ERROR: updateTaskStatus execute SQL fail')
            print(str(err))

    def notice(self):
        if self.environment != 'online':
            return ''

        HL = 'hostlist:'
        for HOST in self.hostlist.split(','):
            try:
                host_name = self.hostnameinfo[HOST]
            except:
                host_name = HOST
            HL = HL + '  ' + host_name

        headers = {'content-type': 'application/json'}


        if self.workorderinfo['status'] == 'ok':
            content = "%s  %s:  %s\n%s\n操作人: %s\n工单人: %s\ninfo: %s" %(
                       self.project, self.operation, self.status, HL, self.currentuser, 
                       self.workorderinfo['applicant'], self.workorderinfo['remarks'])
        else:
            content = "%s  %s:  %s\n%s\n操作人: %s" %(
                       self.project, self.operation, self.status, HL, self.currentuser)

        data = {
                "msgtype": "text",
                "text": {
                    "content": content
                }
            }

        if self.business in self.basicGlist:
            Robot = self.businessRobot
        else:
            Robot = 'null'

        if Robot != 'null':
            try:
                r = requests.post(url=Robot, data=json.dumps(data), headers=headers, timeout=2).json()
            except Exception as err:
                print('ERROR: notice dingding api error')
                print(str(err))

    def expansion_notice(self):
        if self.environment != 'online':
            return ''
        headers = {'Content-Type':'application/json'}
        endtime = time.strftime('%Y-%m-%d %H:%M:%S')
        content = "%s\n%s: %s %s\nHost: %s\nReason: %s" %(
                   endtime, self.project, self.operation, self.status, self.hostlist, self.reason)
        ExpansionHost = {
            "msgtype": "text",
            "text": {
                "content": content
            }
        }

        try:
            requests.post(url=self.sreRobot, headers=headers, data=json.dumps(ExpansionHost))
        except Exception as err:
            self.addlog(str(err))


    def getlasttag(self):
        sql = "SELECT `tag`,`loginfo` FROM `updateoperation`   \
                      WHERE project_name = '%s' and operation = 'serviceUpdate' \
                      order by taskid desc limit 1;" % (self.project)
        c.execute(sql)
        ones = c.fetchall()
        if ones:
            if ones[0][1] == 'ok':
                self.tag = ones[0][0]
                return True
        return False


    def getlastoktag(self):
        sql = "SELECT `tag` FROM `updateoperation`  \
                      WHERE project_name = '%s' and operation = 'serviceUpdate' and loginfo = 'ok' \
                      order by taskid desc limit 1;" % (self.project)
        c.execute(sql)
        ones = c.fetchall()
        if not ones:
            self.status = 'fail',
            self.addlog('ERROR: getlastoktag. not update ok. ')
            self.wlogsql()
            self.done()

        self.tag = ones[0][0]


    def getloginfo(self, port = None):
        if port is None:
            port = self.port
        print(self.loginfo)
        if self.Type == 'golang':
            shell_cmd = '''ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s@%s "tail -30 %s/%s.log " ''' %(
                           self.exec_user, self.host, supervisor_log_path, self.project)
            self.exec_shell(shell_cmd)


    def exec_shell(self, shell_cmd):
        print(shell_cmd)
        s = subprocess.Popen( shell_cmd, shell=True, stdin = subprocess.PIPE, stdout = subprocess.PIPE, stderr = subprocess.PIPE  )
        newlog, stderr = s.communicate()
        return_status = s.returncode
        self.addlog('%s\n%s' % (newlog.strip(), stderr.strip()) )

        print(newlog)
        if return_status == 0:
            return {'status':'ok', 'log':newlog}
        else:
            self.status = 'fail'
            self.wlogsql()
            self.done()

    def done(self):
        self.updateTaskStatus()
        self.notice()
        if self.operation == 'serviceExpansion':
            self.expansion_notice()
        try:
            os.remove(self.pkl_file)
        except:
            pass
        if self.status == 'ok':
            sys.exit(0)
        else:
            sys.exit(1)


    def notexec(self, port = None):
        pass

    def makeUpdate(self):
        code = self.check_code_update()

        if code:
            self.addlog('INFO: check_code_update true')
            self.code_update()
            self.make_operation()
            self.tag_operation()
            self.backup_operation()
            self.write_commitid()
        else:
            self.addlog('INFO: not update git code')
        self.build_file_operation()
        self.addlog('INFO:  tag: %s' %(self.tag))

    def makeFallback(self):
        self.check_backup_operation()
        self.local_commitid()

    def makeExpansion(self):
        self.getlastoktag()
        self.check_backup_operation()
        self.local_commitid()


    def getport(self):
        shell_cmd = '''ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s@%s "supervisorctl status" |grep ^%s: |awk '{print $1}' |awk -F ':' '{print $2}'  ''' %(
                       self.exec_user, self.host, self.project)

        Result = self.exec_shell(shell_cmd)
        portlist = Result['log'].strip().split('\n')
        return portlist


    def check_code_update(self):
        if not os.path.isdir('%s/%s' %(self.project_path, self.project) ):
            if self.Type != 'go':
                self.addlog('WARN: check_code_update. %s/%s directory does not exist. ' 
                          %(self.project_path, self.project) )
                shell_cmd = 'git clone  %s %s/%s' %(self.git, self.project_path, self.project)
                Result = self.exec_shell(shell_cmd)
            localCommitId = 'INFO: Not Commit Id'
        else:
            shell_cmd = "cd %s/%s && git remote -v |grep fetch |awk '{print $2}'" %(self.project_path, self.project)
            Result = self.exec_shell(shell_cmd)
            localGit = Result['log'].strip()
            if localGit == self.git:
                shell_cmd = "cd %s/%s && git rev-parse HEAD" %(self.project_path, self.project)
                self.addlog('localCommitId: ')
                Result = self.exec_shell(shell_cmd)
                localCommitId = Result['log'].strip()
            else:
                shell_cmd = 'rm -rf %s/%s' %(self.project_path, self.project)
                self.addlog(shell_cmd)
                Result = self.exec_shell(shell_cmd)
                shell_cmd = 'git clone  %s %s/%s' %(self.git, self.project_path, self.project)
                self.addlog(shell_cmd)
                Result = self.exec_shell(shell_cmd)
                localCommitId = 'localCommitId: new git'


        shell_cmd = '''cd %s/%s && git ls-remote --heads origin refs/heads/%s''' %(
                       self.project_path, self.project, self.branch)
        self.addlog('remoteCommitId: ')
        Result = self.exec_shell(shell_cmd)
        if not Result['log']:
            self.status = 'fail'
            self.addlog('ERROR: check_code_update. %s/%s  remote %s branch not existent. ' 
                      %(self.project_path, self.project, self.branch) )
            self.wlogsql()
            self.done()
        remoteCommitId = Result['log'].strip().split()[0]

        self.commitid = remoteCommitId

        if localCommitId == remoteCommitId:
            self.addlog('INFO: localCommitId = remoteCommitId\n' )
            if self.getlasttag():
                return False
            self.addlog('INFO: getlastta False')
            return True
        else:
            self.addlog('INFO: localCommitId != remoteCommitId\n' )
            return True



    def code_update(self):
        if self.Type == 'go':
            shell_cmd = ''' rm -rf %s/%s ; git  clone  --depth=1 -b %s %s %s/%s && cd %s/%s && git log -n 1 --stat
                        ''' %(self.project_path, self.project, self.branch, self.git, self.project_path, self.project, self.project_path, self.project )
        else:
            shell_cmd = ''' cd %s/%s && git reset --hard && git gc && git remote prune origin \
                                  && git fetch && git checkout %s && git reset --hard origin/%s \
                                  && git submodule init && git submodule update \
                                  && git log -n 1 --stat
                        '''  %(self.project_path, self.project, self.branch, self.branch)
        self.exec_shell(shell_cmd)
        return True


    def local_commitid(self):
        self.commitid = os.popen('cat  %s/%s-%s/commit.id' %(
                                  self.project_path, self.project, self.tag )).read().strip()
        self.addlog('localCommitId: %s' %(self.commitid))


    def build_file_operation(self):
        if not os.path.isdir('%s/%s-%s/' %(self.project_path, self.project, self.tag)):
            self.status = 'fail',
            self.addlog('ERROR: %s/%s-%s/ directory does not exist. build_file_operation' 
                      %(self.project_path, self.project, self.tag) )
            self.wlogsql()
            self.done()

        if self.Type == 'golang':
            shell_cmd = '''cd %s/%s-%s && cp -a startdata libs deploy-bin/ ''' %(
                                  self.project_path, self.project, self.tag)
            print(os.popen(shell_cmd).read())
            shell_cmd = '''cd %s/%s-%s && cp -a deploy-etc deploy-bin/etc 
                        ''' %(self.project_path, self.project, self.tag)
            print(os.popen(shell_cmd).read())

            self.addlog('---------------------------\n%s\n---------------------------' %self.config1)
        else:
            pass


    def make_operation(self):
        if self.make:
            make_start_time = time.strftime('%Y-%m-%d %H:%M:%S')
            if self.Type == 'golang':
                shell_cmd = '''cd %s/%s && . $HOME/.bashrc  \
                                      && sh deploy_build.sh %s %s
                            ''' %(self.project_path, self.project, self.project, self.make)
            else:
                shell_cmd = "cd %s/%s  && . $HOME/.bashrc && %s" %(
                             self.project_path, self.project, self.make)
            self.exec_shell(shell_cmd)
            make_done_time = time.strftime('%Y-%m-%d %H:%M:%S')
            self.addlog('make_start_time: %s' %(make_start_time))
            self.addlog('make_done_time: %s' %(make_done_time))


    def tag_operation(self):
        if self.istag == 'yes':
            shell_cmd = "cd %s/%s && git tag %s-%s && git push origin --tags" %(
                           self.project_path, self.project, self.project, self.tag)
            self.exec_shell(shell_cmd)

    def write_commitid(self):
        self.addlog('INFO: write_commitid')
        shell_cmd = 'echo %s >  %s/%s-%s/commit.id' %(
                     self.commitid, self.project_path, self.project, self.tag)
        self.exec_shell(shell_cmd)

    def backup_operation(self):

        #self.addlog('ls -dr %s/%s-%s-20* |awk "NR>8{print $1}" |xargs -i rm -rf {} ' %(self.project_path, self.project, self.project.split('_')[0]) )

        bak_delete_start_time = time.strftime('%Y-%m-%d %H:%M:%S')
        shell_cmd = '''ls -dr %s/%s-%s-20* 2>/dev/null |awk "NR>9{print $1}" |xargs -i rm -rf {} 
                    ''' %(self.project_path, self.project, self.project.split('_')[0])
        self.exec_shell(shell_cmd)
        bak_delete_done_time = time.strftime('%Y-%m-%d %H:%M:%S')
        shell_cmd = '''rsync -a --exclude .git/ --delete %s/%s/  %s/%s-%s/
                    ''' %(self.project_path, self.project, self.project_path, self.project, self.tag)
        self.exec_shell(shell_cmd)
        bak_done_time = time.strftime('%Y-%m-%d %H:%M:%S')
        self.addlog('bak_delete_start_time: %s' %(bak_delete_start_time))
        self.addlog('bak_delete_done_time: %s' %(bak_delete_done_time))
        self.addlog('bak_done_time: %s' %(bak_done_time))


    def check_backup_operation(self):
        if os.path.isdir('%s/%s-%s/' %(self.project_path, self.project, self.tag)):
            self.addlog('INFO: %s/%s-%s directory does exist. check_backup_operation' 
                      %( self.project_path, self.project, self.tag) )
        else:
            self.status = 'fail',
            self.addlog('ERROR: %s/%s-%s directory does not exist. check_backup_operation' 
                      %( self.project_path, self.project, self.tag) )
            self.wlogsql()
            self.done()

    def check_status(self, port = None):
        if port is None:
            port = self.port
        if self.isnginx == 'yes':
            i = 0
            results = ''
            while i < 60:
                s = socket.socket()
                s.settimeout(1)
                try:
                    portstatus = s.connect_ex((self.host, int(port) ))
                    print('portstatus %s: %s' %(i, portstatus))
                    #self.addlog('portstatus %s: %s' %(i, portstatus))
                    if portstatus == 0:
                        results = 'ok'
                        time.sleep(5)
                        break
                    else:
                        results = 'fail'
                except Exception as err:
                    self.addlog(str(err))
                    results = 'fail'
                s.close()
                i = i + 1
                time.sleep(2)

            if results == 'ok':
                self.addlog('INFO: check ip port up: %s:%s' %(self.host, int(port)))
            else:
                self.status = 'fail'
                self.addlog('ERROR: check ip port down: %s:%s' %(self.host, int(port)))
                self.wlogsql()
                self.done()

    def http_check(self, port = None):
        if port is None:
            port = self.port
        if self.ischeck == 'yes':
            i = 0
            results = ''
            httpcontent = ''
            url = 'http://%s:%s%s' %(self.host, port, self.checkurl)
            while i < 30:
                try:
                    r = requests.get(url,timeout=2)
                    httpstatus = r.status_code
                    httpcontent = r.content

                    if httpstatus == int(self.statuscode):
                        results = 'ok'
                        time.sleep(1)
                        break
                    else:
                        results = 'fail'
                except:
                    httpstatus = 0
                    results = 'fail'
                i = i + 1
                time.sleep(1)

            if results == 'ok':
                self.addlog('INFO: http check %s ok. http status code: %s \n%s\n' %(
                             url, httpstatus, httpcontent))
            else:
                self.status = 'fail'
                self.addlog('ERROR: http check %s fail. http status code: %s \n%s\n' %(
                             url, httpstatus, httpcontent))
                self.wlogsql()
                self.done()


    def stopSupervisor(self, port = None):
        shell_cmd = '''ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s@%s " supervisorctl stop %s: " 
                    ''' %(self.exec_user, self.host, self.project)
        self.exec_shell(shell_cmd)
    def stopSupervisorPort(self, port = None):
        shell_cmd = '''ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s@%s " supervisorctl stop %s:%s " 
                    ''' %(self.exec_user, self.host, self.project, port)
        self.exec_shell(shell_cmd)
    def stopJava(self, port = None):
        shell_cmd = '''ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s@%s "%s/%s/bin/catalina.sh stop 30 -force;" 
                    ''' %(self.exec_user, self.host, self.host_path, self.project)
        self.exec_shell(shell_cmd)



    def restartSupervisor(self, port = None):
        shell_cmd = '''ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s@%s " supervisorctl restart %s: " 
                    ''' %(self.exec_user, self.host, self.project)
        self.exec_shell(shell_cmd)
    def restartSupervisorPort(self, port = None):
        if port is None:
            port = self.port
        shell_cmd = '''ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s@%s " supervisorctl restart %s:%s " 
                    ''' %(self.exec_user, self.host, self.project, port)
        self.exec_shell(shell_cmd)
    def restartJava(self, port = None):
        shell_cmd = '''ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s@%s "%s/%s/bin/catalina.sh stop 30 -force; \
                       rm -rf %s/%s/webapps/ROOT %s/%s/webapps/%s.war ; \
                       %s/%s/bin/catalina.sh start; sleep 1; \
                       tail -5 $s/%s/logs/catalina.out" 
                    ''' %(self.exec_user, self.host, self.host_path, self.project, self.host_path, self.project, 
                          self.host_path, self.project, self.host_path, self.project, self.project, self.host_path, self.project)
        print(shell_cmd)
        self.exec_shell(shell_cmd)
        if 'Address already in use' in self.loginfo:
            self.status = 'fail'
            self.addlog('ERROR: Address already in use')
            self.wlogsql()
            self.done()



    def rsyncDir(self):
        self.addlog("PATH: %s%s/" %(self.host_path, self.project))
        shell_cmd = '''ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s@%s "mkdir -p %s/%s" 
                    ''' %(self.exec_user, self.host, self.host_path, self.project)
        self.exec_shell(shell_cmd)
        shell_cmd = '''rsync -az --delete -e "ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2" %s/%s-%s/ %s@%s:%s/%s/  > /dev/null  
                    ''' %(self.project_path, self.project, self.tag, self.exec_user, self.host, self.host_path, self.project)
        self.exec_shell(shell_cmd)
    def rsyncPhp(self):
        shell_cmd = '''ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s@%s "mkdir -p %s/%s/conf" 
                    ''' %(self.exec_user, self.host, self.host_path, self.project)
        self.exec_shell(shell_cmd)
        shell_cmd = '''rsync -az --delete -e "ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2" %s/%s-%s/conf/ %s@%s:%s/%s/conf/  > /dev/null  
                    ''' %(self.project_path, self.project, self.tag, self.exec_user, self.host, self.host_path, self.project)
        self.exec_shell(shell_cmd)
        shell_cmd = '''rsync -az --delete -e "ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2" %s/%s-%s/ %s@%s:%s/%s/  > /dev/null  
                    ''' %(self.project_path, self.project, self.tag, self.exec_user, self.host, self.host_path, self.project)
        self.exec_shell(shell_cmd)
    def rsyncGolang(self):
        shell_cmd = '''ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s@%s "mkdir -p %s/%s" 
                    ''' %(self.exec_user, self.host, self.host_path, self.project)
        self.exec_shell(shell_cmd)
        shell_cmd = '''rsync -az --delete -e "ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2" %s/%s-%s/deploy-bin/ %s@%s:%s/%s/  > /dev/null  
                    ''' %(self.project_path, self.project, self.tag, self.exec_user, self.host, self.host_path, self.project)
        self.exec_shell(shell_cmd)
    def rsyncJava(self):
        war_path = config4.split(' ')[0].strip().split('\n')[0]
        shell_cmd = '''scp -o StrictHostKeyChecking=no -o ConnectTimeout=2 %s/%s-%s/%s  %s@%s:%s/%s/webapps/ROOT.war  > /dev/null  
                    ''' %(self.project_path, self.project, self.tag, war_path, self.exec_user, self.host, self.host_path, self.project)
        self.exec_shell(shell_cmd)



    def removeService(self, port = None):
        if port is None:
            port = self.port
        if self.operation == 'serviceExpansion':
            return 'not removeService'

        if self.Type == 'golang':
            consul_port = int(port) - 3000
            consul_srv_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            consul_srv_sock.settimeout(2)
            try:
                consul_srv_sock.connect((self.host, consul_port ))
                try:
                    self.addlog(time.strftime('%Y-%m-%d %H:%M:%S'))
                    consul_srv_sock.send('on offline\n')
                    result = consul_srv_sock.recv(1024).strip()
                    if result == 'OK':
                        self.addlog('INFO: consul disable %s %s:%s %s' %(self.project, self.host, consul_port, result))
                        time.sleep(20)
                        self.addlog(time.strftime('%Y-%m-%d %H:%M:%S'))
                    else:
                        self.addlog('WARN: consul disable %s %s:%s %s' %(self.project, self.host, consul_port, result))
                except:
                    self.addlog('WARN: %s %s:%s socket send error' %(self.project, self.host, consul_port))
            except:
                self.addlog('WARN: %s %s:%s Connect timeout' %(self.project, self.host, consul_port))


    def increaseService(self, port = None):
        if port is None:
            port = self.port
        if self.isnginx == 'yes':
            pass

    def autotest(self, port = None):
        if port is None:
            port = self.port
        if self.environment != 'online':
            self.addlog('INFO: not auto test\n')
            return 'not auto test'
        if self.operation == 'serviceFallback':
            self.addlog('INFO: serviceFallback not auto test\n')
            return 'INFO: serviceFallback not auto test'
        if self.project in self.autolist:
            data = {'biz':self.project, 'host': self.host, 'port': self.port, 'way':1}
            try:
                r = requests.post(self.autotestURL, data=json.dumps(data)).json()
                self.addlog(r['data'])
                if r['data'] == 'pass':
                    self.addlog('INFO: auto test OK\n')
                    return 'ok'
                else:
                    self.addlog('ERROR: auto test Fail.\nError details: %s' %(r['url_list']) )
            except Exception as err:
                self.addlog('ERROR: auto test Fail. QA api Fail \n%s' % str(err))

            self.status = 'fail'
            self.wlogsql()
            self.done()



if __name__ == "__main__":

    project = sys.argv[1]
    tag = sys.argv[2]
    taskid = sys.argv[3]
    hostlist = sys.argv[4]
    operation = sys.argv[5]
    currentuser = sys.argv[6]
    reason = sys.argv[7]


    dp=Deploy(project, tag, taskid, hostlist, operation, currentuser, reason)
    dp.makeOperation()

    for host in hostlist.split(','):
        dp.currenthost(host)
        dp.hostOperation()

    dp.done()



