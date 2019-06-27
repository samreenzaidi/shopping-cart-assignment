/*-------------------------- slider functonality --------------------------*/
var slideIndex = 1;
var showSlides = (n) => {
    let slides = document.getElementsByClassName("mySlides"),
        dots = document.getElementsByClassName("dot"),
        slideslen = slides.length,
        dotslen=dots.length;
    if (n > slideslen) { slideIndex = 1 }
    if (n < 1) { slideIndex = slideslen }
    for (var i = 0; i < slideslen; i++) {
        slides[i].classList.add("mySlidesHide");
        slides[i].classList.remove("mySlidesShow");
    }
    for (var i = 0; i < dotslen; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].classList.add("mySlidesShow");
    slides[slideIndex - 1].classList.remove("mySlidesHide");
    dots[slideIndex - 1].className += " active";
};

var plusSlides = (n) => {
    showSlides(slideIndex += n);
};

var currentSlide = (n) => {
    showSlides(slideIndex = n);
};

if (document.location.pathname == "/") {
    showSlides(slideIndex);
    document.getElementById("prev").addEventListener("click", function () {
        plusSlides(-1);
    });

    document.getElementById("next").addEventListener("click", function () {
        plusSlides(1);
    });

    $('.dot').click(function () {
        currentSlide(this.dataset.attr);
    });
    setInterval(function () { plusSlides(1); }, 1000);
};

/*-------------------------- Cart functonality --------------------------*/
var allitemInCart = () => {
    var url = window.location.origin + "/cart/allitem";
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", url, true);
    xmlHttpReq.onload = () => {
        if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
            let data = JSON.parse(xmlHttpReq.responseText);
            let totalCheckoutAmt = document.getElementById("total-checkout-amt");
            document.getElementById("item-count").innerHTML = data.itemCounter;
            let totalCheckoutPrice = 0;
            data.productInCart.forEach(element => {
                totalCheckoutPrice = totalCheckoutPrice + element.totalPrice;
            });
            if (totalCheckoutAmt) {
                totalCheckoutAmt.innerHTML = totalCheckoutPrice;
            }
        }
    };
    xmlHttpReq.send();
}

var buyItem = (id, operation) => {
    var url = window.location.origin + '/cart/' + id + '/' + operation;
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", url, true);
    xmlHttpReq.onload = () => {
        if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
            let data = JSON.parse(xmlHttpReq.responseText);
            updateCart(id, data);
        }
    };
    xmlHttpReq.send();
}

var updateCart = (id, data) => {
    document.getElementById('item-count').innerHTML = data.itemCounter;
    if (window.location.pathname == "/cart") {
        document.getElementById('total-item').innerHTML = 'My Cart' + '(' + data.itemCounter + 'item)';
        data.productList.forEach(element => {
            if (element.count == 0) {
                $('#item-' + element.id).remove();
            }
        });
    }
}

var updateCheckoutAmount = () => {
    var totalAmt = document.getElementsByClassName("total-amt");
    let totalCheckoutAmt = document.getElementById("total-checkout-amt");
    let totalCheckoutPrice = 0;
    for (let i = 0; i < totalAmt.length; i++) {
        totalCheckoutPrice = totalCheckoutPrice + parseInt(totalAmt[i].innerHTML);
    }
    if (totalCheckoutAmt) {
        totalCheckoutAmt.innerHTML = totalCheckoutPrice;
    }
}

if (window.location.pathname === "/product") {
    $('.buy-item').click(function () {
        let id = this.dataset.id,
            operation = this.dataset.operation;
        buyItem(id, operation);
    });
}

var addRemoveItem = (id, index, price, task) => {
    var count = parseInt(document.getElementById("prod" + index).innerHTML);
    var totalCost;
    if (task == 'minus') {
        if (count > 0) {
            count = count - 1;
            totalCost = count * price;
            document.getElementById("totalp" + index).innerHTML = totalCost;
            document.getElementById("prod" + index).innerHTML = count;
            buyItem(id, 'remove');
            allitemInCart();
        }
    } else if (task == 'plus') {
        count++;
        totalCost = count * price;
        document.getElementById("totalp" + index).innerHTML = totalCost;
        document.getElementById("prod" + index).innerHTML = count;
        buyItem(id, 'add');
        allitemInCart();
    }
}

if (window.location.pathname === "/cart") {
    $('.add-remove-items').click(function () {
        let id = this.dataset.id,
            operation = this.dataset.operation,
            index = this.dataset.index,
            price = this.dataset.price;
        addRemoveItem(id, index, price, operation);
    });

    allitemInCart();
    updateCheckoutAmount();
}

/*-------------------------- Validation --------------------------*/

let validation = false, data;

(() => {
    var url = "http://localhost:5000/content";
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", url, true);
    xmlHttpReq.onload = () => {
        if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
            data = JSON.parse(xmlHttpReq.responseText);
        }
    };
    xmlHttpReq.send();
})();

var callback = (flag, classname, value) => {
    validation = flag;
    $('.' + classname).html(value);
}

var submitForm = () => {
    let input = document.getElementsByTagName('input'),
        len = input.length;
    for (let i = 0; i < len; i++) {
        if (input[i].value == "") {
            callback(false, "emptyerror", data.error);
        }
    }
    if (validation) {
        window.location.href = window.location.origin + "/";
    }
}

if (document.location.pathname == "/login") {
    document.getElementById("submit-login").addEventListener("click", function () {
        submitForm();
    });
}

if (document.location.pathname == "/register") {
    document.getElementById("submit-register").addEventListener("click", function () {
        submitForm();
    });
}

function validate(event) {
    callback(true, "emptyerror", "");
    switch (event.name) {
        case 'email':
            let emailreg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (event.value) {
                if (emailreg.test(event.value)) {
                    callback(true, "email-error", "");
                } else {
                    callback(false, "email-error", data.emailerror);
                }
            } else {
                callback(false, "email-error", "");
            }
            break;
        case 'password':
            let pwdreg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
            if (event.value) {
                if (pwdreg.test(event.value)) {
                    callback(true, "password-error", "");
                }
                else {
                    callback(false, "password-error", data.pwderror);
                }
            } else {
                callback(false, "password-error", "");
            }
            break;
        case 'cpassword':
            if (event.value) {
                if (event.value === document.getElementById("password").value) {
                    callback(true, 'cpassword-error', "");
                } else {
                    callback(false, 'cpassword-error', data.cpwderror);
                }
            } else {
                callback(false, 'cpassword-error', "");
            }
            break;
    }
}