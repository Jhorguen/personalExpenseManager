import inquirer from "inquirer";
import chalk from "chalk";
import { abrirJSON, guardarJSON } from "./utils.js";

// Registrar gasto
export async function optionOne() {
    const listGastos = abrirJSON();

    console.log(chalk.yellow("\n=== Registrar Nuevo Gasto ==="));
    const respuestas = await inquirer.prompt([
        { name: "monto", message: "Monto del gasto:", validate: (v) => !isNaN(v) || "Debe ser un número" },
        { name: "categoria", message: "Categoría (comida, transporte, etc.):" },
        { name: "descripcion", message: "Descripción (opcional):" },
        {
            type: "confirm",
            name: "confirmar",
            message: "¿Guardar gasto?",
            default: true,
        },
    ]);

    if (respuestas.confirmar) {
        const nuevoGasto = {
            monto: parseInt(respuestas.monto),
            categoria: respuestas.categoria,
            descripcion: respuestas.descripcion,
            fecha: new Date().toISOString().slice(0, 10),
        };
        listGastos.push(nuevoGasto);
        guardarJSON(listGastos);
        console.log(chalk.green("¡Guardado exitosamente!"));
    }
}

// Listar gastos
export async function optionTwo() {
    const listGastos = abrirJSON();

    const { eleccion } = await inquirer.prompt([
        {
            type: "list",
            name: "eleccion",
            message: "Seleccione una opción:",
            choices: [
                "Ver todos los gastos",
                "Filtrar por categoría",
                "Filtrar por rango de fechas",
                "Regresar al menú principal",
            ],
        },
    ]);

    if (eleccion === "Ver todos los gastos") {
        listGastos.forEach((g, i) => {
            console.log(chalk.cyan(`\n#${i + 1} - ${g.categoria}`));
            console.log(`Monto: $${g.monto}`);
            console.log(`Descripción: ${g.descripcion}`);
            console.log(`Fecha: ${g.fecha}`);
        });
    }

    else if (eleccion === "Filtrar por categoría") {
        const categorias = [...new Set(listGastos.map((g) => g.categoria))];
        if (categorias.length === 0) return console.log("No hay gastos registrados.");
        const { categoria } = await inquirer.prompt([
            { type: "list", name: "categoria", message: "Elija una categoría:", choices: categorias },
        ]);
        const filtrados = listGastos.filter((g) => g.categoria === categoria);
        filtrados.forEach((g, i) => console.log(chalk.magenta(`#${i + 1} - ${g.descripcion} - $${g.monto}`)));
    }

    else if (eleccion === "Filtrar por rango de fechas") {
        const { inicio, fin } = await inquirer.prompt([
            { name: "inicio", message: "Fecha inicio (YYYY-MM-DD):" },
            { name: "fin", message: "Fecha fin (YYYY-MM-DD):" },
        ]);
        const filtrados = listGastos.filter((g) => g.fecha >= inicio && g.fecha <= fin);
        filtrados.forEach((g, i) => console.log(chalk.yellow(`#${i + 1} - ${g.descripcion} - $${g.monto}`)));
    }
}

// Calcular total
export async function optionThree() {
    const listGastos = abrirJSON();

    const { periodo } = await inquirer.prompt([
        {
            type: "list",
            name: "periodo",
            message: "Seleccione el periodo de cálculo:",
            choices: ["Diario", "Semanal", "Mensual", "Regresar"],
        },
    ]);

    if (periodo === "Regresar") return;

    let total = 0;
    if (periodo === "Diario") {
        const { fecha } = await inquirer.prompt([{ name: "fecha", message: "Fecha (YYYY-MM-DD):" }]);
        total = listGastos.filter((g) => g.fecha === fecha).reduce((acc, g) => acc + g.monto, 0);
        console.log(chalk.green(`Total de gastos para el día ${fecha}: $${total}`));
    }

    if (periodo === "Semanal") {
        const { inicio } = await inquirer.prompt([{ name: "inicio", message: "Fecha de inicio (YYYY-MM-DD):" }]);
        const inicioDate = new Date(inicio);
        const finDate = new Date(inicioDate);
        finDate.setDate(inicioDate.getDate() + 6);
        total = listGastos
            .filter((g) => new Date(g.fecha) >= inicioDate && new Date(g.fecha) <= finDate)
            .reduce((acc, g) => acc + g.monto, 0);
        console.log(chalk.green(`Total de gastos desde ${inicio} hasta ${finDate.toISOString().slice(0, 10)}: $${total}`));
    }

    if (periodo === "Mensual") {
        const { año, mes } = await inquirer.prompt([
            { name: "año", message: "Año (YYYY):" },
            { name: "mes", message: "Mes (1-12):" },
        ]);
        total = listGastos
            .filter((g) => {
                const f = new Date(g.fecha);
                return f.getFullYear() == año && f.getMonth() + 1 == mes;
            })
            .reduce((acc, g) => acc + g.monto, 0);
        console.log(chalk.green(`Total de gastos para ${año}-${mes.padStart(2, "0")}: $${total}`));
    }
}

// Salir
export async function optionFive() {
    const { confirmar } = await inquirer.prompt([
        { type: "confirm", name: "confirmar", message: "¿Desea salir del programa?" },
    ]);
    if (confirmar) {
        console.log(chalk.red("Saliendo del programa... ¡Hasta luego!"));
        process.exit(0);
    }
}
