import inquirer from "inquirer";
import chalk from "chalk";
import { optionOne, optionTwo, optionThree, optionFive } from "./funtions.js";

async function mainMenu() {
    while (true) {
        console.clear();
        console.log(chalk.blueBright("============================================="));
        console.log(chalk.white.bold("        Simulador de Gasto Diario"));
        console.log(chalk.blueBright("============================================="));

        const { opcion } = await inquirer.prompt([
            {
                type: "list",
                name: "opcion",
                message: "Seleccione una opción:",
                choices: [
                    "1. Registrar nuevo gasto",
                    "2. Listar gastos",
                    "3. Calcular total de gastos",
                    "4. Generar reporte (pendiente)",
                    "5. Salir",
                ],
            },
        ]);

        if (opcion.startsWith("1")) await optionOne();
        else if (opcion.startsWith("2")) await optionTwo();
        else if (opcion.startsWith("3")) await optionThree();
        else if (opcion.startsWith("5")) await optionFive();

        await inquirer.prompt([{ name: "continuar", message: "\nPresiona Enter para continuar..." }]);
    }
}

mainMenu();
