// Import our custom CSS
import "../scss/all.scss";

import { Popover } from "bootstrap";
// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]').forEach((popover) => {
  new Popover(popover);
});


