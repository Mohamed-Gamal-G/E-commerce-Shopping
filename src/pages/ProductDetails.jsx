import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../CartContext";
import toast from "react-hot-toast";
export default function ProductDetails() {
  const { id } = useParams(); // رقم المنتج من الرابط
  const { dispatch } = useContext(CartContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const product = await res.json();
        setData(product);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  if (loading) return <h2 className="loading">Loading...</h2>;
  if (!data) return <h2>Product not found</h2>;
  return (
   <div>
     <div className="product-details">
      {/* Images */}
      <div className="images">
        <img
          src={data.images && data.images.length > 0 ? data.images[0] : data.thumbnail}
          alt={data.title}
        />
      </div>
      <div>
        <h1>{data.title}</h1>
        <p className="rating">✮{data.rating}</p>
        
        <p className="price"> {data.price}$ <span className="discount">-{data.discountPercentage }%</span></p>
        <p className="description">{data.description}</p>
        {/* Extra Details */}
        <div className="extra-details">
          <strong>Brand:</strong> {data.brand} <br />
         {/*  <strong>SKU:</strong> {data.sku} <br /> */}
          <strong>Weight:</strong> {data.weight} <br />
          <strong>Dimensions:</strong>
          <br />
          Width: {data.dimensions.width} <br />
          Height: {data.dimensions.height} <br />
          Depth: {data.dimensions.depth}
        </div>
        {/* Add to Cart Button */}
        <button
          onClick={() => {
            dispatch({ type: "ADD", product: data });
            toast.success("Added to cart 🛒");
          }}
          className="add-to-cart-details">
          Add to Cart
        </button>
      </div>
    </div>
  {/* reviews */}
        <h2 className="Reviews-title">Reviews</h2>
      <div className="reviews">
          {data.reviews.map((review, index) => (
            <div className="review" key={index}>
              <p className="rating"> {review.rating} ★ </p>
              <p className="reviewerName"> {review.reviewerName}</p>
              <p className="comment"> {review.comment}</p>
              <p><strong>Posted on </strong> {new Date(review.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
   </div>
  );
}







/* import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CartContext } from "../CartContext";
export default function ProductDetails() {
    const { dispatch } = useContext(CartContext);
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      return res.json();
    },
  });
  if (isLoading) return <h2 className="Loading">Loading...</h2>;
  return (
    
    <div className="product-details">
      <Link to="/">← Back to Products</Link>
      <div className="continer">
        {<img
          src={data.images && data.images.length > 0 ? data.images[0] : data.thumbnail}
          alt={data.title} />}
        <div className="details">
          <h2>{data.title}</h2>
          {data.category} <br />
          <p>{data.description}</p>
          <strong>Price:</strong> {data.price}$ <br />
          <strong>Rating:</strong> {data.rating} ★
          <br />
          <strong>Brand:</strong> {data.brand} <br />
          <strong>SKU:</strong> {data.sku} <br />
          <strong>Weight:</strong> {data.weight} <br />
          <br />
          <strong>Dimensions:</strong> <br />
          <strong>Width:</strong> {data.dimensions.width} <br />
          <strong>Height:</strong> {data.dimensions.height} <br />
          <strong>Depth:</strong> {data.dimensions.depth} <br />
          <br /> {data.returnPolicy}

          <hr />
          <div className="reviews">
            {data.reviews.map((review, index) => (
              <div className="review" key={index}>
                <p>{/* <strong>Reviewer:</strong> *//*} {review.reviewerName}</p>
<p>{/* <strong>Rating:</strong> *//*} {review.rating} ★ {review.comment}</p>
<p><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</p>

<hr />
 
</div>
))}
</div>
</div>
</div>
</div>
);
} */