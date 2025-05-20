const materials = [
    { name: "Copper", price: 50 },
    { name: "Aluminum", price: 20 },
    { name: "Steel", price: 10 },
    { name: "Iron", price: 5 },
    { name: "Brass", price: 30 },
    { name: "Lead", price: 15 },
    { name: "Zinc", price: 25 },
    { name: "Tin", price: 40 },
    { name: "Nickel", price: 60 },
    { name: "Plastic", price: 5 },
    { name: "Glass", price: 3 },
    { name: "Paper", price: 2 },
    { name: "Rubber", price: 10 },
    { name: "Wood", price: 8 },
    { name: "Electronics", price: 50 },
    { name: "Textiles", price: 12 },
        { name: "T.v", price: 100 },
            { name: "fridge", price: 700 }
];

function showSuggestions() {
    const input = document.getElementById("search").value.toLowerCase();
    const suggestionsContainer = document.getElementById("suggestions");
    
    suggestionsContainer.innerHTML = "";
    
    if (input === "") {
        suggestionsContainer.style.display = "none";
        return;
    }
    
    const filteredMaterials = materials.filter(m => m.name.toLowerCase().includes(input));

    filteredMaterials.forEach(material => {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.innerHTML = `<strong>${material.name}</strong> - ₹${material.price} per kg`;
        div.onclick = () => {
            document.getElementById("search").value = material.name;
            suggestionsContainer.style.display = "none";
        };
        suggestionsContainer.appendChild(div);
    });

    suggestionsContainer.style.display = "block";
}
