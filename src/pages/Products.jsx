// src/pages/Products.jsx

import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CartContext } from "../CartContext";
import toast from "react-hot-toast";
export default function Products() {
  const limit = 9; // عدد المنتجات في كل صفحة
  // ====== States ======
  const [page, setPage] = useState(0); // الصفحة الحالية
  const [category, setCategory] = useState("all"); // الفلتر حسب التصنيف
  const [search, setSearch] = useState(""); // قيمة البحث الفعلية
  const [debouncedSearch, setDebouncedSearch] = useState(""); // قيمة البحث بعد debounce
  const [sortOption, setSortOption] = useState(""); // خيار الفرز

  // Cart context
  const { dispatch } = useContext(CartContext);

  // ====== Debounce للبحث ======
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search); // تحديث قيمة البحث بعد تأخير بسيط لتقليل الريكويست
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // ====== Fetch المنتجات ======
  const productsFetch = async (page, category, searchValue) => {
    let url = "";

    if (searchValue) {
      // البحث في جميع المنتجات
      url = `https://dummyjson.com/products/search?q=${searchValue}&limit=${limit}&skip=${page * limit}`;
    } else if (category === "all") {
      // جميع المنتجات بدون فلتر
      url = `https://dummyjson.com/products?limit=${limit}&skip=${page * limit}`;
    } else {
      // منتجات حسب التصنيف
      url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${page * limit}`;
    }

    const res = await fetch(url);
    return res.json();
  };

  // ====== React Query ======
  const { data, isFetching } = useQuery({
    queryKey: ["products", page, category, debouncedSearch], // مفتاح التخزين المؤقت
    queryFn: () => productsFetch(page, category, debouncedSearch),
    keepPreviousData: true, // للحفاظ على البيانات القديمة أثناء التحميل الجديد
  });

  // ====== حساب عدد الصفحات ======
  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="container">
      {/* ====== Search input ====== */}
      <input
        className="search"
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0); // إعادة الصفحة الأولى عند البحث
        }}
      />


      {/* ====== Categories Filter ====== */}
      <div className="categories">
        {[
          "all",
          "groceries",
          "furniture",
          "fragrances",
          "beauty",
          "kitchen-accessories",
          "home-decoration",
          "laptops",
          "mens-shirts",
          "mens-shoes",
          "mens-watches",
          "mobile-accessories",
          "motorcycle",
          "skin-care",
          "smartphones",
          "sports-accessories",
          "sunglasses",
          "tablets",
          "tops",
          "vehicle",
          "womens-bags",
          "womens-dresses",
          "womens-jewellery",
          "womens-shoes",
          "womens-watches",
        ].map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => {
              setCategory(cat);
              setSearch("");
              setPage(0);
            }}
          >
            {cat}
          </button>
        ))}
        
      {/* ====== Sorting Dropdown ====== */}
      <div className="sort-container">
        <label>Sort by: </label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating-asc">Rating: Low → High</option>
          <option value="rating-desc">Rating: High → Low</option>
        </select>
      </div>
      </div>
      

      {/* ====== Loading Indicator ====== */}
      {isFetching && <p className="loading">Loading...</p>}
      {/* ====== Products Grid ====== */}
      <div className="product_continer">
        {data?.products?.length === 0 ? (
          // رسالة عند عدم وجود منتجات مطابقة
          <p className="no-products">
           No products match your search or selected category 😕
          </p>
        ) : (
          data?.products
            .slice() // لتجنب تعديل المصفوفة الأصلية
            .sort((a, b) => {
              // تطبيق الفرز
              switch (sortOption) {
                case "price-asc":
                  return a.price - b.price;
                case "price-desc":
                  return b.price - a.price;
                case "rating-asc":
                  return a.rating - b.rating;
                case "rating-desc":
                  return b.rating - a.rating;
                default:
                  return 0; // بدون فرز
              }
            })
            .map((product) => (
              <div key={product.id} className="product-continer">
                {/* الرابط لصفحة تفاصيل المنتج */}
                <Link to={`/product/${product.id}`} className="product">
                  <img src={product.thumbnail} alt={product.title} />
                  <h2>{product.title}</h2>
                  <p className="rat">✮{product.rating}</p>
                  <p>{product.description}</p>
                  <strong>{product.price}$</strong>
                </Link>

                {/* ====== Add to Cart Button ====== */}
                <button
                  onClick={() => {
                    dispatch({ type: "ADD", product });
                    toast.success("Added to cart 🛒");
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))
        )}
      </div>

      {/* ====== Pagination ====== */}
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

{/* {ele.id}
            <br />
            {ele.title}
            <br />
            {ele.description}
            <br />
            {ele.category}
            <br />
            {ele.price} $
            <br />
            {ele.discountPercentage} $
            <br />
           <strong>stars:</strong>  {ele.rating} 
            <br />
             <strong>stock:</strong> {ele.stock} 
            <br />
            <strong>tags:</strong> {ele.tags} 
            <br />
            <strong>brand:</strong> {ele.brand} 
            <br />
           <strong>sku:</strong> {ele.sku} 
            <br />
           <strong>weight:</strong>  {ele.weight} 
            <br />
           <br />
           <strong>width:</strong>   {ele.dimensions.width} 
           <br />
           <strong>height:</strong>   {ele.dimensions.height} 
           <br />
           <strong>depth:</strong>   {ele.dimensions.depth} 
           <br />
            <strong>warrantyInformation:</strong>  {ele.warrantyInformation} 
           <br />
            <strong>shippingInformation:</strong>  {ele.shippingInformation} 
           <br />
            <strong>availabilityStatus:</strong> {ele.availabilityStatus} 
           <br />
           <br />
           <br />
           <br />
        <div className="reviews">
        {ele.reviews.map((review, index) => (
            <div className="review" key={index}>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</p>
            <p><strong>Reviewer:</strong> {review.reviewerName}</p>
            <p><strong>Email:</strong> {review.reviewerEmail}</p>
            <hr />
            </div>
        ))}
        </div>
          <br /> 
          <br /> 
          <br /> 
          <br /> returnPolicy {ele.returnPolicy} 
          <br />
           minimumOrderQuantity {ele.minimumOrderQuantity} 
           <br />
           meta {ele.meta.createdAt} 
           <br />
           meta {ele.meta.updatedAt} 
           <br />
           meta {ele.meta.barcode} 
           <br />
           meta {ele.meta.qrCode} 
           <br />
              <br />
            {ele.images} 
           <img width={250} src={ele.images} alt="" />
           <img width={250} src={ele.thumbnail} alt="" /> */}