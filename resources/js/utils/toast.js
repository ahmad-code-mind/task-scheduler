import Toastify from "toastify-js";

export const dangerToast = (message) => {
  Toastify({
    text: message,
    className: "info",
    close: true,
    style: {
      background: "linear-gradient(to right, #b00000, #f94200)",
    },
  }).showToast();
};

export const successToast = (message) => {
  Toastify({
    text: message,
    className: "info",
    close: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
};
