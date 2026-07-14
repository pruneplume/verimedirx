
const supabaseUrl = 'https://zqhjkuugezjcpnfxppfw.supabase.co';
const supabaseKey = 'sb_publishable_UDQfHrnG5GTfoMgsfHSzpg_y00vskdY';
const supabasecmd = supabase.createClient(supabaseUrl, supabaseKey);

async function gettable() {
  // PHP의 "SELECT * FROM users"와 같은 역할입니다.
  let { data: data, error } = await supabasecmd
    .from('test1')
    .select('*')

  if (error) {
    console.error('에러 발생:', error)
  } else {
    console.log('DB 데이터:', data) // 화면에 그릴 데이터
  }
}

gettable();

let cart_temp = {
  cart: JSON.parse(localStorage.getItem("cart"))
}

const browserLang = document.documentElement.lang || navigator.userLanguage;
const lang = browserLang.slice(0, 2);

function change_lang(lang){
  document.documentElement.lang = lang;
}

let prices = new Intl.NumberFormat('en-US', {
style: 'currency',
currency: 'USD',
});

if (lang == 'en'){
  prices = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  });
  } else if( lang == 'ko'){
      prices = new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
  });
}

let userdata = {
  user_id: localStorage.getItem( 'user_id') || null,
  user_number: Number(sessionStorage.getItem( 'user_number')) || null,
  user_email: localStorage.getItem( 'user_email') || null,
  valid: localStorage.getItem( 'valid') || null,
  timeout: localStorage.getItem( 'timeout') || null
};

function user_check() {
  const queryString = globalThis.location.search;
  const urlParams = new URLSearchParams(queryString);
  const user_id = urlParams.get('user_id');
  const user_number = urlParams.get('user_number');
  const user_email = urlParams.get('user_email');
  const valid = urlParams.get('valid') || false;
  const timeout = urlParams.get('timeout');
  const selected_category = urlParams.get('category');
  if ( user_id && user_number ) {
    document.getElementById("main_user_id").innerHTML = "Hello!, " + user_id;
  } else {
    document.getElementById("main_user_id").innerHTML = '<a href="/log_in.html" id = "main_user_id" class="text_black">Log in</a>';
  }
}





// Cart Menu- Add to cart
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('add_cart') || event.target.classList.contains('add_cart_2')) {
    const button = event.target;
    const quantity = button.previousElementSibling;
    
    const product_number = Number(button.getAttribute("product_number"));
    const product_name = button.getAttribute("product_name");
    const product_image = button.getAttribute("product_image");
    const product_price = Number(button.getAttribute("product_price"));
    let add_quantity = Number(quantity.value) || 1;
    let cart_item = {product_number,product_name,product_image,product_price, quantity: add_quantity};
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing_item = cart.find(item => item.product_number === product_number);
    if ( existing_item ) {
      existing_item.quantity += add_quantity;
    } else {
      cart.push(cart_item);
    }
    localStorage.setItem("cart",JSON.stringify(cart));

    const adding_Products = document.getElementById("adding_cart");
    // Add the "show" class to DIV
    adding_Products.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ adding_Products.className = adding_Products.className.replace("show", ""); }, 3000);

    }
  
});


function displayProducts_main() {

  const list = document.querySelector("#products_list");

  const send_data = {
  category: list.getAttribute("category_name") || 'all'
  };

  let products = [];

  fetch( '/Products/list.php', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify( send_data)
  })
  .then( response => response.json())
  .then( data => {
    console.log('Response:', data);
    // Store the received data

    if (data.success) {
      sessionStorage.setItem('products', data.products);
      products = data.products;
    } else {
      alert(data.error || 'Failed to view the products.');
    }

  list.innerHTML = "";
  let count = 8;
  
  if (!products || products.length === 0 ) {
    list.innerHTML = "<p class=\"card card_area\">Category not found.</p>";
  } else {
    products.forEach((item) => {
      if ( count > 0 ) {
        count--;
        const cardItem = document.createElement("div");
        cardItem.className = "card card_area";

        const queryString = globalThis.location.search;
        const urlParams = new URLSearchParams(queryString);
        let each_link = "#";
        let selected_category = urlParams.get('category') || 'all';
        if (selected_category) {
          urlParams.set('category', selected_category);
        }

        if ( !urlParams.has('product_number') ){
          urlParams.append('product_number', item.product_number);
        } else {
          urlParams.set('product_number', item.product_number);
        }

        each_link = `${item.product_link}?${urlParams.toString()}`;

        cardItem.innerHTML = `
        <a href="${each_link}">
          <img class="card_image" src="${item.product_image}" alt="" draggable="false">
        </a>
        <div class="card_body">
          <h3 class="card_title">${item.product_name}</h3>
          <p class="price">${prices.format( item.product_price)}</p>
          <input class="add_quantity display_none" value = "1">
          <button class="add_cart"
          product_number="${item.product_number}"
          product_name="${item.product_name}"
          product_image="${item.product_image}"
          product_price="${item.product_price}"
          >Add to Cart</button>
        </div>
        `;
        list.appendChild(cardItem);
      }
    });
  }




  })
  .catch(error => console.error( 'products fetch Error:', error));
  
  
  
}

user_check();
displayProducts_main();