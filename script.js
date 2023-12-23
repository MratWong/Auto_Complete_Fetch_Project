const autoCompleteInputTag = document.getElementsByClassName("autoCompleteInput")[0];
const resultContainerTag = document.getElementsByClassName("resultContainer")[0];
const productDetailsDiv = document.getElementById("productDetails");

let products;
const resources = "https://fakestoreapi.com/products";

// fetch(resources).then((response) => {
//         const responseData = response.json();
//         return responseData
//     }).then((productDataFromServer) => {
//         products = productDataFromServer;
//         autoCompleteInputTag.disabled = false;
//         console.log(typeof products);
//         updateUI();
//     })
//     .catch((error) => {
//         console.log(error);
//     })


const fetchDataJSON = async() => {
    try {
        const response = await fetch(resources);

        products = await response.json();
        autoCompleteInputTag.disabled = false;
        updateUI();
        console.log(products);
        return products;
    } catch (err) {
        console.log("Error something");
    };

}

fetchDataJSON();

const updateUI = () => {
    let filteredProducts = [];
    autoCompleteInputTag.addEventListener('keyup', (e) => {
        if (
            e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "Enter"
        ) {
            navigateAndSelectProduct(e.key);
            return;
        }

        resultContainerTag.innerHTML = "";
        const searchText = e.target.value.toLowerCase();
        if (searchText.length === 0) {
            return;
        }
        filteredProducts = products.filter(product => {
            return product.title.toLowerCase().includes(searchText);
        })

        const hasProductToShow = filteredProducts.length > 0;
        if (hasProductToShow) {
            for (let i = 0; i < filteredProducts.length; i++) {
                const productItemContainer = document.createElement("div");
                productItemContainer.id = filteredProducts[i].id;
                productItemContainer.classList.add('productItemContainer');

                const productName = document.createElement("div");
                productName.classList.add("productName");
                productName.append(filteredProducts[i].title);

                const productImage = document.createElement("img");
                productImage.classList.add("productImage");
                productImage.src = filteredProducts[i].image;

                productItemContainer.append(productName, productImage);
                resultContainerTag.append(productItemContainer);
            }
        }
    });

    let indexToSelect = -1;
    const navigateAndSelectProduct = (key) => {
        if (key === "ArrowDown") {
            if (indexToSelect === filteredProducts.length - 1) {
                indexToSelect = -1;
                deselectProduct();
                return;
            }
            indexToSelect += 1;
            productItemContainerToSelect = selectProduct(indexToSelect);
            if (indexToSelect > 0) {
                deselectProduct();
            }
            productItemContainerToSelect.classList.add("selected");

        } else if (key === "ArrowUp") {
            if (indexToSelect === -1) {
                return;
            }
            if (indexToSelect === 0) {
                deselectProduct();
                indexToSelect = -1;
                return;
            }
            indexToSelect -= 1;
            deselectProduct();
            const productItemContainerToSelect = selectProduct(indexToSelect);
            productItemContainerToSelect.classList.add("selected");

        } else {
            if (indexToSelect === -1) {
                return;
            }
            productDetailsDiv.innerHTML = "";
            const selectedProduct = filteredProducts[indexToSelect];
            const productDetailsContainer = document.createElement("div");
            productDetailsContainer.classList.add("productDetailsItem");

            const productName = document.createElement("div");
            productName.classList.add('enterProductName');
            productName.append(selectedProduct.title);

            const productImage = document.createElement("img");
            productImage.classList.add("enterProductImage");
            productImage.src = selectedProduct.image;
            productDetailsContainer.append(productName, productImage);
            productDetailsDiv.append(productDetailsContainer);
            deselectProduct();
            indexToSelect = -1;
            resultContainerTag.innerHTML = "";


        }
    }

    const selectProduct = (index) => {
        const productIdToSelect = filteredProducts[index].id.toString();
        const productItemContainerToSelect = document.getElementById(productIdToSelect);

        productItemContainerToSelect.style.backgroundColor = "#3677ee";
        productItemContainerToSelect.firstChild.style.color = "white";
        return productItemContainerToSelect;
    }

    const deselectProduct = () => {
        const productToDeselect = document.getElementsByClassName("selected")[0];
        productToDeselect.style.backgroundColor = "white";
        productToDeselect.firstChild.style.color = "black";
        productToDeselect.classList.remove("selected");
    }
}