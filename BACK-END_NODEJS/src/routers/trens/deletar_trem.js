import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.delete("/trem:id")
