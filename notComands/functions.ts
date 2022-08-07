 import { MessageEmbed } from "discord.js";
import * as fs from "fs"


/**
 * Retorna o length do seu objeto
 * @param {Object} yourObject Objeto
 * @returns {Number} tamanho do objeto
 */
export function getObjectSize(yourObject: Object): number {
  let a = 0
  for (let x in yourObject) {
    if (x === "undefined") continue;
    a++;
  }

  return a;
}


/**
 * Cria embeds de tarefas e coloca elas em um array
 * 
 * @param {Number} paginadelete  Numero de tarefas por página
 * @returns {MessageEmbed[]} Array de embeds 
 */
export function embedPages(paginadelete: number): MessageEmbed[] {
  let tarefasJ = JSON.parse(fs.readFileSync('./commands/tarefas.json', 'utf-8'))
  const embeds: MessageEmbed[] = [];
  let embedAlign = 0;
  let a = 0;
  let b = 0;
  let newEmbed;
  for (let x in tarefasJ) {
    if (x === 'default') continue;
    a++;
    b++;
    if (b !== paginadelete) {
      newEmbed = new MessageEmbed()

      newEmbed.addField(`${tarefasJ[x].nome} \t ${tarefasJ[x].curso ? "🖥️" : ""}
*${tarefasJ[x].materia}*
      `,
        `
        ${newLine(tarefasJ[x].descricao1)} 

  ${newLine(tarefasJ[x].descricao2)}

  
  ${newLine(tarefasJ[x].descricao3)}
  
      ${tarefasJ[x].dataT}`, true)
      newEmbed.setTimestamp()
      newEmbed?.addField('\u200B', '\u200B', true) //vertical

      if (embedAlign === 2) {
        newEmbed?.addField('\u200B', '\u200B') //horizontal
        embedAlign = 0
      }
      if (getObjectSize(tarefasJ) === a) {
        newEmbed
          .setTitle('Tarefas da sala')
          .setColor(0xf1dd04)
          .setThumbnail('https://i1.sndcdn.com/avatars-nY46PZXw9sxmELaS-T44ywQ-t500x500.jpg')
          .setAuthor({ name: 'Jorge', iconURL: 'https://cdn.discordapp.com/avatars/391208569317621763/7b050915dcd6c9a7a95e77fd1f30561b.webp' })
          .setTimestamp()
        embeds.push(newEmbed)
      }
    } else {


      newEmbed?.addField(`${tarefasJ[x].nome} \t ${tarefasJ[x].curso ? "🖥️" : ""}
*${tarefasJ[x].materia}*
      `,
        
        `  ${newLine(tarefasJ[x].descricao1)}

  ${newLine(tarefasJ[x].descricao2)}
  
  ${newLine(tarefasJ[x].descricao3)}
  
      ${tarefasJ[x].dataT}`, true)
      newEmbed?.addField('\u200B', '\u200B', true) //vertical

      if (embedAlign === 2) {
        newEmbed?.addField('\u200B', '\u200B') //horizontal
        embedAlign = 0
      }

      if (newEmbed != undefined) {
        newEmbed
          .setTitle('Tarefas da sala')
          .setColor(0xf1dd04)
          .setThumbnail('https://i1.sndcdn.com/avatars-nY46PZXw9sxmELaS-T44ywQ-t500x500.jpg')
          .setAuthor({ name: 'Jorge', iconURL: 'https://cdn.discordapp.com/avatars/391208569317621763/7b050915dcd6c9a7a95e77fd1f30561b.webp' })
          .setTimestamp()

        b = 0
        embeds.push(newEmbed)

      }
    }

  }
  return embeds;
}


/**
 * Essa função filtra do texto o \n (quebra de linha)
 * @param {String} texto texto a ser filtrado
 * @param {String} separador quebra a linha quando encontra esse separador, optinal
 * @returns texto com as quebras de linha
 */
export function newLine(texto: String, separador: string = "\\n") {
  let array = texto.split(" ")
  let idx = array.indexOf(separador)

  while (idx !== -1) {
    array[idx] = "\n"
    idx = array.indexOf(separador, idx + 1)

  }
  const lindo = array.join(" ")
  return lindo
}



  /**
   * salva data no formato .JSON em ./commands/tarefas.json 
   * 
   * @param {Object} data data a ser salva
   * @param {Boolean} consoleLog  Quanto true vai retornar um console.log("salvei data"), optional
   */
export function saveData(data: object, consoleLog: boolean = true) {

  function finished(error: any) {
    if (error) {
      console.error(error)
      return
    }
  }
  const jsonData = JSON.stringify(data, null, 2)
  fs.writeFile("./commands/tarefas.json", jsonData, finished)

  if (consoleLog) {
    console.log("salvei data")
  } 
  return;
}

