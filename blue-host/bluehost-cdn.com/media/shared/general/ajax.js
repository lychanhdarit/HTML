///----------------------------------------------------------------///
// $Id: ajax.js,v 1.6 2014/07/08 15:16:33 cmcgarvey Exp $
// Copyright © 2007 Paul Seamons
// This library may not be redistributed without permission
///----------------------------------------------------------------///

// sample usage
//  if (document.my_request) document.my_request.abort(); // cancel during fast scroll
//  document.my_request = ajax_get({
//    url: query,
//    handler: function (req, args) {
//      var output = eval(req.responseText);
//    }
//  });


var ajax_activex_object_types = [
  "Msxml2.XMLHTTP.7.0",
  "Msxml2.XMLHTTP.6.0",
  "Msxml2.XMLHTTP.5.0",
  "Msxml2.XMLHTTP.4.0",
  "Msxml2.XMLHTTP.3.0",
  "MSXML2.XMLHTTP",
  "Microsoft.XMLHTTP"];

function ajax_xmlhttp_request () {
  var req;
  if (window.XMLHttpRequest) {
    try { req = new XMLHttpRequest() } catch (e) { }
  } else if (window.ActiveXObject) {
    for (var i = 0; i < ajax_activex_object_types.length; i++) {
      try { req = new ActiveXObject(ajax_activex_object_types[i]) } catch(e) { }
      if (req) {
        ajax_activex_object_types = [ajax_activex_object_types[i]]; // cache
        break;
      }
    }
  }
  return req;
}

function ajax_post (args) {
  args.method = 'POST';
  return ajax_get(args);
}

function ajax_get (args) {
  var req = args.request ? args.request : ajax_xmlhttp_request();

  if (! req) { alert('Could not find a workable XMLHttpRequest object.'); return }

  if (! args.method) args.method = 'GET';
  if (! args.url) { alert('Missing url parameter'); return }
  if (typeof(args.async) == 'undefined') args.async = true;
  if (! args.content) args.content = '';
  if (! args.handler && args.async) { alert('Missing handler function parameter'); return }
  if (args.keyval) {
    for (var i = 0; i < args.keyval.length; i += 2) {
      if (args.content.length) args.content += '&';
      args.content += encodeURIComponent(args.keyval[i]) + '=' + encodeURIComponent(args.keyval[i+1]);
    }
  }

  if (! args.username)
       req.open(args.method, args.url, args.async);
  else req.open(args.method, args.url, args.async, args.username, args.password);

  req.onreadystatechange = function () {
    if (req.readyState != 4) {
      if (args.handler_other_state) args.handler_other_state(req, args, req.readyState);
      return;
    }
    if (req.status != 200) {
      if (req.status == 0) {
        if (args.handler_0_status) args.handler_0_status(req, args);
        return;
      }
      if (args.handler_other_status) args.handler_other_status(req, args, req.status);
      else alert('Got a non-200 status: '+req.status+' - '+req.statusText);
      return;
    } 
    if (args.handler) args.handler(req, args);
  };

  //Provide a header so that scripts can determine if this is an ajax type request
  req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  if (args.method == 'POST') {
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }
  if (args.headers)
    for (var i = 0; i < args.headers.length; i++)
      req.setRequestHeader(args.headers[i][0], args.headers[i][1]);

  if (args.withCredentials) {
    req.withCredentials = true;
  }

  req.send(args.content);

  return req;
}

function eval_script(text) {
    if (!text) return text;
    if (window.execScript){
        window.execScript(text);
    } else {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        var webkit = (navigator.taintEnabled) ? false : ((document.evaluate) ? ((document.querySelector) ? 525 : 420) : 419);
        script[(webkit && webkit < 420) ? 'innerText' : 'text'] = text;
        document.head.appendChild(script);
        document.head.removeChild(script);
    }
    return text;
};

function strip_scripts (text, option) { 
    var scripts = '';
    text = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
            scripts += arguments[1] + '\n';
            return '';
            });
    if (option === true) eval_script(scripts);
    else if (typeof option == 'function') option(scripts, text);
    return text;
};
