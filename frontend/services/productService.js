const API_URL = "https://muthu-crackers-backend.onrender.com/api/products";

export async function getProducts(page = 1, search = "", category = "") {
  let url = `${API_URL}?page=${page}`;

  if (search) {
    url += `&search=${search}`;
  }

  if (category) {
    url += `&category=${category}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to fetch products");
  }

  return await response.json();
}

export async function getLatestProducts() {
  const response = await fetch(`${API_URL}/latest`);

  if (!response.ok) {
    throw new Error("Unable to fetch latest products");
  }

  return await response.json();
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Unable to fetch product");
  }

  return await response.json();
}
