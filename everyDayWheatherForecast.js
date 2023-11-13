function EveryDayWheatherForecast() {
  const targetUrl = "https://tenki.jp/forecast/6/30/6200/27100/";
  const html = UrlFetchApp.fetch(targetUrl).getContentText("UTF-8");
  const tgtHtml = html.match(/<section class="today-weather">[\s\S]*?<\/section>/)[0];

  let sendText = "";

  const today = tgtHtml.match(/[1-9].?月[1-9].?日/)[0];
  const wheather = tgtHtml.match(/alt="([^"]*)"/)[1];
  sendText += `${today}：${wheather}\n`;

  const temps = tgtHtml.match(/<dt class="high-temp sumarry">最高<\/dt>\s*<dd class="high-temp temp"><span class="value">(\d+)<\/span><span class="unit">℃<\/span><\/dd>\s*<dd class="high-temp tempdiff">\[(.+?)\]<\/dd>\s*<dt class="low-temp sumarry">最低<\/dt>\s*<dd class="low-temp temp"><span class="value">(\d+)<\/span><span class="unit">℃<\/span><\/dd>\s*<dd class="low-temp tempdiff">\[(.+?)\]<\/dd>/);
  sendText += `最高：${temps[1]}℃ [${temps[2]}]\n最低：${temps[3]}℃ [${temps[4]}]\n`;

  let probHtml = tgtHtml.substring(tgtHtml.indexOf("<th>降水確率</th>"));
  probHtml = probHtml.substring(probHtml.indexOf("<td>") + 4);
  let prob1 = (probHtml[0] === "<")? "---" : probHtml.substring(0, probHtml.indexOf("<span")) + "%";
  probHtml = probHtml.substring(probHtml.indexOf("<td>") + 4);
  let prob2 = (probHtml[0] === "<")? "---" : probHtml.substring(0, probHtml.indexOf("<span")) + "%";
  probHtml = probHtml.substring(probHtml.indexOf("<td>") + 4);
  let prob3 = (probHtml[0] === "<")? "---" : probHtml.substring(0, probHtml.indexOf("<span")) + "%";
  probHtml = probHtml.substring(probHtml.indexOf("<td>") + 4);
  let prob4 = (probHtml[0] === "<")? "---" : probHtml.substring(0, probHtml.indexOf("<span")) + "%";
  sendText += `降水確率：${prob1}, ${prob2}, ${prob3}, ${prob4}\n`;

  sendText += `詳細：${targetUrl}`;

  SlackPost("毎朝お天気情報", ":sunrise_over_mountains:", sendText);
  LinePost("毎朝お天気情報", ":sunrise_over_mountains:", sendText);
}