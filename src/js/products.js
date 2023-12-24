import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
import { swalFn } from '../js/sweetalert2';

const baseUrl = "https://vue3-course-api.hexschool.io/v2";
const api_path = "charlotte-lee";

let favoriteList = [];

const productWrap = document.querySelector(".productWrap");
const productsArr = [];


const categoryLinks = document.querySelectorAll(".category a");

function init() {    
  console.log('Init function called');
  // 從 localStorage 中檢索 favoriteList
  const storedFavoriteList = JSON.parse(localStorage.getItem('homeFavorite'));
  if (storedFavoriteList) {
    favoriteList = storedFavoriteList;
  }
  getProductList();     
}
init();


// 切換收藏狀態
function toggleFavorite(itemId) {
  const heartIcon = document.getElementById(`heartIcon-${itemId}`);

  if (favoriteList.includes(itemId)) {
    // 移除收藏
    heartIcon.classList.remove("bi-heart-fill");
    heartIcon.classList.add("bi-heart");
    favoriteList = favoriteList.filter((id) => id !== itemId);
    swalFn("已移除收藏", "warning", 800);
  } else {
    // 添加到收藏
    heartIcon.classList.remove("bi-heart");
    heartIcon.classList.add("bi-heart-fill");
    favoriteList.push(itemId);
    swalFn("已加入收藏", "success", 800);
  }

  console.log('After toggle - favoriteList:', favoriteList);
  console.log('Stored favoriteList:', localStorage.getItem('homeFavorite'));
  console.log('Stored favoriteList on page load:', JSON.parse(localStorage.getItem('homeFavorite')));

  // 將收藏列表存儲在 localStorage 中 
  localStorage.setItem('homeFavorite', JSON.stringify(favoriteList));
}


// 取得商品列表
function getProductList() {
  axios
    .get(`${baseUrl}/api/${api_path}/products/all`)
    .then(function (res) {
      const data = res.data.products;
      data.forEach((item) => {
        productsArr.push(item);
      });
      // console.log('商品列表載入完成:', productsArr);
      renderProductList(productsArr);
    })
    .catch(function (err) {
      console.log(err);
    });
}

// 渲染商品列表
function renderProductList(data) {
  let productListHtml = ``;
  data.forEach((item) => {  
    // console.log(item.id)
    const isFavorite = favoriteList.includes(item.id);
    const heartIconClass = isFavorite ? 'bi-heart-fill' : 'bi-heart';
    let productList = `
    <div class="col-6 col-lg-3">
          <div class="section-item">
            <div class="overflow-hidden">
                <a href="javascript:;"><img class="prodImg img-fluid w-100 object-fit-cover" src="${item.imageUrl}"></a>
            </div>
            <div class="p-1 text-right">
              <h4 class="fw-bold">${item.title}</h4>     
              <h6>${item.category}</h6>
                <h6 class="pt-3 mb-0">NT$${item.origin_price} 
                <del class="text-dark">NT$${item.price}</del>                   
                </h6>  
                <div class="pt-1 text-primary">
                  <a href="javascript:;" id="addFavorite" >
                  <span id="heartIcon-${item.id}" class="bi ${heartIconClass} fs-5 pe-2 align-text-bottom" data-favorite-id=${item.id}></span></a>
                    <a href="#"><span class="material-icons favorite">
                      shopping_cart
                    </span></a>
                </div>   
          </div>
          </div>            
        </div>`;
    productListHtml += productList;
  });
  productWrap.innerHTML = productListHtml;

  // 為每個心形圖標添加點擊事件
  const heartIcons = document.querySelectorAll(".bi");
  heartIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const itemId = icon.dataset.favoriteId;
      toggleFavorite(itemId);      
    });
  });

  // 類別
  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      // 從 data-category 屬性中取得選定的類別
      const selectedCategory = link.dataset.category;

      // 根據選定的類別篩選商品
      const filteredProducts =
        selectedCategory === "全部"
          ? productsArr
          : productsArr.filter(
              (product) => product.category === selectedCategory
            );

      // 渲染更新後的商品列表
      renderProductList(filteredProducts);
    });
  });
}

















