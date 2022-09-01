import { MessageEmbed, MessageEmbedThumbnail } from "discord.js";
import * as fs from "fs"


class Tarefa{ //coming soon
  
}

export interface tarefa {
  nome: string;
  dataT: string;
  curso: boolean;
  descricao1: string;
  descricao2: string;
  descricao3?: string;
  materia: string;
  grupo: string;

}


export type embedType =
  | "basic"
  | "curso"
  | "tarefas"
  | null


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
function getEmbedLayout(embedType: embedType, yourEmbed: MessageEmbed, tarefa?: tarefa, isCurso?: boolean): MessageEmbed {
  
  switch (embedType) {
    case "basic": {
      yourEmbed
        .setTitle('========== \t **Tarefas da sala** ==========')
        .setColor(0xf1dd04)
        .setThumbnail('https://i1.sndcdn.com/avatars-nY46PZXw9sxmELaS-T44ywQ-t500x500.jpg')
        .setAuthor({ name: 'Jorge', iconURL: 'https://cdn.discordapp.com/avatars/391208569317621763/7b050915dcd6c9a7a95e77fd1f30561b.webp' })
        .setTimestamp()
    }
      break;
    case "curso": {
      yourEmbed
        .setTitle('========== \t **Tarefas do *curso* ** ==========')
        .setColor(0x1DB8EE)
        .setThumbnail('https://b.thumbs.redditmedia.com/FyLIOzKOXeG4nqUxYv4gRM9JI1Vv39T4u7WSRAbnusY.jpg')
        .setAuthor({ name: 'Jorge', iconURL: 'https://cdn.discordapp.com/avatars/391208569317621763/7b050915dcd6c9a7a95e77fd1f30561b.webp' })
        .setTimestamp()

      break;
    }
    case "tarefas": {
      if (!tarefa) { console.log("algo deu errado (case tarefas sem tarefa) "); break; }

      //NÃO TOQUE NO ESPAÇAMENTO ABAIXO

      yourEmbed.addField(`${tarefa.nome} \t ${isCurso ? tarefa.grupo === "GA" ? "🇬 🅰️" : "🇬 🅱️" : tarefa.curso ? "🖥️" : "" /*eu quero palmas por essa*/} 
*${tarefa.materia}*
      `,
        `
        ${newLine(tarefa.descricao1)} 

  ${newLine(tarefa.descricao2)}             

  
  ${tarefa.descricao3 ? newLine(tarefa.descricao3) : ""}

      ${tarefa.dataT}`, true)
      yourEmbed.setTimestamp()
      yourEmbed.addField('\u200B', '\u200B', true) //vertical
    }
  }
  return yourEmbed
}

export let cursoStarterPage: number;
/**
 * Cria embeds de tarefas e coloca elas em um array
 * 
 * @param {Number} paginadelete  Numero de tarefas por página
 * @returns {MessageEmbed[]} Array de embeds 
 */
export function embedPages(paginadelete: number): MessageEmbed[] {
  let tarefasJ = JSON.parse(fs.readFileSync('./commands/tarefas.json', 'utf-8'))
  const embeds: MessageEmbed[] = [];
  let a = 0; //pagina atual
  let b = 0; //pagina temporaria (se b == numero de págima por embed b = 0)
  let c = 0; //pagina temporaria de tarefa do curso
  const arrCurso: MessageEmbed[] = [];
  let embedTarefasAll = new MessageEmbed();
  let embedTarefasCurso = new MessageEmbed();

  for (let x in tarefasJ) {
    if (x === 'default') continue;
    a++;
    b++;

    embedTarefasAll = getEmbedLayout("tarefas", embedTarefasAll, tarefasJ[x])
   
    if (tarefasJ[x].grupo !== null) {
      embedTarefasCurso = getEmbedLayout("tarefas", embedTarefasCurso, tarefasJ[x], true)
      c++;
    }

    if (a % 2 === 0) { //alinhamento horizontal
      embedTarefasAll.addField('\u200B', '\u200B') // field horizontal
    }

    if (b === paginadelete) { //se ta no hora de criar uma nova página

      embedTarefasAll = getEmbedLayout("basic", embedTarefasAll)
      b = 0;
      embeds.push(embedTarefasAll)
      embedTarefasAll = new MessageEmbed()
    }


    if (c === paginadelete) {

      embedTarefasCurso = getEmbedLayout("curso", embedTarefasCurso)
      arrCurso.push(embedTarefasCurso)
      embedTarefasCurso = new MessageEmbed()
      c = 0;
    }
    if (getObjectSize(tarefasJ) === a) { //se está na ultima página

      if (embedTarefasAll.fields.length >= 1) {
        embedTarefasAll = getEmbedLayout("basic", embedTarefasAll)
        embeds.push(embedTarefasAll)
        cursoStarterPage = embeds.length;
      }
      if (embedTarefasCurso) {
        if (embedTarefasCurso.fields.length >= 1) {
          embedTarefasCurso = getEmbedLayout("curso", embedTarefasCurso)
          arrCurso.push(embedTarefasCurso)
        }

        arrCurso.forEach((x) => {
          embeds.push(x)
        })
      }
    }
  }
  return embeds;
}



/**
 * Quebra linha quando encontra um separador (Ex. "\n")
 * @param {String} texto texto a ser filtrado
 * @param {String} separador quebra a linha quando encontra esse separador, optinal
 * @returns string com as quebras de linha
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

