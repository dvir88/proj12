const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts")) || []

function showSummary() {
    const count = selectedProducts.length
    const total = selectedProducts.reduce((sum, p) => sum + p.price, 0)

    document.getElementById("count").innerText = `Number of products: ${count}`
    document.getElementById("total").innerText = `Total price: ${total} ₪`
}

showSummary()

document.getElementById("confirmBuy").addEventListener("click", async () => {
    const userEmail = localStorage.getItem("loggedUser")

    const response = await fetch("/buy", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            userEmail,
            items: selectedProducts
        })
    })

    const text = await response.text()
    alert(text)


    localStorage.removeItem("loggedUser")
    localStorage.removeItem("selectedProducts")

    window.location.href = "/index.html"
})