import classNames from "classnames";
import React from "react";
import Media from "react-media";

import { ProductDescription } from "@components/molecules";
import { ProductGallery } from "@components/organisms";
import AddToCartSection from "@components/organisms/AddToCartSection";

import {
  Breadcrumbs,
  OverlayContext,
  OverlayTheme,
  OverlayType,
} from "../../components";
import { structuredData } from "../../core/SEO/Product/structuredData";
import { generateCategoryUrl, generateProductUrl } from "../../core/utils";
import GalleryCarousel from "./GalleryCarousel";
import OtherProducts from "./Other";
import { IProps } from "./types";

import { smallScreen } from "../../globalStyles/scss/variables.scss";

const populateBreadcrumbs = product => [
  {
    link: generateCategoryUrl(product.category.id, product.category.name),
    value: product.category.name,
  },
  {
    link: generateProductUrl(product.id, product.name),
    value: product.name,
  },
];

const Page: React.FC<
  IProps & {
    queryAttributes: Record<string, string>;
    onAttributeChangeHandler: (slug: string | null, value: string) => void;
  }
> = ({ add, product, items, queryAttributes, onAttributeChangeHandler }) => {
  const overlayContext = React.useContext(OverlayContext);

  const productGallery: React.RefObject<HTMLDivElement> = React.useRef();

  const [variantId, setVariantId] = React.useState("");
  const metaDataObject = product.metadata;

  const getImages = () => {
    if (product.variants && variantId) {
      const variant = product.variants.find(
        variant => variant.id === variantId
      );

      if (variant.images.length > 0) {
        return variant.images;
      }
    }

    return product.images;
  };

  const keepaTrackerImgUrl = (key, width) => {
    let keepaChartUrl;
    metaDataObject.find(i => {
      if (i.key === key) {
        const keepaId = i.value;
        keepaChartUrl = `https://charts.camelcamelcamel.com/de/${keepaId}/new.png?force=1&zero=0&w=${width}&h=400&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=en`;
      }
      return keepaChartUrl;
    });
    return keepaChartUrl;
  };

  const handleAddToCart = (variantId, quantity) => {
    add(variantId, quantity);
    overlayContext.show(OverlayType.cart, OverlayTheme.right);
  };

  const addToCartSection = (
    <AddToCartSection
      items={items}
      productId={product.id}
      name={product.name}
      productVariants={product.variants}
      productPricing={product.pricing}
      queryAttributes={queryAttributes}
      setVariantId={setVariantId}
      variantId={variantId}
      onAddToCart={handleAddToCart}
      onAttributeChangeHandler={onAttributeChangeHandler}
      isAvailableForPurchase={product.isAvailableForPurchase}
      availableForPurchase={product.availableForPurchase}
    />
  );

  let windowWidth;
  if (window.innerWidth <= 400) {
    windowWidth = window.innerWidth - 20;
  } else if (window.innerWidth < 1240 && window.innerWidth > 400) {
    windowWidth = window.innerWidth - 60;
  } else {
    windowWidth = 1200;
  }

  const keyType = "keepa_id";
  const keepaChartUrl = keepaTrackerImgUrl(keyType, windowWidth);
  const keepaChart = (
    <div className="product-page__product__priceTracking">
      {keepaChartUrl && <h3>Amazon price tracker</h3>}
      {keepaChartUrl && <img src={keepaChartUrl} alt="AmazonPriceTracker" />}
    </div>
  );

  return (
    <div className="product-page">
      <div className="container">
        <Breadcrumbs breadcrumbs={populateBreadcrumbs(product)} />
      </div>
      <div className="container">
        <div className="product-page__product">
          <script className="structured-data-list" type="application/ld+json">
            {structuredData(product)}
          </script>
          <Media query={{ maxWidth: smallScreen }}>
            {matches =>
              matches ? (
                <>
                  <GalleryCarousel images={getImages()} />
                  <div className="product-page__product__info">
                    {addToCartSection}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="product-page__product__gallery"
                    ref={productGallery}
                  >
                    <ProductGallery images={getImages()} />
                  </div>
                  <div className="product-page__product__info">
                    <div
                      className={classNames(
                        "product-page__product__info--fixed"
                      )}
                    >
                      {addToCartSection}
                    </div>
                  </div>
                </>
              )
            }
          </Media>
        </div>
      </div>
      <div className="container">
        <div className="product-page__product__description">
          <ProductDescription
            descriptionJson={product.descriptionJson}
            attributes={product.attributes}
          />
        </div>
      </div>
      {keepaChart}
      <OtherProducts products={product.category.products.edges} />
    </div>
  );
};

export default Page;
