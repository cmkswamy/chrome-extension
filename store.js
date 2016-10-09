setTimeout(function(){
   window.location.reload(1);
}, 30000);

var str=document.body.innerHTML;
var finished="";
var finished_with_err="";
var waiting="";
var running="";
var res = str.match(/<table\s*border[\w\W]*?>\s*<tr[\w\W]*?>\s*<th[\w\W]*?>\s*(?:Job|Transformation)\s*name\s*<\/th>([\w\W]*?)<\/table>/g);

var patt_blk = /<tr>([\w\W]*?)<\/tr>/g;
while(m=patt_blk.exec(res))
{
               
               var patt = new RegExp("<td>Running<\/td>","i");
               if(patt.test(m[0]))
               {
                              running+=m[0];
               }              
               patt = new RegExp("<td>Waiting<\/td>","i");
               if(patt.test(m[0]))
               {
                              waiting+=m[0];
               }
               patt = new RegExp("<td>Finished<\/td>","i");
               if(patt.test(m[0]))
               {
                              finished+=m[0];
               }
               patt = /<td>\s*(Stopped|Finished)\s*.with\s*errors\s*.\s*<\/td>/i;
               if(patt.test(m[0]))
               {
                              finished_with_err+=m[0];
               }              
}
running = running.replace(new RegExp("<td", "g"), "<td bgcolor=\"#F0B27A\"");
finished = finished.replace(new RegExp("<td", "g"), "<td bgcolor=\"#C3FDB8\"");
finished_with_err = finished_with_err.replace(new RegExp("<td", "g"), "<td bgcolor=\"#ffb3b3\" ");
waiting = waiting.replace(new RegExp("<td", "g"), "<td bgcolor=\"#FFFACD\"");


var tot="<HTML><HEAD><TITLE>Kettle slave server status</TITLE><META http-equiv='Content-Type' content='text/html; charset=UTF-8'></HEAD><BODY><H1>Status</H1> <br/>";
tot+="<h1>Error Jobs</h1><table name=child border=1><tr> <th>Job name</th> <th>Carte Object ID</th> <th>Status</th> <th>Last log date</th> <th>Remove from list</th> </tr><tr>"+finished_with_err+"</table>";
tot+="<h1>Running Jobs</h1><table name=child border=1><tr> <th>Job name</th> <th>Carte Object ID</th> <th>Status</th> <th>Last log date</th> <th>Remove from list</th> </tr><tr>"+running+"</table>";
tot+="<h1>Finished Jobs</h1><table name=child border=1><tr> <th>Job name</th> <th>Carte Object ID</th> <th>Status</th> <th>Last log date</th> <th>Remove from list</th> </tr><tr>"+finished+"</table>";
tot+="<h1>Waiting Jobs</h1><table name=child border=1><tr> <th>Job name</th> <th>Carte Object ID</th> <th>Status</th> <th>Last log date</th> <th>Remove from list</th> </tr><tr>"+waiting+"</table>";


document.body.innerHTML=tot;
monitoring_error(finished_with_err);
monitoring_finished(finished);

//Monitoring Finished jobs
function monitoring_finished(finished)
{
var jobs1="";
var finished_jobs=[];
var rnpatt = /<tr>\s*<td[^>]*?>\s*<a[^>]*?>([^<]*?)<\/a>/g;
var m1=[];
while(m1=rnpatt.exec(finished))
{
	jobs1+=m1[1]+" ";
}
var finished_jobs = jobs1.split(" ");


chrome.storage.local.get('finished_jobs_count', function(result){
	if(jobs1.length>result.finished_jobs_count && result.finished_jobs_count>0)
	{
		chrome.storage.local.set({'finished_jobs_count': jobs1.length});
		//Updating Finished jobs
		chrome.storage.local.get('finished_jobs_arr', function(result){
			var finished_one=cmpr_arrays(result.finished_jobs_arr,finished_jobs);
		chrome.storage.local.set({'finished_jobs_arr': finished_jobs});
		
			chrome.runtime.sendMessage({greeting: finished_one+" is now Finished"}, function(response) {
			  console.log(response.farewell);
			});
		
		
		});
		
	}
	else
	{
		chrome.storage.local.set({'finished_jobs_count': jobs1.length});
		chrome.storage.local.set({'finished_jobs_arr': finished_jobs});
	}
    });
}	
//Monitoring Error jobs
function monitoring_error(finished_with_err)
{
var jobs1="";
var error_jobs=[];
var rnpatt = /<tr>\s*<td[^>]*?>\s*<a[^>]*?>([^<]*?)<\/a>/g;
var m1=[];
while(m1=rnpatt.exec(finished_with_err))
{
	jobs1+=m1[1]+" ";
}
error_jobs = jobs1.split(" ");


chrome.storage.local.get('error_jobs_count', function(result){
	if(jobs1.length>result.error_jobs_count)
	{
		chrome.storage.local.set({'error_jobs_count': jobs1.length});
		//Updating Finished jobs
		chrome.storage.local.get('error_jobs_arr', function(result){
			var error_one=cmpr_arrays(result.error_jobs_arr,error_jobs);
			//var url="jobStatus?name=jobGSStgtoEdw_Facts_Main&id="+error_one;
			//openInNewTab(url);
		chrome.storage.local.set({'finished_jobs_arr': error_jobs});
		
			chrome.runtime.sendMessage({greeting: error_one+" is now got stopped."}, function(response) {
			  console.log(response.farewell);
			});
		
		});
		
	}
	else
	{
		chrome.storage.local.set({'error_jobs_count': jobs1.length});
		chrome.storage.local.set({'error_jobs_arr': error_jobs});
	}
    });	
	
}
//Running Jobs
	
function cmpr_arrays(stored,new1)
{
	var newone="";
	new1.forEach(function (item) {
		if(stored.indexOf(item) < 0){
			newone=item;
		}
	});
	return newone;
}
//open new Tab
function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}
