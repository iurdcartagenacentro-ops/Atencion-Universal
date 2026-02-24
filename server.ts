import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "data.json");

// Initial data structure
const getInitialData = () => ({
  users: [],
  appointments: []
});

// Load data from file
const loadData = () => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } catch (e) {
      return getInitialData();
    }
  }
  return getInitialData();
};

// Save data to file
const saveData = (data: any) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // API Routes
  app.post("/api/auth/register", (req, res) => {
    const { name, identifier, password } = req.body;
    const data = loadData();
    
    if (data.users.some((u: any) => u.emailOrPhone === identifier)) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      emailOrPhone: identifier,
      password, // In real app, hash this
      role: 'pastor',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${identifier}`
    };

    data.users.push(newUser);
    saveData(data);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  });

  app.post("/api/auth/login", (req, res) => {
    const { identifier, password } = req.body;
    const data = loadData();
    
    const user = data.users.find((u: any) => u.emailOrPhone === identifier && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.get("/api/appointments", (req, res) => {
    const data = loadData();
    res.json(data.appointments);
  });

  app.post("/api/appointments", (req, res) => {
    const appointment = req.body;
    const data = loadData();
    
    const newAppointment = {
      ...appointment,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      status: 'pending'
    };

    data.appointments.unshift(newAppointment);
    saveData(data);
    res.json(newAppointment);
  });

  app.put("/api/appointments/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const data = loadData();
    
    const index = data.appointments.findIndex((a: any) => a.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    data.appointments[index] = { ...data.appointments[index], ...updates };
    saveData(data);
    res.json(data.appointments[index]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
