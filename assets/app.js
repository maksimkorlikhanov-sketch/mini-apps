/* ============================================================
   Общие хелперы мини-аппов.
   Подключается:  <script src="../assets/app.js"></script>
   Глобально доступны: App.tg, App.haptic(), App.toast(), $(), $$()
   ============================================================ */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const App = (() => {
  const tg = window.Telegram?.WebApp || null;

  // инициализация Telegram WebApp: тема, разворот, готовность
  function init(){
    if(!tg) return;
    try{
      tg.ready();
      tg.expand();
      // подгоняем цвет шапки/фона под тему
      if(tg.setHeaderColor) tg.setHeaderColor('secondary_bg_color');
    }catch(e){}
  }

  // вибро-отклик (мягко деградирует, если не поддерживается)
  function haptic(kind = 'light'){
    const h = tg?.HapticFeedback; if(!h) return;
    try{
      if(kind === 'success' || kind === 'error' || kind === 'warning') h.notificationOccurred(kind);
      else if(kind === 'select') h.selectionChanged();
      else h.impactOccurred(kind); // light | medium | heavy | rigid | soft
    }catch(e){}
  }

  // короткое всплывающее уведомление снизу
  let toastEl;
  function toast(msg, ms = 1800){
    if(!toastEl){
      toastEl = document.createElement('div');
      Object.assign(toastEl.style, {
        position:'fixed', left:'50%', bottom:'calc(20px + env(safe-area-inset-bottom))',
        transform:'translateX(-50%) translateY(20px)', maxWidth:'90%',
        background:'var(--card)', color:'var(--text)', padding:'12px 18px',
        borderRadius:'14px', fontSize:'14px', boxShadow:'var(--shadow)',
        opacity:'0', transition:'opacity .2s ease, transform .2s ease', zIndex:'100',
        pointerEvents:'none', textAlign:'center'
      });
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(() => {
      toastEl.style.opacity = '1';
      toastEl.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateX(-50%) translateY(20px)';
    }, ms);
  }

  // управление модалкой результата (нужен .overlay#id с .modal внутри)
  function openModal(id){ $('#'+id)?.classList.add('show'); }
  function closeModal(id){ $('#'+id)?.classList.remove('show'); }

  return { tg, init, haptic, toast, openModal, closeModal };
})();

// автозапуск инициализации
App.init();
