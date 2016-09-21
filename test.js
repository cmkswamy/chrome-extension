function show(x)
{
new Notification("Job Notifications", {
	type: "progress",
    icon: '48.png',
    body: x,
	progress:45
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting)
     show(request.greeting);
  });