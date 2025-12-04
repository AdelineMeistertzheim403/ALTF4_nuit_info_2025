class Dialogs {
     showDialog(title, message, time = 3000) {
        if (document.getElementById('dialog-box')) return;

        const dialog = document.createElement('div');
        dialog.id = 'dialog-box';
        dialog.classList.add('dialog-box');
        dialog.innerHTML = `<h1>${title}</h1><p>${message}</p>`;
        document.body.appendChild(dialog);

        setTimeout(() => {
            document.body.removeChild(dialog);
        }, time)
    }
}

export default Dialogs;