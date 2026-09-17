/* 文章、写真、公開確認状態をここで管理する。sourceStatus は通常画面に表示しない。 */
window.TRIP_THEMES = [
  { id:"land", date:"08.10—11", place:"花蓮・富里・羅山", map:{x:112,y:190}, title:"匂いと土地", catch:"土地にあるもので、発酵する。", text:"川辺の朝、行列のできる臭豆腐、山の畑、泥火山の水で固める豆腐。発酵は特別な工房だけにあるのではなく、匂い、天気、土、水、人の暮らしのなかにあった。", sourceStatus:"needs-check", photos:[
    {src:"images/IMG_4733.JPG", alt:"川辺の風景", caption:"川辺で過ごす人たち / 8.10"},
    {src:"images/IMG_4784.JPG", alt:"臭豆腐店の前に並ぶ人々", caption:"玉里橋頭臭豆腐の行列 / 8.10"},
    {src:"images/IMG_4861.JPG", alt:"花の咲く山の景色", caption:"六十石山付近 / 8.11"},
    {src:"images/IMG_5028.JPG", alt:"切り分けられた豆腐", caption:"泥火山豆腐 / 8.11"}
  ]},
  { id:"culture", date:"08.12", place:"台東", map:{x:116,y:278}, title:"仕込む前から、醸造は始まっている", catch:"文化は、見るだけでは残らない。", text:"台東で見たのは、阿美族の発酵肉Sirawと、土地の植物からつくる酒麹の展示だった。穀物を育て、植物を採り、知恵を手渡す。酒を仕込む前から、醸造文化は始まっている。", sourceStatus:"needs-check", photos:[
    {src:"images/IMG_5202.JPG", alt:"粟などの穀物を展示する台東博覧会", caption:"台東博覧会・穀物の展示 / 8.12"}
  ]},
  { id:"craft", date:"08.13", place:"屏東・醤油蔵", map:{x:130,y:360}, title:"技術は海を渡り、その土地の味になる", catch:"つくる手は、知識をしまっている。", text:"田んぼのなかの醤油蔵で、甕と麹と、独学で集められた知恵に出会った。日本の分類や種麹を手がかりにしても、できあがるのはここでしか生まれない味だった。", sourceStatus:"needs-check", photos:[
    {src:"images/IMG_5414.JPG", alt:"醤油蔵に並ぶ大きな甕", caption:"醤油蔵の甕 / 8.13"},
    {src:"images/IMG_5432.JPG", alt:"麹の棚と作業する人", caption:"麹と手仕事 / 8.13"}
  ]},
  { id:"tool", date:"08.14", place:"台南・北埔", map:{x:136,y:112}, title:"時間と道具に、記憶が残る", catch:"菌の記憶は、古い紐にも残るのだろうか。", text:"長い時間を経た茶を飲み、新竹の酸柑茶では、縛る紐にも環境の記憶が残るという話を聞いた。食材だけではない。繰り返し使われた道具や、場そのものが味を育てている。", sourceStatus:"interpretation", photos:[
    {src:"images/IMG_5592.JPG", alt:"酸柑茶の工房の入り口", caption:"酸柑茶の工房へ / 8.14"},
    {src:"images/IMG_5600.JPG", alt:"紐で縛られた酸柑茶", caption:"蒸して干される酸柑茶 / 8.14"},
    {src:"images/IMG_5604.jpg", alt:"紐で縛られた酸柑茶の近景", caption:"紐と茶の近景 / 8.14"},
    {src:"images/IMG_5606.JPG", alt:"酸柑茶の工房", caption:"酸柑茶の工房 / 8.14"}
  ]},
  { id:"season", date:"08.15", place:"台北・迪化街", map:{x:138,y:62}, title:"獲らない季節", catch:"獲らない季節がある。だから発酵が必然になる。", text:"泰雅族の方との対話から、自然が休む時期に人が合わせる時間を考えた。", sourceStatus:"needs-check", photos:[
    {src:"images/IMG_5919.JPG", alt:"台北で集まった人々", caption:"台北・發酵迷での夜 / 8.15"}
  ]},
  { id:"handover", date:"08.16", place:"台北・大稻埕", map:{x:138,y:62}, title:"ぬか床を渡す", catch:"京都から抱えてきた熟成ぬか床を、分けて渡した。", text:"講演とぬか床クリニックのあとに、熟成ぬか床を手渡した。文化は、一方通行ではなく、渡るたびにこちらへも返ってくる。", sourceStatus:"needs-check", photos:[
    {src:"images/chapter-07/IMG_5991.JPG", alt:"ぬか床を手渡す場面", caption:"熟成ぬか床を手渡す / 8.16"}
  ]}
];

window.TRIP_THEMES[0].href = "index.html#smell";
window.TRIP_THEMES[1].href = "chapter-03.html#siraw";
window.TRIP_THEMES[2].href = "chapter-04.html#brewery";
window.TRIP_THEMES[3].href = "chapter-05.html";
window.TRIP_THEMES[4].href = "chapter-06.html";
window.TRIP_THEMES[5].href = "chapter-07.html";
