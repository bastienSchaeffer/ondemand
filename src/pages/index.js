import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { graphql } from "gatsby"
import React, { useState } from "react"
import Layout from "../components/layout"
import "./index.css"

// Query for fetching at build-time
export const query = graphql`
  {
    fauna {
      allProducts {
        data {
          _id
          title
          description
          sync_product_id
        }
      }
    }
    allPrintfulProduct {
      nodes {
        slug
        thumbnail_url
        variants {
          sync_product_id
        }
      }
    }
  }
`

// Query for fetching on the client
const GET_REVIEWS = gql`
  query GetReviews($productId: ID!) {
    findProductByID(id: $productId) {
      reviews {
        data {
          _id
          username
          text
        }
      }
    }
  }
`

const IndexPage = props => {
  console.log("--------- PROPS")
  console.log(props)
  const [productId, setProductId] = useState(null)
  const [productToReviews, setProductToReviews] = useState({})

  const { loading, data } = useQuery(GET_REVIEWS, {
    variables: { productId },
    skip: !productId,
  })
  if (!loading && data) {
    productToReviews[productId] = data.findProductByID.reviews.data
    setProductToReviews(productToReviews)
    setProductId(null)
  }

  return (
    <Layout>
      <div className="product-title-container">
        {" "}
        <h2> Products: </h2>
        <span className="explanation">
          {" "}
          (The initial products part of this page is pregenerated at
          compile-time from FaunaDb with Gatsby){" "}
        </span>{" "}
      </div>
      <div className="product-card-container">
        {listProductsAndReviews(
          props.data.fauna.allProducts.data,
          productToReviews,
          setProductId,
          props.data.allPrintfulProduct.nodes
        )}
      </div>
    </Layout>
  )
}

const listProductsAndReviews = (
  products,
  productToReviews,
  setProductId,
  printfulProducts
) => {
  return (
    <ul className="product-card-list">
      {products.map((product, index) => {
        const printfulProduct = printfulProducts.filter(
          item => item.variants[0].sync_product_id === product.sync_product_id
        )
        return listOneProductAndReviews(
          product,
          index,
          productToReviews,
          setProductId,
          printfulProduct
        )
      })}
    </ul>
  )
}

const listOneProductAndReviews = (
  product,
  index,
  productToReviews,
  setProductId,
  printfulProduct
) => {
  return (
    <li key={"product-" + index} className="product-list-item">
      <div className="product-card">
        <div key={"product-name-" + index} className="product-name">
          {" "}
          {product.title}{" "}
        </div>
        <div
          key={"product-description-" + index}
          className="product-description"
        >
          {" "}
          {product.description}{" "}
        </div>
        <div
          key={"product-sync_product_id-" + index}
          className="product-description"
        >
          {" "}
          {product.sync_product_id}
          {/* {JSON.stringify(printfulProduct[0], null, 2)} */}
          {printfulProduct[0].slug}
          <img src={printfulProduct[0].thumbnail_url} alt="" />
        </div>
        <button
          key={"product-reviews-button-" + index}
          className="product-reviews-button"
          onClick={() => setProductId(product._id)}
        >
          {" "}
          Load reviews{" "}
        </button>
      </div>
      {productToReviews[product._id]
        ? renderReviews(productToReviews[product._id], index)
        : null}
    </li>
  )
}
const renderReviews = (reviews, pIndex) => {
  return (
    <div className="product-reviews">
      <div className="explanation">
        {" "}
        (These reviews are injected dynamically by querying FaunaDB){" "}
      </div>
      {renderReviewsList(reviews, pIndex)}
    </div>
  )
}

const renderReviewsList = (reviews, pIndex) => {
  return reviews.map((review, index) => {
    return (
      <div key={"prod-" + pIndex + "-rev-" + index} className="review">
        <div
          key={"prod-" + pIndex + "-rev-user" + index}
          className="review-user"
        >
          {review.username}
        </div>
        <div
          key={"prod-" + pIndex + "-rev-text" + index}
          className="review-text"
        >
          {review.text}
        </div>
      </div>
    )
  })
}

export default IndexPage
