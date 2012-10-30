/*  
 07110072 컴퓨터공학과 한승호
 Javascript rss parser

[참고한 소스코드]
    Simple Javascript RSS Reader Version 1.0
	Copyright (c) 2006 CS Truter
	Written by Christoff Truter
	email: Christoff@cstruter.com - (Please let me know if you intend to use the script) 
*/

// 요소의 값을 리턴하는 함수
function getNode(TagName, node)
{
	var currentNode = (node == null) ? xmlDoc.getElementsByTagName(TagName) : 
					items[node].getElementsByTagName(TagName);
	if(currentNode.length > 0)
		return currentNode[0].firstChild.nodeValue;
}

/* 브라우저 별로 XML을 입력*/
function ReadRSS(rssFeed, Body, Title) 
{
	rssTitle = document.getElementById(Title);	
	rssBody = document.getElementById(Body);

	try
	{	
		if ($.browser.msie) { 
			// 인터넷 익스플로러에서는 엑티브엑스 XMLDOM 사용
			var errorHappendHere = "브라우저 보안상태를 체크하세요.";
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		}else if ($.browser.webkit) {
			// 웹킷 브라우저 (구글 크롬)은 외부파일 보안 정책 때문에 클라이언트-스크립트로는 XML을 처리 못함
			var errorHappendHere = "보안 문제로 이 브라우저는 지원하지 않습니다. LIST2를 사용해주세요.";			
		}else {
			// 파이어폭스에서의 동작
			var errorHappendHere = "원격의 XML을 읽을 수 없습니다. 서버에 파일을 복사하세요.";
			xmlDoc = document.implementation.createDocument("","",null);
		}		
		
		xmlDoc.async=false;
		xmlDoc.load(rssFeed);
		
		//RSS FEED(XML문서)의 요소는 item으로 구별
		items=xmlDoc.getElementsByTagName('item');
		SetRSSTemplates();
	}
	
	catch(e)
	{	
		//로드 실패시 에러 출력	
		ViewReset();		
		var err_log="";
		err_log += "<h1>Error</h1>"; 	
		err_log += "<p>에러 메세지 : "+e.message+"<br/> "+errorHappendHere+"</p>";
				
		$(rssTitle).append(err_log);		
	}
}

/* RSS 뷰 초기화 */
function ViewReset()
{
	$(rssTitle).empty();		
	$('.rss').remove();
}

/* jQuery apeend 메소드를 이용한 HTML 출력 */
function SetRSSTemplates()
{
	ViewReset();
	if (rssTitle)
	{	
	
		var output="";
		output += "<h1>"+getNode('title')+"</h1>"; 	
		output += "<p>"+getNode('description')+"</p>";
		output += "<p><a class='btn btn-primary btn-large' target='_blink' href='"+getNode('link')+"'><i class='icon-eye-open icon-white'/> 웹사이트 이동 </a></p>";
		
		$(rssTitle).append(output);			
	}
		
	if (rssBody)
	{

		var content="<div class='row-fluid'>";
		for(var i=0; i< items.length; i++) 
		{
			content += '<div class="span3 rss">';
			content += "<h3>"+getNode('title',i)+"</h3>";
			content += "<p class='date'>"+getNode('pubDate',i)+"</p>";
			content += "<p>"+getNode('description',i)+"</p>";
			content += "<p><a class='btn-mini' href='"+getNode('link',i)+"'>원문 보기 &raquo;</a></p>";			
			content += "</div>";;						
			
			if(i==3 || i==7 || i==11 || i==15){				
				content += '</div>';
				content += "<div class='row-fluid'>";				
			}
		}
		$(rssBody).append(content);	
	}


}
