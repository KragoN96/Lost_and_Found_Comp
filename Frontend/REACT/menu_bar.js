console.log('Hello')

const menu = document.querySelector('.menu');
const panel = document.getElementById('menu-trans');

menu.addEventListener('mouseenter', openNav);
menu.addEventListener('mouseleave', closeNav);

function openNav() {
  // make sure it’s measurable
  panel.classList.add('is-open');
  panel.style.height = panel.scrollHeight + 'px';
}

function closeNav() {
  panel.style.height = '0px';
  panel.addEventListener('transitionend', onEnd, { once: true });
  panel.classList.remove('is-open');
}

function onEnd() {
  // optional: cleanup inline height so future content changes work
  if (!panel.classList.contains('is-open')) panel.style.height = '0px';
}