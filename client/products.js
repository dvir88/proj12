let allProducts = []
let selectedProducts = []


async function loadProducts() {
    const res = await fetch("/products")
    allProducts = await res.json()
    displayProducts(allProducts)
}


function displayProducts(products) {
    const container = document.getElementById("productsContainer")
    container.innerHTML = ""

    products.forEach(product => {
        const div = document.createElement("div")
        div.className = "productBox"
        div.innerHTML = `
            <h3>${product.itemName}</h3>
            <p>price: ${product.price} ₪</p>`

        
        div.addEventListener("click", () => {
            selectedProducts.push(product)
            console.log("selected:", selectedProducts)
        })

        container.appendChild(div)
    })
}


document.getElementById("sortBtn").addEventListener("click", () => {
    const sortType = document.getElementById("sortSelect").value

    if (sortType === "name") {
        allProducts.sort((a, b) => a.itemName.localeCompare(b.itemName))
    } else if (sortType === "price") {
        allProducts.sort((a, b) => a.price - b.price)
    }

    displayProducts(allProducts)
})


document.getElementById("searchInput").addEventListener("input", (e) => {
    const text = e.target.value.toLowerCase()

    const filtered = allProducts.filter(p =>
        p.itemName.toLowerCase().includes(text)
    )

    displayProducts(filtered)
})

document.getElementById("goToBuy").addEventListener("click", () => {
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts))
    window.location.href = "/buy.html"
})

loadProducts()