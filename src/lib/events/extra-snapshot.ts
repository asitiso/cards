import type { EntryEvent, IssuerId } from "./types.ts";

export const EXTRA_AT = "2026-10-08T11:54:56.281717+09:00";

export const EXTRA_EVENTS: EntryEvent[] = [
  {
    "id": "samsung:3758066",
    "issuer": "samsung",
    "listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
    "title": "모니모페이로 결제하면 최대 100만 모니머니 행운",
    "summary": "2,323명 에게 모니머니 선물!",
    "benefit": "2,323명 에게 모니머니 선물!",
    "conditions": [
      "모니모페이로 결제하면",
      "간편하게 결제하고 최대 100만 모니머니에 도전해 보세요!",
      "행사기간 2026.10.1(목)~10.31(토) (카드 승인일 기준) 대상카드 삼성개인신용카드 (가족카드 포함) 혜택",
      "아래 &lsquo;응모하기&rsquo;를 눌러 행사 응모",
      "모니모페이에 등록된 대상카드로 1,000원 이상 결제"
    ],
    "exclusions": [
      "2026.11.20까지 삼성카드에 휴대폰번호가 등록되어 있지 않거나 정확하지 않을 경우 혜택이 제공되지 않음",
      "네이버페이, 카카오페이, PAYCO, Paypal, 유비페이 등을 통한 간편결제건 제외(모니모페이에 등록된 삼성 페이 결제건은 포함)",
      "세금/공과금/제약/대학등록금 결제건 제외",
      "일부 이용금액(쿠폰 할인, 포인트 사용 결제건 등) 및 결제 취소건 제외"
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3758066"
  },
  {
    "id": "samsung:3757273",
    "issuer": "samsung",
    "listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
    "title": "SC제일은행 삼성카드 최대 11만원 캐시백",
    "summary": "26.10.01 ~ 26.10.31",
    "benefit": "26.10.01 ~ 26.10.31",
    "conditions": [
      "SC제일은행 삼성카드",
      "혜택 1 행사 기간 2026.10.01~2026.10.31 대상회원",
      "행사 직전 6개월(2026.04.01~2026.09.30) 동안 삼성개인신용카드 결제 및 탈회 이력이 없는 회원",
      "결제 이력은 후불하이패스카드, 무승인 결제건(대중교통, 이동통신 등 정기결제건, 문자알림서비스 결제건 등) 포함",
      "2022.1.1(토)부터 혜택 지급일까지 삼성카드의 다른 행사 혜택(캐시백, 포인트, 마일리지 등) 을 받은 이력이 없는 회원"
    ],
    "exclusions": [
      "오프라인 채널(모집인, 텔레마케팅&trade; 등)을 통해 보유한 경우 행사대상에서 제외",
      "혜택이 잘못 제공된 경우(중복 제공 등) 받은 혜택이 카드 결제계좌에서 자동 출금될 수 있음",
      "신규 회원 연회비 캐시백 행사 등 삼성카드의 다른 행사 혜택(캐시백,포인트,쿠폰 등)과 중복 제공되지않음",
      "이용금액은 할인, 쿠폰/포인트 사용 등을 제외한 최종 결제금액 기준 으로 합산하여 산정"
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3757273"
  },
  {
    "id": "samsung:3757207",
    "issuer": "samsung",
    "listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
    "title": "나의 퍼스트 프리미엄, 15만원 캐시백!",
    "summary": "행사기간 26.10.01(목)~26.10.31(토)(카드 신청일 기준)",
    "benefit": "행사기간 26.10.01(목)~26.10.31(토)(카드 신청일 기준)",
    "conditions": [
      "행사기간 26.10.01(목)~26.10.31(토)(카드 신청일 기준)",
      "혜택 행사기간 내 대상카드 최초 발급 시 15만원 캐시백",
      "2022.01.01(토) 부터 혜택 제공일 전까지 삼성카드의 다른 이벤트 혜택(캐시백, 포인트/마일리지 적립 등)을 받은 경우 제공 조건을 충족하더라도 혜택을 받을 수 없음",
      "아래 &lsquo;응모하기&rsquo;를 눌러 이벤트 응모",
      "삼성카드 홈페이지/모니모앱에서 대상 카드 신규 발급"
    ],
    "exclusions": [
      "행사기간 시작일 기준, 직전 6개월 동안 삼성개인신용카드 탈회 이력이 있는 회원의 경우 행사대상에서 제외",
      "기존 삼성카드 회원의 추가/교체 발급 건은 제외",
      "혜택이 중복 제공되거나 혜택을 받은 달로부터 12개월 내에 삼성카드 탈회 시, 받은 혜택은 카드 결제계좌에서 자동 출금될 수 있음",
      "이용금액 산정시 선불카드 충전, 대중교통 이용 건 제외"
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3757207"
  },
  {
    "id": "samsung:3757150",
    "issuer": "samsung",
    "listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
    "title": "프리미엄 카드 혜택 연회비 100% 캐시백",
    "summary": "26.10.01 ~ 26.10.31",
    "benefit": "26.10.01 ~ 26.10.31",
    "conditions": [
      "프리미엄 카드 혜택",
      "행사기간 2026.10.01(목)~10.31(토) (카드 신청일 기준)",
      "행사기간 동안 아래 &lsquo;응모하기&rsquo;를 눌러 행사 응모",
      "삼성카드 홈페이지, 모니모 앱, 네이버 광고채널에서 대상카드 신규 신청 및 발급",
      "2026.10.01(목)~2026.11.30(월) (승인일 기준, 무승인 결제건은 매출전표 접수일 기준) 동안 대상카드로 국내외 가맹점에서 일시불 및 할부 합산 50만원 이상 이용"
    ],
    "exclusions": [
      "대상카드 중복 발급의 경우 신규 발급건에 한해 제공",
      "기존 삼성카드 회원의 추가/교체 발급건 제외",
      "토스, 삼성페이, 네이버페이, 카카오페이, 카카오뱅크, 카드고릴라 등 제휴채널을 통한 신청 및 발급건은 제외",
      "행사 직전 6개월(2026.04.01~2026.09.30) 동안 삼성개인신용카드 탈회 이력이 있는 회원의 경우 행사대상에서 제외"
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3757150"
  },
  {
    "id": "samsung:3756954",
    "issuer": "samsung",
    "listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
    "title": "Visa 삼성카드 해외 최대 100만원 캐시백",
    "summary": "26.10.01 ~ 26.10.31",
    "benefit": "26.10.01 ~ 26.10.31",
    "conditions": [
      "행사기간 2026.10.01(목)~10.31(토)(카드 승인일 기준)",
      "카드 승인일은 한국 표준시 기준",
      "대상카드 Visa 브랜드로 표시된 삼성개인신용카드 (가족카드 포함) 혜택 응모 후 해외가맹점(온·오프라인)에서 대상카드로 일시불 및 할부 합산 100/300/500/1,000/2,000/3,000/5,000만원 이상 이용 시",
      "혜택제공 2027.01.22(금) 이후 카드 결제대금내역에서 확인 가능",
      "본인 회원에 한해 응모 가능"
    ],
    "exclusions": [
      "예산 소진 시 조기 종료될 수 있음",
      "해외 결제 후 취소 시 혜택 지급 대상에서 제외될 수 있으며, 이미 혜택이 지급된 경우에는 혜택 지급액 만큼 카드 결제계좌에서 자동 출금될 수 있음",
      "혜택이 잘못 제공된 경우(중복 제공 등) 받은 혜택이 카드 결제계좌에서 자동 출금될 수 있음",
      "원화 결제를 제외한 외화(USD, JPY 등) 결제건에 한함"
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3756954"
  },
  {
    "id": "samsung:3757147",
    "issuer": "samsung",
    "listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
    "title": "삼성카드 회원을 위한 리저브 애프터눈 커피 세트",
    "summary": "26.10.06 ~ 26.10.31",
    "benefit": "26.10.06 ~ 26.10.31",
    "conditions": [
      "삼성카드 회원을 위한",
      "카드 혜택은 전월 실적 50만원 이상 시 제공 되며 스타벅스 선불카드 충전 이용 시는 전월 실적 관계없이 적립 [ 월 누적 별 적립한도 최대 180개 ]",
      "스타벅스 삼성카드 자세히 보기",
      "행사기간 2026.10.6(화) ~ 10.31(토) (행사 응모일 기준) 대상카드 스타벅스 삼성카드 혜택 리저브 애프터눈 커피 세트 2인 초대권 2장 + 제조음료 무료쿠폰 2장",
      "행사대상 아래 조건을 모두 충족하는 회원"
    ],
    "exclusions": [
      "방문별 혜택의 경우 스타벅스 선불카드 충전 건은 제외",
      "신규 회원 연회비 캐시백 등 삼성카드의 다른 행사 혜택(캐시백, 포인트, 쿠폰, 마일리지 등)과 중복 제공되지 않음",
      "이용금액은 할인, 쿠폰/포인트 사용 등을 제외한 최종 결제금액 기준으로 합산하여 산정",
      "이용금액 산정 시 단기카드대출(현금서비스), 장기카드대출(카드론), 각종 수수료 및 이자(할부수수료, 카드대출 이자 등), 연체료, 연회비 납부건 제외"
    ],
    "startDate": "2026-10-06",
    "endDate": "2026-10-31",
    "applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3757147"
  },
  {
    "id": "lotte:11292",
    "issuer": "lotte",
    "listUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V100.lc",
    "title": "트래블월렛 하이브리드 롯데카드 20만원 캐시백",
    "summary": "class=\"eventDetail\">",
    "benefit": "class=\"eventDetail\">",
    "conditions": [
      "트래블월렛 하이브리드 롯데카드로 이용 기간 내 국내 및 해외에서 30만원 이상 결제 시 트래블월렛 원화(KRW) 20만원 지급",
      "회원당 기간 내 1회 제공되며, 이벤트 응모 필수",
      "응모기간 : 2026.10.1(목) ~ 10.31(토)",
      "이용기간 : 2026.10.1(목) ~ 11.10(화)",
      "혜택 01 : 행사 시작일 직전 6개월 동안 (2026.4.1(수) ~ 9.30(수)) 롯데 개인 신용카드 결제 이력이 없는 회원"
    ],
    "exclusions": [
      "(단, 행사 시작일 직전 12개월 동안 롯데카드에서 진행한 카드 이용 이벤트에 응모하여 혜택을 제공받은 회원은 제외)",
      "이벤트 요건 및 유의사항 미확인으로 인한 혜택 미적용 시, 별도 혜택 지급 및 응모 처리가 불가합니다.",
      "신용승인건만 이용금액 실적 인정되며, 충전된 금액(트래블페이) 사용건은 실적 제외됩니다.",
      "트래블 포인트 적립 혜택은 트래블월렛 하이브리드 롯데카드로 신용 결제한 금액 대상이며, 트래블월렛의 선불충전금으로 결제된 금액은 적립대상에서 제외됩니다."
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V300.lc?evnBultSeq=11292&evnCtgSeq=9999&bigTabGubun=2"
  },
  {
    "id": "lotte:11289",
    "issuer": "lotte",
    "listUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V100.lc",
    "title": "LG전자 온라인몰(LGE.COM) 최대 50만원 캐시백",
    "summary": "class=\"eventDetail\">",
    "benefit": "class=\"eventDetail\">",
    "conditions": [
      "이용기간 내 Trip to 로카(AMEX)로 LGE.COM에서 이용 시 최대 50만원 캐시백",
      "이용 금액 구간, 캐시백 금액으로 구성된 표",
      "1,000만원 이상",
      "이벤트 응모하기 필수",
      "행사기간 직전 6개월(2026.4.1(수)~2026.9.30(수)) 동안 롯데 개인 신용카드 결제 이력이 없는 회원"
    ],
    "exclusions": [
      "이용 금액 구간 중복 적용 불가",
      "동월 내 다른 이벤트 응모 시, 이 이벤트 대상에서 제외됩니다. (최종 응모한 이벤트로 참여됨)",
      "할인제외 및 할인한도 등은 카드 자세히 보기를 통해 확인하여 주십시오.",
      "롯데카드의 다른 이용 이벤트에 참여하신 경우 중복 적용이 불가합니다."
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V300.lc?evnBultSeq=11289&evnCtgSeq=9999&bigTabGubun=2"
  },
  {
    "id": "lotte:11325",
    "issuer": "lotte",
    "listUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V100.lc",
    "title": "YBM X 디지로카로 무이자할부와 최대 15만원 혜택 받아가세요",
    "summary": "class=\"eventDetail\">",
    "benefit": "class=\"eventDetail\">",
    "conditions": [
      "대상카드로 이용기간 내 YBM에서 20만원 이상 결제 시 12개월 무이자 할부 혜택",
      "대상카드로 이용기간 내 20만원 이상 이용 시 15만원 캐시백",
      "응모기간 : 2026.9.16(수) ~ 10.31(토)",
      "카드이용기간 : 2026.9.16(수) ~ 11.30(월)",
      "행사기간 내 이벤트 응모하기를 통해 대상카드를 보유한 회원 중 최근 6개월 동안(2026.3.1 ~ 2026.8.31) 롯데카드 사용 이력이 없는 회원"
    ],
    "exclusions": [
      "무이자 할부이용금액은 제외",
      "가족회원 제외, 이벤트 응모 필수",
      "(무이자 할부이용금액은 제외)",
      "롯데카드의 다른 카드 이용 이벤트 혜택과 중복 적용되지 않으며, 오프라인(설계사, 카드영업지점 등) 또는 콜센터를 통해 소지 하고 계신 회원은 대상자 에서 제외됩니다."
    ],
    "startDate": "2026-09-16",
    "endDate": "2026-10-31",
    "applyUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V300.lc?evnBultSeq=11325&evnCtgSeq=9999&bigTabGubun=2"
  },
  {
    "id": "hana:60588",
    "issuer": "hana",
    "listUrl": "https://m.hanacard.co.kr/MKEVT1000M.web",
    "title": "생활요금 자동납부하면 최대 2만 하나머니!",
    "summary": "최대 2만 하나머니 지급! 생활요금 4종 자동납부 시",
    "benefit": "최대 2만 하나머니 지급! 생활요금 4종 자동납부 시",
    "conditions": [
      "이벤트 기간 동안 자동납부 금액이",
      "LGU+는 이용상품(유/무선, 인터넷, 알뜰폰,",
      "자동납부 신청과 이벤트 응모는",
      "아래 [응모하기]를 통해",
      "아래 \"카드이동서비스 바로가기\""
    ],
    "exclusions": [
      "지급 대상에서 제외됩니다.",
      "TV수신료는 전기요금에서 제외됩니다.",
      "자동 납부서비스는 제외됩니다.",
      "제외대상 : 하나BC"
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://m.hanacard.co.kr/MKEVT1010M.web?EVN_SEQ=60588"
  },
  {
    "id": "hana:60580",
    "issuer": "hana",
    "listUrl": "https://m.hanacard.co.kr/MKEVT1000M.web",
    "title": "결제계좌 변경하고 메가커피 10잔♡",
    "summary": "결제계좌를 하나은행으로 변경하고",
    "benefit": "결제계좌를 하나은행으로 변경하고",
    "conditions": [
      "결제계좌를 하나은행으로 변경하고",
      "월 합산 5만원 이상 이용 시 2개월간 메가MGC커피 아메리카노",
      "'응모하고 결제계좌 변경하기'",
      "결제계좌 변경 화면에서",
      "하나은행으로 결제계좌 변경"
    ],
    "exclusions": [],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://m.hanacard.co.kr/MKEVT1010M.web?EVN_SEQ=60580"
  },
  {
    "id": "nh:6463",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "쓸수록 더 받는 최대 5만원 해외 캐시백",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-09-21",
    "endDate": "2026-10-11",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6463"
  },
  {
    "id": "nh:6453",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "떴다 떴어! 가을맞이 상품권 이벤트! 추석 보름달에게 소원을 말해봐~",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-09-14",
    "endDate": "2026-10-16",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6453"
  },
  {
    "id": "nh:6469",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "'서울시 신용카드동반성장상품권' 지급 이벤트 최대 5만원 페이백!",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "'서울시 신용카드동반성장상품권' 지급 이벤트 최대 5만원 페이백!"
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-09-21",
    "endDate": "2026-10-18",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6469"
  },
  {
    "id": "nh:6400",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "[NH농협카드 X 롯데시네마] 롯데시네마 할인 예매하고 메가커피 받자!",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "[NH농협카드 X 롯데시네마] 롯데시네마 할인 예매하고 메가커피 받자!"
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-09-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6400"
  },
  {
    "id": "nh:6498",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "착한가격업소 착 붙는 혜택 왔소!",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6498"
  },
  {
    "id": "nh:6499",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "NH농협카드 쓰고 최대 14만5천원 캐시백 받자!",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "NH농협카드 쓰고 최대 14만5천원 캐시백 받자!"
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6499"
  },
  {
    "id": "nh:6472",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "관리비/휴대폰/가스/전기/4대보험 최대 35,000원 혜택!",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6472"
  },
  {
    "id": "nh:6473",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "넷플릭스 / 티빙 / 디즈니+ 구독 최대 5만원 캐시백!",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6473"
  },
  {
    "id": "nh:6474",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "쿠팡와우/네이버+멤버십 구독 첫 구독료 캐시백!",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6474"
  },
  {
    "id": "nh:6488",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "NH pay가 처음이라면, 메가MGC커피를 드립니다!",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6488"
  },
  {
    "id": "nh:6491",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "카톡 혜택 알림 받고, 경품에 커피 쿠폰까지~",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-09-30",
    "endDate": "2026-10-31",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6491"
  },
  {
    "id": "nh:6521",
    "issuer": "nh",
    "listUrl": "https://card.nonghyup.com/IPCC010001.menu",
    "title": "zgm러닝카드 출시 기념 모바일상품권 이벤트",
    "summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
    "conditions": [
      "zgm러닝카드 출시 기념 모바일상품권 이벤트"
    ],
    "exclusions": [
      "자세한 제외 업종은 카드사 안내 이미지를 확인하세요."
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-11-30",
    "applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6521"
  },
  {
    "id": "bc:2026100004",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "쇼핑적립 쿠팡 쿠팡 최대 2.5%적립 최대 3천원 추가적립",
    "summary": "쇼핑적립 쿠팡 쿠팡 최대 2.5%적립 최대 3천원 추가적립",
    "benefit": "쇼핑적립 쿠팡 쿠팡 최대 2.5%적립 최대 3천원 추가적립",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2026-10-06",
    "endDate": "2026-10-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026100004"
  },
  {
    "id": "bc:2026090040",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "커피패스 이벤트 2,900원에 2만원 커피쿠폰 받기",
    "summary": "커피패스 이벤트 2,900원에 2만원 커피쿠폰 받기",
    "benefit": "커피패스 이벤트 2,900원에 2만원 커피쿠폰 받기",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2026-10-06",
    "endDate": "2026-10-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090040"
  },
  {
    "id": "bc:2026090065",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "할인 찬스 쿠팡•네이버페이 등 10월 마이태그 혜택",
    "summary": "※ 각 행사별 세부 사항 및 일정은 10월 마이태그 혜택보기를 접속하여 확인바랍니다.",
    "benefit": "※ 각 행사별 세부 사항 및 일정은 10월 마이태그 혜택보기를 접속하여 확인바랍니다.",
    "conditions": [
      "BC 및 제휴사의 개인(신용•체크) 카드",
      "페이북 앱 마이태그 화면에서 원하는 혜택을 태그하면 자동으로 고객님 명의의 BC카드에 혜택이 태그되는 맞춤형 마케팅 서비스예요.",
      "실적제한 없이, 신용•체크 제한 없이 카드 혜택에 추가로 더 받는 혜택이에요.",
      "혜택 조건에 맞게 가맹점에서 결제",
      "결제대금이 청구된 명세서에서 혜택 확인!"
    ],
    "exclusions": [
      "※ 단, 법인•선불•기프트카드 제외",
      "※ 모바일ISP 결제 시 혜택 적용 불가"
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090065"
  },
  {
    "id": "bc:2026090037",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "BC바로 에어 마스터 카드 3천 마일리지 적립 최대 4.5만원 캐시백",
    "summary": "이벤트 기간 내 응모를 완료한 회원",
    "benefit": "이벤트 기간 내 응모를 완료한 회원",
    "conditions": [
      "이벤트 기간 내 응모를 완료한 회원",
      "이벤트 시작일로부터 6개월 이내(2026.04.01 ~ 2026.09.30) 모든 BC 바로 개인 신용카드 이용 및 탈회 이력이 없는 회원",
      "마케팅 전체항목 수신 동의 및 카드론 이용 동의를 완료하고 혜택 제공 시까지 유지한 회원",
      "카드 이용기간 종료 후 2개월 이내(2027년 1월말 예정)",
      "이벤트 기간 내 하단 ‘응모하기' 를 통해 이벤트 응모"
    ],
    "exclusions": [
      "혜택 제공 및 제외 대상, 국내 일시불•할부 이용액 제외 가맹점 등 이벤트 유의사항을 꼭 확인해주세요.",
      "직전 6개월(2026.04.01 ~ 2026.09.30) 내 약정 해지 후 재가입한 경우, 기존 약정 해지 후 재가입한 경우 제외",
      "BC 바로카드의 다른 무실적 회원 대상 이벤트 및 연회비 캐시백 혜택과 중복 제공은 불가하며, 타 이벤트와 중복 응모시 최초 응모한 이벤트를 기준으로 혜택이 제공됩니다.",
      "※ 응모 완료시 취소 불가"
    ],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090037"
  },
  {
    "id": "bc:2026090009",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "여수 미식여행 여수지역 일반음식점 마이태그 할인",
    "summary": "※ 법인•기프트•지역화폐 카드 제외",
    "benefit": "※ 법인•기프트•지역화폐 카드 제외",
    "conditions": [
      "BC 개인 신용•체크 카드",
      "마이태그 후 광주은행 BC카드로 2만원 이상 결제 시 3천원 결제일 할인",
      "※ 행사 기간 내 1인 1회",
      "※ [대상가맹점 보기]에 업로드 된 가맹점에서 이용시 혜택 적용",
      "마이태그 후 이용안내의 대상가맹점 목록에 있는 가맹점에서 이용하는 건에 대해 혜택 적용됩니다"
    ],
    "exclusions": [
      "※ 법인•기프트•지역화폐 카드 제외",
      "※ 대상 가맹점 : 여수지역 일반, 휴게 음식점(테이블오더 및 배달앱, 홈페이지등 온라인 가맹점 제외)",
      "최종 카드 결제 금액이 2만원 이상이어야 혜택이 적용됩니다.(쿠폰•포인트•페이북머니 충전 후 결제한 금액 제외)",
      "기간 내 개별 결제 건에 혜택이 적용됩니다. (결제 금액 합산 적용 불가)"
    ],
    "startDate": "2026-09-04",
    "endDate": "2026-11-04",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090009"
  },
  {
    "id": "bc:2026090046",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "라이프패스 이벤트 16,000원 할인쿠폰 특가 이벤트",
    "summary": "라이프패스 이벤트 16,000원 할인쿠폰 특가 이벤트",
    "benefit": "라이프패스 이벤트 16,000원 할인쿠폰 특가 이벤트",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2026-10-01",
    "endDate": "2026-12-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090046"
  },
  {
    "id": "bc:2026040041",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "페이북 머니 결제 혜택 어디서든 0.5% 적립 많이 쓰면 1% 적립",
    "summary": "페이북 머니 결제 혜택 어디서든 0.5% 적립 많이 쓰면 1% 적립",
    "benefit": "페이북 머니 결제 혜택 어디서든 0.5% 적립 많이 쓰면 1% 적립",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2026-04-30",
    "endDate": "2026-12-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026040041"
  },
  {
    "id": "bc:2025110033",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "26년 GOAT카드 해외 온•오프라인 결제 기본3%+추가3% 적립",
    "summary": "전월 실적이 없어도 GOAT 카드로 해외 온•오프라인 구분없이 결제 시, 3% 추가 적립",
    "benefit": "전월 실적이 없어도 GOAT 카드로 해외 온•오프라인 구분없이 결제 시, 3% 추가 적립",
    "conditions": [
      "전월 실적이 없어도 GOAT 카드로 해외 온•오프라인 구분없이 결제 시, 3% 추가 적립",
      "※ 월 최대 한도 3만원 (3개월 단위 최대 9만원), 실적 조건 없음",
      "※ 2025년 4~12월 이벤트와 별도 응모임",
      "GOAT BC 바로카드",
      "전월실적, 적립한도 없이 페이북 머니 적립"
    ],
    "exclusions": [
      "※ 해외 이용액은 해외이용수수료를 제외한 외화 청구 금액 기준",
      "- 응모 이전 이용내역에 대해서는 별도 적용 불가합니다.",
      "이벤트 혜택 제공 제외 대상",
      "이벤트 대상 미충족 또는 유의사항 미확인 등의 사유로 혜택 예외 제공은 불가합니다."
    ],
    "startDate": "2025-12-12",
    "endDate": "2026-12-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2025110033"
  },
  {
    "id": "bc:2026020003",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "BC유니온페이 카드결제 시 일본 가맹점 쿠폰 할인",
    "summary": "BC유니온페이 카드결제 시 일본 가맹점 쿠폰 할인",
    "benefit": "BC유니온페이 카드결제 시 일본 가맹점 쿠폰 할인",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2026-02-13",
    "endDate": "2027-12-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026020003"
  },
  {
    "id": "bc:2026090054",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "10월 한정 이벤트 페이북카드 최대 27만원 혜택",
    "summary": "10월 한정 이벤트 페이북카드 최대 27만원 혜택",
    "benefit": "10월 한정 이벤트 페이북카드 최대 27만원 혜택",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090054"
  },
  {
    "id": "bc:2026090036",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "바로카드 연회비 이벤트 K-패스 카드 연회비100%결제일할인",
    "summary": "바로카드 연회비 이벤트 K-패스 카드 연회비100%결제일할인",
    "benefit": "바로카드 연회비 이벤트 K-패스 카드 연회비100%결제일할인",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090036"
  },
  {
    "id": "bc:2026090002",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "BC바로카드 금융서비스 동의하고 아이스 아메리카노 받기",
    "summary": "BC바로카드 금융서비스 동의하고 아이스 아메리카노 받기",
    "benefit": "BC바로카드 금융서비스 동의하고 아이스 아메리카노 받기",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2026-09-18",
    "endDate": "2026-10-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090002"
  },
  {
    "id": "bc:2026080025",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "밀리의서재 1+1 혜택에 첫달 20% 할인까지",
    "summary": "밀리의서재 1+1 혜택에 첫달 20% 할인까지",
    "benefit": "밀리의서재 1+1 혜택에 첫달 20% 할인까지",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2026-09-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026080025"
  },
  {
    "id": "bc:2026050007",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "해외 여행 꿀팁 최대 10만원 혜택 이거 하나로 해결",
    "summary": "해외 여행 꿀팁 최대 10만원 혜택 이거 하나로 해결",
    "benefit": "해외 여행 꿀팁 최대 10만원 혜택 이거 하나로 해결",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2026-05-18",
    "endDate": "2026-10-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026050007"
  },
  {
    "id": "bc:2025030014",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "KT SUPER DC 카드 KT 통신요금 월 최대 2.2만원할인",
    "summary": "KT SUPER DC 카드 KT 통신요금 월 최대 2.2만원할인",
    "benefit": "KT SUPER DC 카드 KT 통신요금 월 최대 2.2만원할인",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2025-04-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2025030014"
  },
  {
    "id": "bc:2024050010",
    "issuer": "bc",
    "listUrl": "https://web.paybooc.co.kr/web/evnt/main",
    "title": "KT 마이알뜰폰 카드 KT 알뜰폰 통신요금 24개월동안 추가 할인",
    "summary": "KT 마이알뜰폰 카드 KT 알뜰폰 통신요금 24개월동안 추가 할인",
    "benefit": "KT 마이알뜰폰 카드 KT 알뜰폰 통신요금 24개월동안 추가 할인",
    "conditions": [
      "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
    ],
    "exclusions": [],
    "startDate": "2024-10-01",
    "endDate": "2026-10-31",
    "applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2024050010"
  },
  {
    "id": "ibk:103578",
    "issuer": "ibk",
    "listUrl": "https://www.ibk.co.kr/event/ingListEvent.ibk?pageId=CM01060100&evnt_dscd=H",
    "title": "IBK유니온페이카드 「’일’단 사고 ‘본’다! 마케팅」 안내",
    "summary": "고객센터 1588-2588 , 해외 +82-31-888-8000",
    "benefit": "고객센터 1588-2588 , 해외 +82-31-888-8000",
    "conditions": [
      "IBK 카드 행사 화면에서 신청 또는 쿠폰을 받아야 혜택이 적용됩니다."
    ],
    "exclusions": [],
    "startDate": "2026-02-20",
    "endDate": "2026-12-31",
    "applyUrl": "https://www.ibk.co.kr/event/ingDetailEvent.ibk?evnt_srno=103578&evnt_dscd=H&pageId=CM01060100"
  },
  {
    "id": "ibk:103628",
    "issuer": "ibk",
    "listUrl": "https://www.ibk.co.kr/event/ingListEvent.ibk?pageId=CM01060100&evnt_dscd=H",
    "title": "IBK유니온페이카드 해외가맹점 10% 즉시할인",
    "summary": "고객센터 1588-2588 , 해외 +82-31-888-8000",
    "benefit": "고객센터 1588-2588 , 해외 +82-31-888-8000",
    "conditions": [
      "IBK유니온페이카드 해외 오프라인 최대 10%즉시할인!UPI카드 10개국 오프라인점 최대 10%할인!이벤트 기간 2026.7.20.(월)~2027.1.31.(월)※예산소진 시 조기종료 대상 IBK 유니온페이 브랜드 개인 신용",
      "추천카드 일상의 기쁨카드 연회비 해외(UPI)10,000원 해외(VISA)12,000원 일년의 설렘카드 연회비 해외(UPI)10,000원 해외(VISA)12,000원",
      "사전 신청하기를 통한 사전 등록 고객에 한해 할인 혜택 제공됩니다.(IBK에서 발급받으신 카드 등록 후 등록 완료 화면에서"
    ],
    "exclusions": [
      "예산 소진 시 조기 종료 가능 합니다."
    ],
    "startDate": "2026-08-10",
    "endDate": "2027-01-31",
    "applyUrl": "https://www.ibk.co.kr/event/ingDetailEvent.ibk?evnt_srno=103628&evnt_dscd=H&pageId=CM01060100"
  }
];

export const EXTRA_REPORT: { id: IssuerId; ok: boolean; message: string; count: number }[] = [
  {
    "id": "samsung",
    "ok": true,
    "message": "진행 목록에서 마감이 가까운 18건을 읽고 응모 6건만 남겼습니다.",
    "count": 6
  },
  {
    "id": "lotte",
    "ok": true,
    "message": "진행 27건 중 14건을 확인했고 응모 3건입니다.",
    "count": 3
  },
  {
    "id": "hana",
    "ok": true,
    "message": "진행 17건 중 12건을 확인했고 응모 2건입니다.",
    "count": 2
  },
  {
    "id": "nh",
    "ok": true,
    "message": "응모 탭에서 진행 12건을 가져왔습니다. 조건 일부가 이미지라 카드사 화면을 함께 보세요.",
    "count": 12
  },
  {
    "id": "bc",
    "ok": true,
    "message": "페이북 진행 목록에서 응모·마이태그 16건을 남겼습니다. BC 홈은 여기로 연결됩니다.",
    "count": 16
  },
  {
    "id": "ibk",
    "ok": true,
    "message": "카드 행사 8건 중 신청·응모 2건입니다. 예금·청약 행사는 뺐습니다.",
    "count": 2
  }
];
