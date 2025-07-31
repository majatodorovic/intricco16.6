import { useUpSellProducts } from "@/hooks/ecommerce.hooks";
import ProductSlider from "./ProductSlider";

const UpsellProducts = ({ text = "Preporučujemo", id }) => {
  const { data: productDetails } = useUpSellProducts({ id });

  if (!productDetails || !Array.isArray(productDetails.items) || productDetails.items.length === 0) {
    return null; // Nema podataka ili prazna lista – ništa se ne prikazuje
  }

  return <ProductSlider text={text} productDetails={productDetails} />;
};

export default UpsellProducts;
