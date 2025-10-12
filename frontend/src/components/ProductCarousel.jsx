// import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
// import Loader from "./Loader";
// import Message from "./Message";
// import { useGetTopProductsQuery } from "../slices/productsApiSlice";

// Note: product is picked from database for this carousel display method
// const ProductCarousel = () => {
//   const { data: products, isLoading, error } = useGetTopProductsQuery();

//   return isLoading ? (
//     <Loader />
//   ) : error ? (
//     <Message variant="danger">{error}</Message>
//   ) : (
//     <Carousel pause="hover" className="bg-primary mb-4">
//       {products.map((product) => (
//         <Carousel.Item key={product._id}>
//           <Link to={`/product/${product._id}`}>
//             <Image src={product.image} alt={product.name} fluid />
//             <Carousel.Caption className="carousel-caption">
//               <h4>
//                 {product.name} (₵{product.price})
//               </h4>
//             </Carousel.Caption>
//           </Link>
//         </Carousel.Item>
//       ))}
//     </Carousel>
//   );
// };

const ProductCarousel = () => {
  // const { data: products, isLoading, error } = useGetTopProductsQuery();

  return (
    <Carousel pause="hover" className=" mb-5">
      <Carousel.Item>
        <Image className="img-fluid" src="/images/carousel/1b.png" alt="" />
        {/* <Carousel.Caption>
          <h3>50% Discount Sale</h3>
          <p>Enjoy a discount on all sales this month!</p>
        </Carousel.Caption> */}
      </Carousel.Item>

      <Carousel.Item>
        <Image className="img-fluid" src="/images/carousel/2b.png" alt="" />
        {/* <Carousel.Caption>
          <h3>50% Discount Sale</h3>
          <p>Enjoy a discount on all sales this month!</p>
        </Carousel.Caption> */}
      </Carousel.Item>

      <Carousel.Item>
        <Image className="img-fluid" src="/images/carousel/3b.png" alt="" />
        {/* <Carousel.Caption>
          <h3>50% Discount Sale</h3>
          <p>Enjoy a discount on all sales this month!</p>
        </Carousel.Caption> */}
      </Carousel.Item>
    </Carousel>
  );
};

export default ProductCarousel;
