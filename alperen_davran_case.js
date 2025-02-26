(() => {
    const PRODUCTS_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const LOCAL_STORAGE_KEY = "recommended_products";
    const CACHE_TIME_KEY = `${LOCAL_STORAGE_KEY}_cache_time`;
    const CACHE_DURATION = 24 * 60 * 60 * 1000; 
  
    const carouselIndices = {};
  
    let products = [];
  
    async function init() {
      products = loadProducts();
      if (!products) {
        products = await fetchProducts();
        if (products.length > 0) {
          saveProducts(products);
        }
      }
    if (products.length) {
        buildHTML();
        buildCSS();
        setEvents();
      }
    }
  
    async function fetchProducts() {
        const res = await fetch(PRODUCTS_URL);
        return await res.json();
    }
  
    const saveProducts = (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    };
  
    // time checking
    const loadProducts = () => {
      const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
      if (!cacheTime || Date.now() - parseInt(cacheTime) > CACHE_DURATION) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(CACHE_TIME_KEY);
        return null;
      }
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    };
  
    const buildHTML = () => {
      const carouselId = `carousel-${Math.random().toString(36).substr(2, 9)}`;
      carouselIndices[carouselId] = 0;
  
      const container = `
        <div class="carousel-container">
          <h2>You Might Also Like</h2>
          <div class="carousel-wrapper">
            <button class="carousel-arrow left" data-carousel="${carouselId}" disabled>❮</button>
            <div class="carousel" id="${carouselId}">
              ${products.map((product, index) => `
                <div class="carousel-item" data-index="${index}">
                  <div class="new-product-card">
                    <div class="new-product-card__image-wrapper">
                      <a href="${product.url}" target="_self">
                        <img class="product-image" src="${product.img}" />
                      </a>
                      <div class="new-product-card-like-button favorite ${isFavorite(product.id) ? "favorited" : ""}" data-id="${product.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483">
                          <path fill="none" stroke="#555" stroke-width="1.5px"
                            d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z"
                            transform="translate(.756 -1.076)"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="new-product-card__information-box">
                      <div class="new-product-card__information-box__title">
                        <a href="${product.url}" target="_self">
                          <p class="product-name">${product.name}</p>
                        </a>
                      </div>
                      <div class="new-product-card__price">
                        <div class="price__current-price">${product.price.toFixed(2)} TL</div>
                      </div>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
            <button class="carousel-arrow right" data-carousel="${carouselId}">❯</button>
          </div>
        </div>
      `;
      $(".product-detail").append(container);
    };
  
    // CSS oluşturma
    const buildCSS = () => {
      const css = `
        .carousel-container {
          max-width: 100%;
          padding: 20px;
          overflow: hidden;
        }
  
        .carousel-container h2 {
          font-size: 24px;
          color: #29323b;
          line-height: 33px;
          font-weight: lighter;
          padding: 15px 0;
          margin: 0;
        }
  
        .carousel-wrapper {
          display: flex;
          align-items: center;
          position: relative;
          margin: 0 40px;
        }
        .carousel {
          display: flex;
          transition: transform 0.5s ease-in-out;
          margin-right: -8px;
        }
        .carousel-item {
          flex: 0 0 auto;
          width: 10%;
          margin-right: 8px;
          box-sizing: border-box;
          text-align: center;
        }
        .new-product-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 10px;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
        }
        .new-product-card__image-wrapper {
          position: relative;
        }
        .product-image {
          width: 100px;
          height: auto;
          max-width: 100%;
        }
        .new-product-card-like-button {
          position: absolute;
          top: 8px;
          right: 8px;
          cursor: pointer;
        }
        .favorited svg path {
          fill: blue !important;
          stroke: blue !important;
        }
        .new-product-card__information-box {
          margin-top: 10px;
        }
        .new-product-card__information-box__title {
          margin-bottom: 8px;
        }
        .product-name {
          font-size: 14px;
          color: #333;
          white-space: normal;
          word-break: break-word;
        }
        .new-product-card__price {
          color: #000;
          font-weight: bold;
        }
        .price__current-price {
          font-size: 16px;
        }
        .carousel-arrow {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 9999;
          pointer-events: auto;
        }
        .left {
          left: 0;
        }
        .right {
          right: 0;
        }
        .favorite {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }
      `;
      $("<style>").html(css).appendTo("head");
    };
  
    const setEvents = () => {
      // Arrow click
      $(".carousel-arrow").on("click", function(e) {
        e.stopPropagation();
        const carouselId = $(this).data("carousel");
        const direction = $(this).hasClass("left") ? -1 : 1;
        slideCarousel(carouselId, direction);
      });
  
      // Favorite click
      $(".favorite").on("click", function(e) {
        e.stopPropagation();
        const productId = $(this).data("id");
        toggleFavorite(productId);
        $(this).toggleClass("favorited");
      });
    };
  
    const slideCarousel = (carouselId, direction) => {
      let currentIndex = carouselIndices[carouselId] || 0;
  
      const $carousel = $(`#${carouselId}`);
      const $items = $carousel.find(".carousel-item");
      const itemCount = $items.length;
  
      const itemWidth = $items.outerWidth(true);
      const wrapperWidth = $carousel.parent().width();
      const visibleItems = Math.floor(wrapperWidth / itemWidth); // Calculate,basically area per item, how many items can fit in the visible area
      const maxIndex = Math.max(0, itemCount - visibleItems);
  
      let newIndex = currentIndex + direction;
      newIndex = Math.max(0, Math.min(newIndex, maxIndex));
      carouselIndices[carouselId] = newIndex;
  
      const offset = newIndex * itemWidth;
      $carousel.css("transform", `translateX(-${offset}px)`);
  
      const $leftArrow = $(`.carousel-arrow.left[data-carousel="${carouselId}"]`);
      const $rightArrow = $(`.carousel-arrow.right[data-carousel="${carouselId}"]`);
      $leftArrow.prop('disabled', newIndex === 0); //at start of carousel, left arrow should be disabled
      $rightArrow.prop('disabled', newIndex === maxIndex); //at end of carousel, right arrow should be disabled
    };
  
    const isFavorite = (id) => {
      const favorites = new Set(JSON.parse(localStorage.getItem("favorites") || "[]"));
      return favorites.has(id);
    };
  
    const toggleFavorite = (id) => {
      let favorites = new Set(JSON.parse(localStorage.getItem("favorites") || "[]"));
      favorites.has(id) ? favorites.delete(id) : favorites.add(id);
      localStorage.setItem("favorites", JSON.stringify([...favorites]));
    };
  
    init();
  })();
  