// javascript
class Dialogs {
  showDialog(title, message, charDelay = 28) {
    if (document.getElementById('dialog-box')) return { dismiss: () => {} };

    message = String(message || '');
    // build elements
    const dialog = document.createElement('div');
    dialog.id = 'dialog-box';
    dialog.className = 'dialog-box';

    const h = document.createElement('h1');
    h.className = 'dialog-title';
    h.textContent = title || '';

    const p = document.createElement('p');
    p.className = 'dialog-message';
    p.textContent = '';

    const caret = document.createElement('span');
    caret.className = 'dialog-caret';

    // place message and caret together so caret sits after text
    const messageWrap = document.createElement('div');
    messageWrap.style.display = 'inline-block';
    messageWrap.appendChild(p);
    messageWrap.appendChild(caret);

    dialog.appendChild(h);
    dialog.appendChild(messageWrap);
    document.body.appendChild(dialog);

    // optional entrance trigger (if your CSS uses .enter)
    // force reflow then add class
    void dialog.offsetWidth;
    dialog.classList.add('enter');

    let idx = 0;
    let typing = true;
    let timer = null;
    let removeTimer = null;

    const clearTimers = () => {
      if (timer) { clearTimeout(timer); timer = null; }
      if (removeTimer) { clearTimeout(removeTimer); removeTimer = null; }
    };

    const punctuationPause = (ch) => {
      if (ch === '.' || ch === '!' || ch === '?') return 260;
      if (ch === ',') return 140;
      if (ch === '\n') return 220;
      return 0;
    };

    const finishTyping = () => {
      if (!typing) return;
      typing = false;
      clearTimers();
      p.textContent = message;
    };

    const removeDialog = () => {
      if (!dialog || !document.body.contains(dialog)) return;
      dialog.classList.remove('enter');
      dialog.classList.add('exit');
      clearTimers();
      setTimeout(() => {
        if (document.body.contains(dialog)) document.body.removeChild(dialog);
        if (observer) observer.disconnect();
      }, 260);
    };

    // recursive typed loop to allow variable delays per char
    const typeNext = () => {
      if (idx >= message.length) {
        finishTyping();
        return;
      }
      const ch = message.charAt(idx++);
      p.textContent += ch;
      const extra = punctuationPause(ch);
      const nextDelay = charDelay + extra;
      timer = setTimeout(typeNext, nextDelay);
    };

    // start typing
    timer = setTimeout(typeNext, charDelay);

    // click to skip typing or to dismiss
    const onClick = () => {
      if (typing) finishTyping();
      else removeDialog();
    };
    dialog.addEventListener('click', onClick);

    // observe DOM removal to cleanup timers if removed externally
    const observer = new MutationObserver(() => {
      if (!document.getElementById('dialog-box')) {
        clearTimers();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });

    return {
      dismiss: () => {
        if (document.getElementById('dialog-box')) removeDialog();
      }
    };
  }
}

export default Dialogs;