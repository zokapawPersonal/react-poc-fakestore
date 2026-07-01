import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface NewProductInput {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export const ProductForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<NewProductInput>({
    title: "",
    price: 0,
    description: "",
    category: "",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.price <= 0) {
      setError("Please provide a valid retail price greater than $0.00");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Server rejected product payload registration.");
      }

      const apiResult = await response.json();
      console.log("FakeStore API mock response:", apiResult);

      const hybridNewProduct = {
        ...formData,
        id: Date.now(),
      };

      const localInventory = JSON.parse(
        localStorage.getItem("poc_created_products") || "[]"
      );

      localInventory.unshift(hybridNewProduct);

      localStorage.setItem(
        "poc_created_products",
        JSON.stringify(localInventory)
      );

      alert("Product created successfully.");
      navigate("/products");
    } catch (err) {
      console.error("Add product error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Network communication fault occurred. Please retry."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="p-4 max-w-2xl mx-auto">
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Add New Product
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Register a new item to the local product inventory.
              </Typography>
            </Box>

            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/products")}
            >
              Cancel & Return
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Product Title"
                required
                fullWidth
                placeholder="e.g., Wireless Noise-Cancelling Headphones"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Price ($ USD)"
                  type="number"
                  required
                  fullWidth
                  inputProps={{
                    step: "0.01",
                    min: "0.01",
                  }}
                  placeholder="0.00"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />

                <TextField
                  label="Category"
                  required
                  fullWidth
                  placeholder="e.g., electronics, clothing"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </Stack>

              <TextField
                label="Description"
                required
                fullWidth
                multiline
                rows={4}
                placeholder="Provide product features, specifications, and details..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <TextField
                label="Image URL"
                fullWidth
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={18} /> : <SaveIcon />
                }
              >
                {loading ? "Processing..." : "Save Product Record"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};