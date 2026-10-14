export const tutorials = {
  "A.K.I.": "https://youtu.be/Yva_TJaMfrk?si=bV9WCuChjEPhJPPJ",
  "Akuma": "https://youtu.be/SIPTOVx6pls?si=X93PZ7NzLnn5b5DY",
  "Alex": "https://youtu.be/e-xXJ-uzIHI?si=CHWsMKwiBhulAoTi",
  "Arjun": "https://youtu.be/6l9RFvk3fec?si=2uaPFvj7X4u9ZXo3",
  "Blanka": "https://youtu.be/iK1QFKraQqA?si=YksYx1cD0ESHmTyo",
  "C. Viper": "https://youtu.be/NKH8jAkt_8Y?si=6z5RIo37bdeAmGCP",
  "Cammy": "https://youtu.be/u-CHmzZ9z-8?si=Ydj_NlarQmY-T6d-",
  "Chun-Li": "https://youtu.be/seX6oUfwjII",
  "Dee Jay": "https://youtu.be/GUDRAkoriD4?si=wivg9h0r_BiAIPL2",
  "Dhalsim": "https://youtu.be/eiK61LHLLm8?si=lDtWwMQTuL0JVjXy",
  "E. Honda": "https://youtu.be/knPaBQmrfjo?si=gguQvl-slZIMeiDM",
  "Ed": "https://youtu.be/TqumE_S5jUs?si=_iSZkCmLerjhuyvk",
  "Elena": "https://youtu.be/nlnv52mGbL0?si=SiR0CbS9kvNs-6Fo",
  "Guile": "https://youtu.be/xjJaXn45S0E",
  "Jamie": "https://youtu.be/qg1KoyDiqHI?si=vH8iYo-YqUAxy4vJ",
  "JP": "https://youtu.be/ClWYUU7WhTA?si=K8PD3HQu0MrXURVE",
  "Juri": "https://youtu.be/E3i6ZOWJ2Ng",
  "Ken": "https://youtu.be/1SX2m7sqbtA",
  "Kimberly": "https://youtu.be/OEWHuUzI1Os?si=aCHUd22foNYg-PmU",
  "Lily": "https://youtu.be/6ZWZs0ZK938?si=FlAwmAOLGrhXj1Um",
  "Luke": "https://youtu.be/ETI0VifPfaw?si=35MHa--REMG1MK9O",
  "M. Bison": "https://youtu.be/oT1SLN39OiI?si=bdcVM3se8zAPtPNI",
  "Mai": "https://youtu.be/g31J9y8usSs?si=FlWiLr33aXe-povD",
  "Manon": "https://youtu.be/On9nmbUvCTw?si=dxFdso0GViLrkx9s",
  "Marisa": "https://youtu.be/kZiy7hkBPIY?si=5uY9ae63o7DOizfx",
  "Rashid": "https://youtu.be/c2U3nex-8C4?si=LZ-ANKgLqdDPMMRG",
  "Ryu": "https://youtu.be/iAs1p3LVdAs",
  "Sagat": "https://youtu.be/k6M3iDp8hq4?si=xN7eJIv7drCeVduX",
  "Terry": "https://youtu.be/qQnF07Owwd8?si=xqrh3xLfEPYHboMm",
  "Yasmine": "https://youtu.be/M7NfqAcU7KI?si=QyzECokeW4gop5ki",
  "Zangief": "https://youtu.be/zj213DBy0TY"
};
export const tutorialLink = (name) => tutorials[name] || `https://www.youtube.com/results?search_query=${encodeURIComponent(`Street Fighter 6 ${name} character guide tutorial`)}`;
export const hasCuratedTutorial = (name) => Boolean(tutorials[name]);

export const resources = [
  {name:"SuperCombo Wiki", type:"Community frame data & character tech", url:"https://wiki.supercombo.gg/"},
  {name:"Street Fighter 6 Official", type:"Official game information", url:"https://www.streetfighter.com/6/"},
  {name:"SuperCombo Training", type:"Community learning and discussion", url:"https://www.reddit.com/r/StreetFighter/"},
  {name:"Fighting Game Glossary", type:"Learn competitive fighting game terminology", url:"https://glossary.infil.net/"}
];
