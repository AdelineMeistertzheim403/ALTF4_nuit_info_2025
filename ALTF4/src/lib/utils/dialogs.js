class Dialogs {
    constructor() {
        this.currentDialog = null;
    }

    showDialog(title, message, charDelay = 28) {
        return new Promise(async (resolve) => {
            if (this.currentDialog) {
                await this.currentDialog;
            }

            if (document.getElementById('dialog-box')) {
                const existing = document.getElementById('dialog-box');
                if (existing) existing.remove();
            }

            message = String(message || '');
            const dialog = document.createElement('div');
            dialog.id = 'dialog-box';
            dialog.className = 'dialog-box';

            if (title) {
                const h = document.createElement('h1');
                h.className = 'dialog-title';
                h.textContent = title;
                dialog.appendChild(h);
            }

            const p = document.createElement('p');
            p.className = 'dialog-message';

            const caret = document.createElement('span');
            caret.className = 'dialog-caret';

            const messageWrap = document.createElement('div');
            messageWrap.style.display = 'inline-block';
            messageWrap.appendChild(p);
            messageWrap.appendChild(caret);

            dialog.appendChild(messageWrap);
            document.body.appendChild(dialog);

            void dialog.offsetWidth;
            dialog.classList.add('enter');

            let idx = 0;
            let typing = true;
            let timer = null;
            let currentElement = p;
            let currentTextNode = document.createTextNode('');
            currentElement.appendChild(currentTextNode);

            const clearTimers = () => {
                if (timer) { clearTimeout(timer); timer = null; }
            };

            const removeDialog = () => {
                if (!dialog || !document.body.contains(dialog)) {
                    return;
                }
                dialog.classList.remove('enter');
                dialog.classList.add('exit');
                clearTimers();

                this.currentDialog = new Promise((resolveRemoval) => {
                    setTimeout(() => {
                        if (document.body.contains(dialog)) document.body.removeChild(dialog);
                        resolveRemoval();
                        resolve();
                    }, 260);
                });
            };

            const finishTyping = () => {
                if (!typing) return;
                typing = false;
                clearTimers();
                p.innerHTML = message
                    .replace(/\*\*(.*?)\*\*/g, '<span class="accent">$1</span>')
                    .replace(/\*(.*?)\*/g, '<i>$1</i>');
            };

            const punctuationPause = (ch) => {
                if (ch === '.' || ch === '!' || ch === '?') return 260;
                if (ch === ',') return 140;
                if (ch === '\n') return 220;
                return 0;
            };

            const typeNext = () => {
                if (idx >= message.length) {
                    finishTyping();
                    return;
                }
                let ch = message.charAt(idx++);

                if (ch === '*') {
                    if (currentElement.tagName === 'I') {
                        currentElement = p;
                    } else {
                        const italicElement = document.createElement('i');
                        p.appendChild(italicElement);
                        currentElement = italicElement;
                    }
                    currentTextNode = document.createTextNode('');
                    currentElement.appendChild(currentTextNode);
                    typeNext();
                    return;
                }

                currentTextNode.nodeValue += ch;

                const extra = punctuationPause(ch);
                const nextDelay = charDelay + extra;
                timer = setTimeout(typeNext, nextDelay);
            };

            timer = setTimeout(typeNext, charDelay);

            const onClick = () => {
                if (typing) finishTyping();
                else removeDialog();
            };
            dialog.addEventListener('click', onClick);
        });
    }

    changeBackground(image) {
        console.log('[changeBackground] Starting transition to:', image);
        return new Promise((resolve) => {
            const blackOverlay = document.createElement('div');
            blackOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: 0;
            transition: opacity 0.6s ease-in-out;
            z-index: 9998;
            pointer-events: none;
        `;
            document.body.appendChild(blackOverlay);

            void blackOverlay.offsetWidth;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    blackOverlay.style.opacity = '1';
                });
            });

            setTimeout(() => {
                console.log('[changeBackground] Changing background at black peak');
                document.body.style.backgroundImage = `url(${image})`;

                blackOverlay.style.opacity = '0';

                setTimeout(() => {
                    document.body.removeChild(blackOverlay);
                    console.log('[changeBackground] Transition complete, resolving');
                    resolve();
                }, 600);
            }, 600);
        });
    }

}

export default Dialogs;