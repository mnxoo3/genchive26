/* 아티스트 메시지 데이터 — 대화 추가/수정은 이 파일의 BLOCKS 배열에 항목을 더하면 됩니다.
   block = { d:'YYYY-MM-DD', t:'HH:MM', items:[ ... ] }   (한 사람이 연속 전송한 묶음, 캡처의 이름·시간 헤더 1개 단위)
   item  = { k:'t', v:'텍스트' }                       말풍선
         | { k:'e', v:'🧐' }                          이모지 단독 말풍선
         | { k:'p', id:'p01', w:3, h:4 }              사진 (id → PHOTOS 참조, w:h 는 표시 비율)
         | { k:'r', q:'인용문', a:'답장' }             답장 카드
*/
window.PHOTOS = {
  p01:{web:'media/web/p01.jpg',mid:'media/mid/p01.jpg',thumb:'media/thumb/p01.jpg',orig:'media/original/p01.jpg'},
  p02:{web:'media/web/p02.jpg',mid:'media/mid/p02.jpg',thumb:'media/thumb/p02.jpg',orig:'media/original/p02.jpg'},
  p03:{web:'media/web/p03.jpg',mid:'media/mid/p03.jpg',thumb:'media/thumb/p03.jpg',orig:'media/original/p03.jpg'},
  p04:{web:'media/web/p04.jpg',mid:'media/mid/p04.jpg',thumb:'media/thumb/p04.jpg',orig:'media/original/p04.jpg'},
  p05:{web:'media/web/p05.jpg',mid:'media/mid/p05.jpg',thumb:'media/thumb/p05.jpg',orig:'media/original/p05.jpg'},
  p06:{web:'media/web/p06.jpg',mid:'media/mid/p06.jpg',thumb:'media/thumb/p06.jpg',orig:'media/original/p06.jpg'},
  p07:{web:'media/web/p07.jpg',mid:'media/mid/p07.jpg',thumb:'media/thumb/p07.jpg',orig:'media/original/p07.jpg'},
  p08:{web:'media/web/p08.jpg',mid:'media/mid/p08.jpg',thumb:'media/thumb/p08.jpg',orig:'media/original/p08.jpg'},
  p09:{web:'media/web/p09.jpg',mid:'media/mid/p09.jpg',thumb:'media/thumb/p09.jpg',orig:'media/original/p09.jpg'},
  p10:{web:'media/web/p10.jpg',mid:'media/mid/p10.jpg',thumb:'media/thumb/p10.jpg',orig:'media/original/p10.jpg'},
  p11:{web:'media/web/p11.jpg',mid:'media/mid/p11.jpg',thumb:'media/thumb/p11.jpg',orig:'media/original/p11.jpg'},
  p12:{web:'media/web/p12.jpg',mid:'media/mid/p12.jpg',thumb:'media/thumb/p12.jpg',orig:'media/original/p12.jpg'},
  p13:{web:'media/web/p13.jpg',mid:'media/mid/p13.jpg',thumb:'media/thumb/p13.jpg',orig:'media/original/p13.jpg'},
  p14:{web:'media/web/p14.jpg',mid:'media/mid/p14.jpg',thumb:'media/thumb/p14.jpg',orig:'media/original/p14.jpg'},
  p15:{web:'media/web/p15.jpg',mid:'media/mid/p15.jpg',thumb:'media/thumb/p15.jpg',orig:'media/original/p15.jpg'},
  p16:{web:'media/web/p16.jpg',mid:'media/mid/p16.jpg',thumb:'media/thumb/p16.jpg',orig:'media/original/p16_frame.png'},
  p17:{web:'media/web/p17.jpg',mid:'media/mid/p17.jpg',thumb:'media/thumb/p17.jpg',orig:'media/original/p17.jpg'},
  p18:{web:'media/web/p18.jpg',mid:'media/mid/p18.jpg',thumb:'media/thumb/p18.jpg',orig:'media/original/p18.jpg'},
  p19:{web:'media/web/p19.jpg',mid:'media/mid/p19.jpg',thumb:'media/thumb/p19.jpg',orig:'media/original/p19.jpg'},
  p20:{web:'media/web/p20.jpg',mid:'media/mid/p20.jpg',thumb:'media/thumb/p20.jpg',orig:'media/original/p20.jpg'},
  p21:{web:'media/web/p21.jpg',mid:'media/mid/p21.jpg',thumb:'media/thumb/p21.jpg',orig:'media/original/p21.jpg'},
  p22:{web:'media/web/p22.jpg',mid:'media/mid/p22.jpg',thumb:'media/thumb/p22.jpg',orig:'media/original/p22.jpg'},
  p23:{web:'media/web/p23.jpg',mid:'media/mid/p23.jpg',thumb:'media/thumb/p23.jpg',orig:'media/original/p23.jpg'},
  p24:{web:'media/web/p24.jpg',mid:'media/mid/p24.jpg',thumb:'media/thumb/p24.jpg',orig:'media/original/p24.jpg'}
};
window.BLOCKS = [
 {d:'2026-03-17',t:'16:20',items:[{k:'t',v:'안녕하세요~ 이제부터 비스테이지로 인사 드리겠습니다!'}]},
 {d:'2026-03-22',t:'00:14',items:[{k:'p',id:'p01',w:3,h:4},{k:'p',id:'p02',w:3,h:4},{k:'t',v:'이게대체뭡니까'}]},
 {d:'2026-04-05',t:'20:12',items:[{k:'t',v:'ㅎㅇ'},{k:'t',v:'이렇게하는거맞나'}]},
 {d:'2026-04-05',t:'20:12',items:[{k:'e',v:'🧐'}]},
 {d:'2026-04-05',t:'20:15',items:[{k:'t',v:'와'},{k:'t',v:'이거 신기하다'}]},
 {d:'2026-04-05',t:'20:16',items:[{k:'t',v:'자주오겠습니다'}]},
 {d:'2026-04-05',t:'20:16',items:[{k:'t',v:'경기화이팅!'}]},
 {d:'2026-04-11',t:'21:41',items:[{k:'t',v:'다음에 있을 경기 꼭 잘하겠습니다 죄송합니다🥲'}]},
 {d:'2026-04-15',t:'19:55',items:[{k:'t',v:'오늘 다들 맛잇는거 드세요~'},{k:'t',v:'저희는 장어먹을거같습니다'}]},
 {d:'2026-04-18',t:'17:13',items:[{k:'p',id:'p03',w:3,h:4}]},
 {d:'2026-04-18',t:'17:14',items:[{k:'t',v:'헬스장에서 팬분이주셨다..'}]},
 {d:'2026-04-18',t:'17:15',items:[{k:'r',q:'오늘 헬스 루틴이 어캐되나요',a:'하드하게 가슴조졌습니다'},{k:'r',q:'헬스장에서 만나는건 어떤 기분일까요?ㅎㅎ',a:'조용하게 옆에두고가심..'}]},
 {d:'2026-05-12',t:'16:44',items:[{k:'t',v:'드디어바꿨습니다'},{k:'t',v:'낫스크림 끝나고 운동갈준비중'}]},
 {d:'2026-06-04',t:'17:19',items:[{k:'p',id:'p04',w:3,h:4},{k:'t',v:'육개장인형탈 발견'}]},
 {d:'2026-06-07',t:'09:49',items:[{k:'p',id:'p05',w:3,h:4},{k:'t',v:'아는형 집들이갔는데'}]},
 {d:'2026-06-07',t:'09:50',items:[{k:'t',v:'프렌치불독도귀엽네요'},{k:'t',v:'이름은 곰둥이'}]},
 {d:'2026-06-08',t:'22:19',items:[{k:'p',id:'p06',w:4,h:3},{k:'t',v:'민성 재희'},{k:'t',v:'글램핑와써요'}]},
 {d:'2026-06-08',t:'22:20',items:[{k:'p',id:'p07',w:4,h:3},{k:'t',v:'실시간'}]},
 {d:'2026-06-18',t:'21:50',items:[{k:'p',id:'p08',w:3,h:4},{k:'t',v:'운동마싯돠'}]},
 {d:'2026-06-19',t:'10:35',items:[{k:'p',id:'p09',w:3,h:4},{k:'t',v:'아침형인간의 삶'}]},
 {d:'2026-06-24',t:'22:00',items:[{k:'t',v:'여러분 오늘 11시에 방송 컨디션이 좀 안좋아서 쉬겠습니다..'},{k:'t',v:'다른날에 더 많이 방송할게욥'}]},
 {d:'2026-06-25',t:'16:04',items:[{k:'t',v:'20분이따가 방송하겠습니다 2~2시간반정도 진행할거같습니다!'}]},
 {d:'2026-06-27',t:'18:04',items:[{k:'p',id:'p10',w:3,h:4},{k:'t',v:'친한형과 인왕산'},{k:'t',v:'바위에누웠더니 머리가 일케됌'}]},
 {d:'2026-06-27',t:'18:05',items:[{k:'r',q:'몇시부터 등반했나용',a:'주차할데가없어서 4시쯤부터 시작햇어요..'}]},
 {d:'2026-06-27',t:'18:06',items:[{k:'r',q:'어디까지 올라가셨어요?',a:'힘들어서 정상바로앞까지 ㅋ'}]},
 {d:'2026-07-24',t:'18:13',items:[{k:'p',id:'p11',w:3,h:4},{k:'t',v:'오운완'}]},
 {d:'2026-08-14',t:'23:09',items:[{k:'t',v:'다음엔 솔킬 두번따도록하겠습니다'},{k:'t',v:'오늘 응원와주셔서 감사해욥'}]},
 {d:'2026-08-20',t:'22:29',items:[{k:'p',id:'p12',w:3,h:4},{k:'t',v:'한번이기기힘드네'},{k:'t',v:'후'}]},
 {d:'2026-08-20',t:'22:30',items:[{k:'t',v:'반등갑니다'}]},
 {d:'2026-08-23',t:'23:19',items:[{k:'p',id:'p13',w:3,h:4},{k:'e',v:'👍'}]},
 {d:'2026-08-31',t:'02:41',items:[{k:'p',id:'p14',w:3,h:4},{k:'t',v:'새벽에 차타고 본가왔어요'},{k:'t',v:'둥이 할머니집가서 집에없어요 ㅜ'}]},
 {d:'2026-08-31',t:'02:43',items:[{k:'t',v:'비가 기분나쁘게 오다말다 하더라고요'}]},
 {d:'2026-08-31',t:'02:44',items:[{k:'r',q:'그래도 생존신고는 해줘요...',a:'옙!'}]},
 {d:'2026-08-31',t:'19:36',items:[{k:'t',v:'??'},{k:'p',id:'p15',w:3,h:4}]},
 {d:'2026-08-31',t:'19:39',items:[{k:'t',v:'아기니깐 살려주겠습니다'}]},
 {d:'2026-09-03',t:'15:08',items:[{k:'p',id:'p16',w:9,h:16},{k:'t',v:'왜 날 그렇게..'}]},
 {d:'2026-09-03',t:'15:24',items:[{k:'t',v:'둥이가절피해서 같이안찍혀요'},{k:'t',v:'ㅠㅠ'}]},
 {d:'2026-09-10',t:'01:29',items:[{k:'p',id:'p17',w:3,h:4},{k:'t',v:'운동좀쉬니까 힘드네요'}]},
 {d:'2026-09-15',t:'23:10',items:[{k:'p',id:'p18',w:3,h:4},{k:'t',v:'일단비주얼은 낫벧'},{k:'t',v:'먹러볼게요'}]},
 {d:'2026-09-15',t:'23:37',items:[{k:'t',v:'350치곤 아주훌륭합니다'},{k:'t',v:'시우형짜장면먹엇는데'},{k:'t',v:'그게더맛잇네요'}]},
 {d:'2026-09-21',t:'13:07',items:[{k:'p',id:'p19',w:3,h:4},{k:'t',v:'또다시 대구출발'}]},
 {d:'2026-09-21',t:'18:59',items:[{k:'t',v:'그래도 오늘오니까 올만하네요'},{k:'t',v:'힘드네요'}]},
 {d:'2026-09-24',t:'14:25',items:[{k:'p',id:'p24',w:3,h:4}]},
 {d:'2026-09-24',t:'14:26',items:[{k:'t',v:'할머니집가는중'}]},
 {d:'2026-10-02',t:'15:38',items:[{k:'p',id:'p20',w:3,h:4},{k:'t',v:'칼퇴좋다잉'}]},
 {d:'2026-10-08',t:'02:32',items:[{k:'p',id:'p21',w:3,h:4},{k:'t',v:'힘들구나~~~~'}]},
 {d:'2026-10-08',t:'02:34',items:[{k:'t',v:'요즘 계속 이시간에하게되네요'},{k:'t',v:'휴가가 기니 살만찌고…'}]},
 {d:'2026-10-08',t:'02:35',items:[{k:'r',q:'얼굴 보니까 너무 좋아 요즘 뭐하고 지냈어요??',a:'늦잠 밥 술or운동 잠'}]},
 {d:'2026-10-08',t:'02:36',items:[{k:'r',q:'보고싶어요 저도… 휴가 너무 깁니다 ㅠ.ㅠ',a:'이제 담주월욜부턴 방송키면 솔랭하려고요....'}]},
 {d:'2026-10-19',t:'05:46',items:[{k:'p',id:'p22',w:3,h:4},{k:'t',v:'긴장됐던 하루..'},{k:'t',v:'좋은경험하고갑니다잉'}]},
 {d:'2026-11-11',t:'03:47',items:[{k:'p',id:'p23',w:3,h:4},{k:'t',v:'새벽운동힘들고만'}]},
 {d:'2026-11-11',t:'03:51',items:[{k:'r',q:'벽느껴진다 나 지금 잘 생각중인데 킹겐은 지금 일어났다구?',a:'가슴운동했어요 ㅎㅎ 저도 이제자려고요…'}]}
];
/* 이름·프로필 적용 시작일 (과거 메시지에 현재 값을 소급 적용하지 않음) */
window.IDENTITY = [
  {from:'2026-03-17',name:'Kingen',avatar:'assets/profile-default.png',avatarOrig:'media/original/profile-default.png'},
  {from:'2026-05-12',name:'계란학살자',avatar:'assets/profile-dog.jpg',avatarOrig:'media/original/profile-dog.jpg'}
];
window.CONFIG = {
  password:'0311',   /* 첫 화면 비밀번호 (화면을 가리는 용도일 뿐, 파일 자체를 잠그지는 못함) */
  headerName:'계란학살자',
  headerSubTemplate:'함께한지 {n}일',   /* {n} = 시작일부터 오늘(한국시간)까지의 일수 */
  startDate:'2026-03-17',
  startCountsAsDay1:true,               /* true: 시작일을 1일로 계산 / false: 시작일을 0일로 계산 */
  artistBackground:null   /* 아티스트 지정 배경 이미지 경로를 여기에 넣으면 배경 전환이 켜집니다 */
};
