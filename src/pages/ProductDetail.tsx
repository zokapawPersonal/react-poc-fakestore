import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import type { Product } from "../models/Product";
import { getProductById } from "../services/productService";

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMissingId = !id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isMissingId) {
      return;
    }

    let isMounted = true;

    const fetchProductData = async () => {
      try {
        const data = await getProductById(Number(id));

        if (isMounted) {
          setProduct(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          const errorObject = err as Error;
          setError(errorObject.message || "Product not found.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductData();

    return () => {
      isMounted = false;
    };
  }, [id, isMissingId]);

  if (isMissingId) {
    return (
      <Box className="max-w-2xl mx-auto py-20">
        <Alert severity="error" sx={{ mb: 3 }}>
          Product id is missing.
        </Alert>

        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/products")}
        >
          Back to Catalogue
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-20">
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress />
          <Typography sx={{ color: "text.secondary" }}>
            Fetching asset details...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box className="max-w-2xl mx-auto py-20">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Product not found."}
        </Alert>

        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/products")}
        >
          Back to Catalogue
        </Button>
      </Box>
    );
  }

  return (
    <Box className="max-w-5xl mx-auto">
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/products")}
        sx={{ mb: 3 }}
      >
        Back to Catalogue
      </Button>

      <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Box className="flex justify-center items-center bg-gray-50 p-6 rounded-xl border border-gray-100 h-80">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            </Box>

            <Box>
              <Chip
                label={product.category}
                color="primary"
                size="small"
                sx={{ mb: 2, textTransform: "uppercase", fontWeight: 700 }}
              />

              <Typography
                variant="h4"
                sx={{ fontWeight: 800, lineHeight: 1.2, mb: 1 }}
              >
                {product.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Product ID Reference: #{product.id}
              </Typography>

              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {product.description}
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Price Value
              </Typography>

              <Typography
                variant="h4"
                sx={{ color: "success.main", fontWeight: 900 }}
              >
                ${product.price.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};