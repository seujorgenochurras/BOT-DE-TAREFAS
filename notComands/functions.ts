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
 * 
 * @param embedType basic, curso, tarefas
 * @param yourEmbed embed a ser adicionado o layout
 * @param tarefa se for do layout tarefas, preciso saber as informações das tarefas
 * @returns seu embed com o layout
 */
function getEmbedLayout(embedType: string, yourEmbed: MessageEmbed | any, tarefa?: string | any): MessageEmbed {
  if (embedType === "basic") {
    yourEmbed
      .setTitle('========================================== \t **Tarefas da sala** ==========================================')
      .setColor(0xf1dd04)
      .setThumbnail('https://i1.sndcdn.com/avatars-nY46PZXw9sxmELaS-T44ywQ-t500x500.jpg')
      .setAuthor({ name: 'Jorge', iconURL: 'https://cdn.discordapp.com/avatars/391208569317621763/7b050915dcd6c9a7a95e77fd1f30561b.webp' })
      .setTimestamp()
  } else if (embedType === "curso") {

    yourEmbed
      .setTitle('Tarefas do curso')
      .setColor(0x1DB8EE)
      .setThumbnail('https://b.thumbs.redditmedia.com/FyLIOzKOXeG4nqUxYv4gRM9JI1Vv39T4u7WSRAbnusY.jpg')
      .setAuthor({ name: 'Jorge', iconURL: 'https://cdn.discordapp.com/avatars/391208569317621763/7b050915dcd6c9a7a95e77fd1f30561b.webp' })
      .setTimestamp()
  } else if (embedType === "tarefas") {

    yourEmbed.addField(`${tarefa.nome} \t ${tarefa.curso ? "🖥️" : ""}
*${tarefa.materia}*
      `,
      `
        ${newLine(tarefa.descricao1)} 

  ${newLine(tarefa.descricao2)}

  
  ${newLine(tarefa.descricao3)}
  
      ${tarefa.dataT}`, true)
    yourEmbed.setTimestamp()
    yourEmbed.addField('\u200B', '\u200B', true) //vertical

  }
  return yourEmbed
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
  let a = 0; //pagina
  let b = 0;
  let newEmbed = new MessageEmbed();
  for (let x in tarefasJ) {
    if (x === 'default') continue;
    a++; //pagina atual
    b++; //pagina temporaria (se b == numero de págima por embed,  b = 0)

    newEmbed = getEmbedLayout("tarefas", newEmbed, tarefasJ[x])

    if (a % 2 === 0) {
      newEmbed.addField('\u200B', '\u200B') //horizontal
    }


    if (newEmbed && b == paginadelete) {
      newEmbed = getEmbedLayout("basic", newEmbed)
      b = 0;
      embeds.push(newEmbed)
      newEmbed = new MessageEmbed()
    }

    if (getObjectSize(tarefasJ) === a) { //se está na ultima página
      newEmbed = getEmbedLayout("basic", newEmbed)
      embeds.push(newEmbed)
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
export function newLine(texto: string, separador: string = "\\n") {
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

