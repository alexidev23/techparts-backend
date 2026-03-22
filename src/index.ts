import express, { type Request, type Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import orderRoutes from "./routes/orderRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import sponsorRoutes from "./routes/sponsorRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://techparts-ecommerce.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "TechParts API funcionando 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/sponsors", sponsorRoutes);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("Error del servidor:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Error no capturado:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Promesa rechazada:", error);
});
