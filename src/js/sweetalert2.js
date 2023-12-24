import 'sweetalert2/dist/sweetalert2.min.js';
import Swal from "sweetalert2";

// sweetAlert
// 提示訊息
// success 成功, error 錯誤, warning 驚嘆號 , info 說明
export function swalFn(title, icon, time) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      title: title,
      icon: icon,
      timer: time,
      showConfirmButton: false,
    })
  };