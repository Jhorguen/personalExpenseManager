import fs from "fs";
const filePath = "./data/data.json";

export function abrirJSON() {
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error leyendo el archivo JSON:", err);
        return [];
    }
}

export function guardarJSON(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    } catch (err) {
        console.error("Error guardando el archivo JSON:", err);
    }
}
