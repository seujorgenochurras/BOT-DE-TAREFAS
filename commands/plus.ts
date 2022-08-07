import { ICommand } from "wokcommands";

export default {
  category: 'Test',
  description: 'faz math',
  slash: 'both',
  testOnly: true,
  minArgs: 2,
  expectedArgs: '<num1> <num2>',
  expectedArgsTypes: ["NUMBER", "NUMBER"],


  callback: ({ args }) => {
    console.log("executei /plus")
    const num1 = Number(args[0])
    const num2 =  Number(args[1])
    let result = num1 + num2;
    return `${num1} + ${num2} = ${result} `
  }

} as ICommand