// modules
import mobileHeight from './modules/mobile-height-adjust.js';
import slider from './modules/slider.js';
import menu from './modules/menu.js';
import footer from './modules/footer.js';
import chat from './modules/chat.js';
import result from './modules/result.js';
import form from './modules/form.js';
import social from './modules/social.js';
import FullPageScroll from './modules/full-page-scroll';
import pageLoadingSteps from './modules/page-loading-steps';
import screens from "./modules/screens";
// import textSvgAnimate from "./modules/textSvgAnimate";

// init modules
pageLoadingSteps();
mobileHeight();
slider();
menu();
footer();
chat();
result();
form();
social();
screens();
// textSvgAnimate();

const fullPageScroll = new FullPageScroll();
fullPageScroll.init();
