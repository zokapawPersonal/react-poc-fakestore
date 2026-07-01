import axiosClient from "../api/axiosClient";
import type { NewProductInput, Product } from "../models/Product";

export const getProducts = async (): Promise<Product[]> => {
  const response = await axiosClient.get<Product[]>("/products");
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axiosClient.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (
  product: NewProductInput
): Promise<Product> => {
  const response = await axiosClient.post<Product>("/products", product);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axiosClient.delete(`/products/${id}`);
};