import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
import { swalFn } from '../js/sweetalert2';

const baseUrl = "https://vue3-course-api.hexschool.io/v2";
const api_path = "charlotte-lee";

const favoritesListContainer = document.getElementById("favoritesList");

function fetchProductDetails(id) {
  // 使用 Axios 從 API 取得單一產品
  return axios
    .get(`${baseUrl}/api/${api_path}/product/${id}`)
    .then((response) => response.data.product)
    .catch((error) => {
      console.error(error);
    });
}

async function displayFavorites() {
  // 從 localStorage 中取得 favoriteList
  const storedFavoriteList =
    JSON.parse(localStorage.getItem("homeFavorite")) || [];

  // 過濾掉無效的產品 ID（null 或 undefined）
  const validProductIds = storedFavoriteList.filter(
    (productId) => productId !== null && productId !== undefined
  );

  // 顯示 favoriteList 中的完整產品內容
  if (validProductIds.length > 0) {
    // 使用 Promise.all 取得所有產品內容
    const products = await Promise.all(
      validProductIds.map((productId) => fetchProductDetails(productId))
    );

    if (products.length > 0) {
      const favoritesHtml = products
        .map((product) => {
          const isFavorite = storedFavoriteList.includes(product.id);
          const heartIconClass = isFavorite ? "bi-heart-fill" : "bi-heart";
          return `
          <div class="col-6 col-lg-3">
            <div class="section-item">
              <div class="overflow-hidden">
                <a href="javascript:;"><img class="prodImg img-fluid w-100 object-fit-cover" src="${product.imageUrl}" alt="${product.title}"></a>
              </div>
              <div class="p-1 text-right">
                <h4 class="fw-bold">${product.title}</h4>     
                <h6>${product.category}</h6>
                <h6 class="pt-3 mb-0">NT$${product.origin_price} 
                  <del class="text-dark">NT$${product.price}</del>                   
                </h6>  
                <div class="pt-1 text-primary">
                  <a id="addFavorite" >
                    <span id="heartIcon-${product.id}" class="bi ${heartIconClass} fs-5 pe-2 align-text-bottom" data-favorite-id=${product.id}></span>
                  </a>
                  <a href="#"><span class="material-icons favorite">shopping_cart</span></a>
                </div>   
              </div>
            </div>
            </div>
          `;
        })
        .join("");

      favoritesListContainer.innerHTML = favoritesHtml;
    } else {
      favoritesListContainer.innerHTML = "<p>無法取得產品內容。</p>";
    }
  } else {
    favoritesListContainer.innerHTML = "<strong>您的最愛列表為空...</strong>";
  }
}

// 切换收藏狀態
function toggleFavorite(itemId, callback) {
  let storedFavoriteList =
    JSON.parse(localStorage.getItem("homeFavorite")) || [];

  if (storedFavoriteList.includes(itemId)) {
    // 移除收藏
    storedFavoriteList = storedFavoriteList.filter((id) => id !== itemId);
    swalFn("已移除收藏", "warning", 800);
  } else {
    // 添加到收藏
    storedFavoriteList.push(itemId);
    swalFn("已加入收藏", "success", 800);
  }

  // 更新 storedFavoriteList
  localStorage.setItem("homeFavorite", JSON.stringify(storedFavoriteList));

  // 調用回調函數
  callback();
}

// 在頁面加載時顯示收藏列表
window.onload = function () {
  displayFavorites();
  // 綁定點擊事件
  document.addEventListener("click", function (event) {
    // 點擊事件觸發時，檢查點擊的元素是否為收藏圖標
    const target = event.target;
    if (target && target.matches(".bi")) {
      const itemId = target.dataset.favoriteId;
      // 調用 toggleFavorite，傳遞 displayFavorites 作為回調函數
      toggleFavorite(itemId, displayFavorites);
    }
  });
};
