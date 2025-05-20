// Material details for price display
const materialDetails = {
  copper: { name: 'Copper', price: '$50/kg', description: 'High-quality copper.' },
  aluminum: { name: 'Aluminum', price: '$20/kg', description: 'Recycled aluminum.' },
  // Add more materials here...
};

// Function to open material details
function openMaterialDetails(material) {
  const materialInfo = materialDetails[material];
  if (materialInfo) {
      const newPage = window.open('', '_blank');
      newPage.document.write(`
      <html>
      <head>
          <title>${materialInfo.name} Details</title>
          <style>
              body { font-family: Arial, sans-serif; padding: 20px; background-color: white; }
              h1 { color: green; }
          </style>
      </head>
      <body>
          <h1>${materialInfo.name}</h1>
          <p>Price: ${materialInfo.price}</p>
          <p>${materialInfo.description}</p>
      </body>
      </html>
      `);
  }
}

// Search bar functionality
document.getElementById('search-bar').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
      searchMaterial();
  }
});

function searchMaterial() {
  const searchValue = document.getElementById('search-bar').value.toLowerCase();
  // Add search functionality logic here...
  alert(`Searching for: ${searchValue}`);
}
