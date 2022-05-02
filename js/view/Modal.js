export default class Modal {
    static modal = document.getElementById("game-modal");
    static h2 = document.getElementById("game-modal-title");
    static texts = document.getElementById("game-modal-texts");
    static img = document.getElementById("game-modal-image");
    static button1 = document.getElementById("game-modal-button1");
    static button2 = document.getElementById("game-modal-button2");

    static create(title, image, text, btn1, btn2) {
        Modal._setTitle(title);
        Modal._setText(text);
        Modal._setImage(image);
        Modal._setButton(Modal.button1, btn1);
        Modal._setButton(Modal.button2, btn2);
        Modal._openModal();
    }

    static _openModal = () => {
        Modal.modal.style.display = "flex";
        Modal.button1.focus();
    };

    static _setTitle = (title) => {
        Modal.h2.innerText = title;
    };
    static _setText = (text) => {
        if (!text) {
            Modal.texts.classList.add("hidden");
            return;
        }
        Modal.texts.classList.remove("hidden");
        Modal.texts.innerHTML = text;
    };

    static _setImage = (image) => {
        if (!image) {
            Modal.img.classList.add("hidden");
            return;
        }
        Modal.img.classList.remove("hidden");
        Modal.img.src = image.src;
    };

    static _setButton = (button, data) => {
        if (!data) {
            button.classList.add("hidden");
            return;
        }

        button.classList.remove("hidden");
        button.innerText = data.text;
        button.onclick = () => {
            Modal.modal.style.display = "";
            data.cb();
        };
    };
}